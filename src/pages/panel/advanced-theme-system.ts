/**
 * 高级主题系统 - 支持全参数配色计算
 * 解决固定亮度饱和度的局限性，支持从纯黑到纯白的全光谱配色
 */

import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';

// 高级主题配置
export interface AdvancedThemeConfig {
  baseHue: number; // 基础色相 (0-360)
  baseSaturation: number; // 基础饱和度 (0-100)
  baseLightness: number; // 基础亮度 (0-100)
  baseContrast: number; // 基础对比度 (0-100)
  colorMode?: ColorMode; // 色彩模式
  semanticMode?: 'fixed' | 'harmony'; // 语义色相模式
}

// 色彩模式类型
export type ColorMode =
  | 'dark'
  | 'light'
  | 'balanced'
  | 'monochrome'
  | 'vibrant'
  | 'eye-care'
  | 'custom';

// 当前高级主题状态
export const currentAdvancedTheme = createSignal<AdvancedThemeConfig>({
  baseHue: 240,
  baseSaturation: 60,
  baseLightness: 50,
  baseContrast: 50,
  colorMode: 'balanced',
  semanticMode: 'harmony',
});

// 色彩模式预设
export const COLOR_MODE_PRESETS: Record<
  ColorMode,
  Partial<AdvancedThemeConfig>
> = {
  dark: {
    baseLightness: 15,
    baseSaturation: 40,
    baseContrast: 70,
  },
  light: {
    baseLightness: 85,
    baseSaturation: 30,
    baseContrast: 60,
  },
  balanced: {
    baseLightness: 50,
    baseSaturation: 60,
    baseContrast: 50,
  },
  monochrome: {
    baseLightness: 20,
    baseSaturation: 5,
    baseContrast: 80,
  },
  vibrant: {
    baseLightness: 45,
    baseSaturation: 90,
    baseContrast: 70,
  },
  'eye-care': {
    baseLightness: 35,
    baseSaturation: 25,
    baseContrast: 45,
  },
  custom: {}, // 用户自定义，不应用预设
};

// 特殊主题预设
export const SPECIAL_THEMES: Record<string, AdvancedThemeConfig> = {
  // 纯黑主题
  pureBlack: {
    baseHue: 0,
    baseSaturation: 0,
    baseLightness: 5,
    baseContrast: 95,
    colorMode: 'monochrome',
  },

  // 纯白主题
  pureWhite: {
    baseHue: 0,
    baseSaturation: 0,
    baseLightness: 95,
    baseContrast: 90,
    colorMode: 'light',
  },

  // 深海蓝黑
  deepOcean: {
    baseHue: 220,
    baseSaturation: 30,
    baseLightness: 8,
    baseContrast: 85,
    colorMode: 'dark',
  },

  // 森林绿黑
  darkForest: {
    baseHue: 140,
    baseSaturation: 25,
    baseLightness: 12,
    baseContrast: 80,
    colorMode: 'dark',
  },

  // 赛博朋克
  cyberpunk: {
    baseHue: 300,
    baseSaturation: 95,
    baseLightness: 25,
    baseContrast: 90,
    colorMode: 'vibrant',
  },

  // 温暖米色
  warmBeige: {
    baseHue: 35,
    baseSaturation: 20,
    baseLightness: 75,
    baseContrast: 55,
    colorMode: 'light',
  },
};

/**
 * 应用高级主题配置
 */
export function applyAdvancedTheme(config: AdvancedThemeConfig) {
  const root = document.documentElement;

  // 设置基础变量
  root.style.setProperty('--baseHue', config.baseHue.toString());
  root.style.setProperty('--baseSaturation', `${config.baseSaturation}%`);
  root.style.setProperty('--baseLightness', `${config.baseLightness}%`);
  root.style.setProperty('--baseContrast', `${config.baseContrast}%`);

  // 应用色彩模式
  if (config.colorMode && config.colorMode !== 'custom') {
    document.body.classList.remove(
      'color-mode-dark',
      'color-mode-light',
      'color-mode-balanced',
      'color-mode-monochrome',
      'color-mode-vibrant',
      'color-mode-eye-care'
    );
    document.body.classList.add(`color-mode-${config.colorMode}`);
  }

  // 应用语义色相模式
  if (config.semanticMode) {
    document.body.classList.remove('semantic-fixed', 'semantic-harmony');
    document.body.classList.add(`semantic-${config.semanticMode}`);
  }

  // 更新状态
  currentAdvancedTheme.set(config);

  // 保存到本地存储
  localStorage.setItem('advanced-theme-config', JSON.stringify(config));
}

/**
 * 加载保存的高级主题
 */
export function loadSavedAdvancedTheme() {
  try {
    const saved = localStorage.getItem('advanced-theme-config');
    if (saved) {
      const config = JSON.parse(saved) as AdvancedThemeConfig;
      applyAdvancedTheme(config);
    } else {
      applyAdvancedTheme(currentAdvancedTheme.get());
    }
  } catch {
    applyAdvancedTheme(currentAdvancedTheme.get());
  }
}

/**
 * 应用色彩模式预设
 */
export function applyColorModePreset(mode: ColorMode) {
  const current = currentAdvancedTheme.get();
  const preset = COLOR_MODE_PRESETS[mode];

  applyAdvancedTheme({
    ...current,
    ...preset,
    colorMode: mode,
  });
}

/**
 * 应用特殊主题
 */
export function applySpecialTheme(themeName: keyof typeof SPECIAL_THEMES) {
  applyAdvancedTheme(SPECIAL_THEMES[themeName]);
}

/**
 * 色彩计算工具
 */
export class ColorCalculator {
  /**
   * 根据基础参数计算背景色亮度
   */
  static calculateBackgroundLightness(
    baseLightness: number,
    level: 'primary' | 'secondary' | 'tertiary'
  ): number {
    const multipliers = {
      primary: 0.16,
      secondary: 0.24,
      tertiary: 0.32,
    };

    if (baseLightness > 70) {
      // 浅色模式：背景比基础亮度更亮
      return Math.min(
        100,
        baseLightness + (100 - baseLightness) * multipliers[level]
      );
    } else {
      // 深色模式：背景比基础亮度更暗
      return baseLightness * multipliers[level];
    }
  }

  /**
   * 根据基础参数计算文本色亮度
   */
  static calculateTextLightness(
    baseLightness: number,
    level: 'primary' | 'secondary' | 'tertiary'
  ): number {
    const adjustments = {
      primary: 0.05,
      secondary: 0.25,
      tertiary: 0.45,
    };

    if (baseLightness > 50) {
      // 浅色模式：文本为深色
      return baseLightness * adjustments[level];
    } else {
      // 深色模式：文本为浅色
      return 100 - baseLightness * adjustments[level];
    }
  }

  /**
   * 计算对比度是否符合WCAG标准
   */
  static calculateContrastRatio(
    lightness1: number,
    lightness2: number
  ): number {
    const l1 = lightness1 / 100;
    const l2 = lightness2 / 100;
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 自动调整对比度以符合可访问性标准
   */
  static ensureAccessibility(
    backgroundLightness: number,
    textLightness: number,
    minRatio = 4.5
  ): number {
    let adjustedTextLightness = textLightness;
    const ratio = this.calculateContrastRatio(
      backgroundLightness,
      adjustedTextLightness
    );

    if (ratio < minRatio) {
      // 如果对比度不够，调整文本亮度
      if (backgroundLightness > 50) {
        // 浅色背景，让文本更暗
        adjustedTextLightness = Math.max(0, adjustedTextLightness - 20);
      } else {
        // 深色背景，让文本更亮
        adjustedTextLightness = Math.min(100, adjustedTextLightness + 20);
      }
    }

    return adjustedTextLightness;
  }
}

/**
 * 高级主题编辑器组件
 */
export function renderAdvancedThemeEditor() {
  fdom.div({
    className: 'ds-card ds-card--elevated',
    children() {
      fdom.div({
        className: 'ds-card__header',
        children() {
          fdom.h3({
            className: 'ds-card__title',
            children: '🎛️ 高级主题编辑器',
          });
          fdom.p({
            className: 'ds-card__subtitle',
            children: '全参数配色系统，支持从纯黑到纯白的任意配色',
          });
        },
      });

      fdom.div({
        className: 'ds-card__body space-y-6',
        children() {
          // 特殊主题预设
          renderSpecialThemePresets();

          // 色彩模式选择
          renderColorModeSelector();

          // 参数调节
          renderParameterControls();

          // 实时预览
          renderLivePreview();

          // 可访问性检查
          renderAccessibilityCheck();
        },
      });
    },
  });
}

// 特殊主题预设
function renderSpecialThemePresets() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '🌟 特殊主题预设',
      });
      fdom.div({
        className: 'grid grid-cols-2 md:grid-cols-3 gap-2',
        children() {
          Object.entries(SPECIAL_THEMES).forEach(([key, theme]) => {
            fdom.button({
              className: 'ds-button ds-button--ghost p-3 text-xs',
              onClick() {
                applySpecialTheme(key as keyof typeof SPECIAL_THEMES);
              },
              children() {
                fdom.div({
                  className: 'space-y-1',
                  children() {
                    // 预览色块
                    fdom.div({
                      className: 'w-full h-6 rounded mb-1',
                      s_background: `hsl(${theme.baseHue}, ${theme.baseSaturation}%, ${theme.baseLightness}%)`,
                    });

                    // 名称
                    fdom.div({
                      className: 'text-white font-medium',
                      children: key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase()),
                    });

                    // 参数
                    fdom.div({
                      className: 'text-white/70',
                      children: `L${theme.baseLightness}% S${theme.baseSaturation}%`,
                    });
                  },
                });
              },
            });
          });
        },
      });
    },
  });
}

// 色彩模式选择器
function renderColorModeSelector() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '🎨 色彩模式',
      });
      fdom.div({
        className: 'grid grid-cols-2 md:grid-cols-3 gap-2',
        children() {
          const modes: {
            key: ColorMode;
            name: string;
            desc: string;
            emoji: string;
          }[] = [
            { key: 'dark', name: '深色', desc: '低亮度', emoji: '🌙' },
            { key: 'light', name: '浅色', desc: '高亮度', emoji: '☀️' },
            { key: 'balanced', name: '平衡', desc: '中等', emoji: '⚖️' },
            { key: 'monochrome', name: '单色', desc: '黑白', emoji: '⚫' },
            { key: 'vibrant', name: '鲜艳', desc: '高饱和', emoji: '🌈' },
            { key: 'eye-care', name: '护眼', desc: '低饱和', emoji: '👁️' },
          ];

          modes.forEach(mode => {
            fdom.button({
              className() {
                const current = currentAdvancedTheme.get();
                const isActive = current.colorMode === mode.key;
                return `ds-button ds-button--ghost p-2 text-xs ${
                  isActive ? 'border-white/30 bg-white/10' : ''
                }`;
              },
              onClick() {
                applyColorModePreset(mode.key);
              },
              children() {
                fdom.div({
                  className: 'text-center',
                  children() {
                    fdom.div({
                      className: 'text-lg mb-1',
                      children: mode.emoji,
                    });
                    fdom.div({
                      className: 'font-medium',
                      children: mode.name,
                    });
                    fdom.div({
                      className: 'text-white/70',
                      children: mode.desc,
                    });
                  },
                });
              },
            });
          });
        },
      });
    },
  });
}

// 参数控制
function renderParameterControls() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '🎛️ 参数调节',
      });
      fdom.div({
        className: 'space-y-4',
        children() {
          // 基础色相
          renderParameterSlider(
            '色相 (Hue)',
            () => currentAdvancedTheme.get().baseHue,
            value => {
              const current = currentAdvancedTheme.get();
              applyAdvancedTheme({
                ...current,
                baseHue: value,
                colorMode: 'custom',
              });
            },
            0,
            360,
            1
          );

          // 饱和度
          renderParameterSlider(
            '饱和度 (Saturation)',
            () => currentAdvancedTheme.get().baseSaturation,
            value => {
              const current = currentAdvancedTheme.get();
              applyAdvancedTheme({
                ...current,
                baseSaturation: value,
                colorMode: 'custom',
              });
            },
            0,
            100,
            1
          );

          // 亮度
          renderParameterSlider(
            '亮度 (Lightness)',
            () => currentAdvancedTheme.get().baseLightness,
            value => {
              const current = currentAdvancedTheme.get();
              applyAdvancedTheme({
                ...current,
                baseLightness: value,
                colorMode: 'custom',
              });
            },
            0,
            100,
            1
          );

          // 对比度
          renderParameterSlider(
            '对比度 (Contrast)',
            () => currentAdvancedTheme.get().baseContrast,
            value => {
              const current = currentAdvancedTheme.get();
              applyAdvancedTheme({
                ...current,
                baseContrast: value,
                colorMode: 'custom',
              });
            },
            0,
            100,
            1
          );
        },
      });
    },
  });
}

// 参数滑块
function renderParameterSlider(
  label: string,
  getValue: () => number,
  onChange: (value: number) => void,
  min: number,
  max: number,
  step: number
) {
  fdom.div({
    className: 'space-y-2',
    children() {
      fdom.div({
        className: 'flex justify-between items-center',
        children() {
          fdom.label({
            className: 'text-white font-medium text-sm',
            children: label,
          });
          fdom.span({
            className: 'text-white/70 text-sm',
            children() {
              return `${Math.round(getValue())}${
                label.includes('Hue') ? '°' : '%'
              }`;
            },
          });
        },
      });

      fdom.input({
        type: 'range',
        min: min.toString(),
        max: max.toString(),
        step: step.toString(),
        value: () => getValue().toString(),
        className:
          'w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider',
        onInput(e: any) {
          onChange(parseFloat(e.target.value));
        },
      });
    },
  });
}

// 实时预览
function renderLivePreview() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '👁️ 实时预览',
      });
      fdom.div({
        className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        children() {
          // 背景色预览
          fdom.div({
            className: 'space-y-2',
            children() {
              fdom.div({
                className: 'text-white/70 text-sm',
                children: '背景色层级',
              });

              const levels: Array<'primary' | 'secondary' | 'tertiary'> = [
                'primary',
                'secondary',
                'tertiary',
              ];
              levels.forEach((level, index) => {
                fdom.div({
                  className:
                    'h-8 rounded flex items-center justify-center text-white text-xs font-medium',
                  s_background: `var(--bg-${level})`,
                  children: `背景 ${index + 1}`,
                });
              });
            },
          });

          // 文本色预览
          fdom.div({
            className: 'space-y-2',
            children() {
              fdom.div({
                className: 'text-white/70 text-sm',
                children: '文本色层级',
              });

              fdom.div({
                className: 'p-3 rounded',
                s_background: 'var(--bg-primary)',
                children() {
                  fdom.div({
                    className: 'space-y-1',
                    children() {
                      fdom.div({
                        s_color: 'var(--text-primary)',
                        className: 'text-sm font-medium',
                        children: '主要文本',
                      });
                      fdom.div({
                        s_color: 'var(--text-secondary)',
                        className: 'text-sm',
                        children: '次要文本',
                      });
                      fdom.div({
                        s_color: 'var(--text-tertiary)',
                        className: 'text-xs',
                        children: '三级文本',
                      });
                      fdom.div({
                        s_color: 'var(--text-disabled)',
                        className: 'text-xs',
                        children: '禁用文本',
                      });
                    },
                  });
                },
              });
            },
          });
        },
      });
    },
  });
}

// 可访问性检查
function renderAccessibilityCheck() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '♿ 可访问性检查',
      });

      fdom.div({
        className: 'space-y-2',
        children() {
          const config = currentAdvancedTheme.get();
          const bgLightness = ColorCalculator.calculateBackgroundLightness(
            config.baseLightness,
            'primary'
          );
          const textLightness = ColorCalculator.calculateTextLightness(
            config.baseLightness,
            'primary'
          );
          const contrastRatio = ColorCalculator.calculateContrastRatio(
            bgLightness,
            textLightness
          );

          fdom.div({
            className:
              'flex justify-between items-center p-2 bg-black/20 rounded',
            children() {
              fdom.span({
                className: 'text-white/70 text-sm',
                children: '对比度比例',
              });
              fdom.span({
                className: 'text-white text-sm font-mono',
                children: `${contrastRatio.toFixed(2)}:1`,
              });
            },
          });

          fdom.div({
            className:
              'flex justify-between items-center p-2 bg-black/20 rounded',
            children() {
              fdom.span({
                className: 'text-white/70 text-sm',
                children: 'WCAG AA 标准',
              });
              fdom.span({
                className: `text-sm font-medium ${
                  contrastRatio >= 4.5 ? 'text-green-400' : 'text-red-400'
                }`,
                children: contrastRatio >= 4.5 ? '✅ 通过' : '❌ 未通过',
              });
            },
          });

          fdom.div({
            className:
              'flex justify-between items-center p-2 bg-black/20 rounded',
            children() {
              fdom.span({
                className: 'text-white/70 text-sm',
                children: 'WCAG AAA 标准',
              });
              fdom.span({
                className: `text-sm font-medium ${
                  contrastRatio >= 7 ? 'text-green-400' : 'text-yellow-400'
                }`,
                children: contrastRatio >= 7 ? '✅ 通过' : '⚠️ 未通过',
              });
            },
          });
        },
      });
    },
  });
}

/**
 * 初始化高级主题系统
 */
export function initAdvancedThemeSystem() {
  loadSavedAdvancedTheme();
}
