import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from './window';
import {
  renderAdvancedThemeEditor,
  applySpecialTheme,
  currentAdvancedTheme,
} from './advanced-theme-system';

// 高级主题演示窗口
export const advancedThemeDemo = panel(function () {
  return {
    title: '高级主题系统',
    typeIcon: '🎛️',
    className: 'ds-window ds-window--primary',
    width: createSignal(1000),
    height: createSignal(800),
    children() {
      fdom.div({
        className: 'flex-1 ds-scrollbar overflow-y-auto p-6 space-y-6',
        children() {
          // 系统介绍
          renderSystemIntroduction();

          // 高级主题编辑器
          renderAdvancedThemeEditor();

          // 对比演示
          renderComparisonDemo();
        },
      });
    },
  };
});

// 系统介绍
function renderSystemIntroduction() {
  fdom.div({
    className: 'ds-card',
    children() {
      fdom.div({
        className: 'ds-card__header',
        children() {
          fdom.h3({
            className: 'ds-card__title',
            children: '🚀 高级主题系统特性',
          });
        },
      });

      fdom.div({
        className: 'ds-card__body',
        children() {
          fdom.div({
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
            children() {
              // 特性列表
              fdom.div({
                className: 'space-y-4',
                children() {
                  fdom.h4({
                    className: 'text-white font-medium',
                    children: '✨ 核心特性',
                  });

                  const features = [
                    {
                      icon: '🎨',
                      title: '全参数控制',
                      desc: '色相、饱和度、亮度、对比度四维调节',
                    },
                    {
                      icon: '🌈',
                      title: '无限配色',
                      desc: '支持从纯黑到纯白的全光谱配色',
                    },
                    {
                      icon: '🧮',
                      title: '动态计算',
                      desc: '所有颜色基于参数实时计算，无固定值',
                    },
                    {
                      icon: '♿',
                      title: '可访问性',
                      desc: '自动检查WCAG对比度标准',
                    },
                    {
                      icon: '🎭',
                      title: '色彩模式',
                      desc: '深色、浅色、单色等预设模式',
                    },
                    {
                      icon: '🔬',
                      title: '科学配色',
                      desc: '基于色彩理论的和谐配色算法',
                    },
                  ];

                  features.forEach(feature => {
                    fdom.div({
                      className: 'flex items-start gap-3',
                      children() {
                        fdom.span({
                          className: 'text-lg',
                          children: feature.icon,
                        });
                        fdom.div({
                          children() {
                            fdom.div({
                              className: 'text-white font-medium text-sm',
                              children: feature.title,
                            });
                            fdom.div({
                              className: 'text-white/70 text-xs',
                              children: feature.desc,
                            });
                          },
                        });
                      },
                    });
                  });
                },
              });

              // 快速体验
              fdom.div({
                className: 'space-y-4',
                children() {
                  fdom.h4({
                    className: 'text-white font-medium',
                    children: '🚀 快速体验',
                  });

                  fdom.div({
                    className: 'space-y-2',
                    children() {
                      fdom.button({
                        className: 'ds-button ds-button--primary w-full',
                        onClick() {
                          applySpecialTheme('pureBlack');
                        },
                        children: '🖤 纯黑主题',
                      });

                      fdom.button({
                        className: 'ds-button ds-button--secondary w-full',
                        onClick() {
                          applySpecialTheme('pureWhite');
                        },
                        children: '🤍 纯白主题',
                      });

                      fdom.button({
                        className: 'ds-button ds-button--success w-full',
                        onClick() {
                          applySpecialTheme('cyberpunk');
                        },
                        children: '🌆 赛博朋克',
                      });

                      fdom.button({
                        className: 'ds-button ds-button--ghost w-full',
                        onClick() {
                          applySpecialTheme('deepOcean');
                        },
                        children: '🌊 深海蓝黑',
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

// 对比演示
function renderComparisonDemo() {
  fdom.div({
    className: 'ds-card',
    children() {
      fdom.div({
        className: 'ds-card__header',
        children() {
          fdom.h3({
            className: 'ds-card__title',
            children: '📊 系统对比演示',
          });
          fdom.p({
            className: 'ds-card__subtitle',
            children: '展示不同参数配置下的视觉效果差异',
          });
        },
      });

      fdom.div({
        className: 'ds-card__body space-y-6',
        children() {
          // 亮度对比
          renderLightnessComparison();

          // 饱和度对比
          renderSaturationComparison();

          // 实际应用对比
          renderPracticalComparison();
        },
      });
    },
  });
}

// 亮度对比
function renderLightnessComparison() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '💡 亮度对比 (相同色相和饱和度)',
      });

      fdom.div({
        className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        children() {
          const lightnessModes = [
            { name: '深色模式', lightness: 15, desc: 'L15%' },
            { name: '平衡模式', lightness: 50, desc: 'L50%' },
            { name: '浅色模式', lightness: 85, desc: 'L85%' },
          ];

          lightnessModes.forEach(mode => {
            fdom.div({
              className: 'p-4 rounded-lg border border-white/20',
              s_background: `hsl(240, 60%, ${mode.lightness * 0.16}%)`,
              children() {
                fdom.div({
                  className: 'text-center space-y-2',
                  children() {
                    fdom.div({
                      className: 'font-medium text-sm',
                      s_color: `hsl(60, 15%, ${
                        mode.lightness > 50
                          ? mode.lightness * 0.1
                          : 100 - mode.lightness * 0.05
                      }%)`,
                      children: mode.name,
                    });
                    fdom.div({
                      className: 'text-xs',
                      s_color: `hsl(60, 15%, ${
                        mode.lightness > 50
                          ? mode.lightness * 0.3
                          : 100 - mode.lightness * 0.25
                      }%)`,
                      children: mode.desc,
                    });

                    // 示例按钮
                    fdom.button({
                      className: 'px-3 py-1 rounded text-xs font-medium',
                      s_background: `hsl(240, 60%, ${
                        mode.lightness > 50
                          ? mode.lightness - 20
                          : mode.lightness + 20
                      }%)`,
                      s_color: `hsl(60, 15%, ${
                        mode.lightness > 50 ? 20 : 90
                      }%)`,
                      children: '示例按钮',
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

// 饱和度对比
function renderSaturationComparison() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '🌈 饱和度对比 (相同色相和亮度)',
      });

      fdom.div({
        className: 'grid grid-cols-1 md:grid-cols-4 gap-3',
        children() {
          const saturationModes = [
            { name: '单色', saturation: 5, desc: 'S5%' },
            { name: '低饱和', saturation: 25, desc: 'S25%' },
            { name: '中饱和', saturation: 60, desc: 'S60%' },
            { name: '高饱和', saturation: 90, desc: 'S90%' },
          ];

          saturationModes.forEach(mode => {
            fdom.div({
              className: 'p-3 rounded-lg border border-white/20',
              s_background: `hsl(240, ${mode.saturation * 0.33}%, 8%)`,
              children() {
                fdom.div({
                  className: 'text-center space-y-2',
                  children() {
                    fdom.div({
                      className: 'font-medium text-xs',
                      s_color: `hsl(60, ${mode.saturation * 0.15}%, 95%)`,
                      children: mode.name,
                    });
                    fdom.div({
                      className: 'text-xs',
                      s_color: `hsl(60, ${mode.saturation * 0.15}%, 75%)`,
                      children: mode.desc,
                    });

                    // 色彩示例
                    fdom.div({
                      className: 'w-full h-4 rounded',
                      s_background: `hsl(240, ${mode.saturation}%, 50%)`,
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

// 实际应用对比
function renderPracticalComparison() {
  fdom.div({
    children() {
      fdom.h4({
        className: 'text-white font-medium mb-3',
        children: '💼 实际应用对比',
      });

      fdom.div({
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        children() {
          // 传统固定配色
          fdom.div({
            className: 'space-y-3',
            children() {
              fdom.div({
                className: 'text-center text-white/70 text-sm',
                children: '❌ 传统固定配色',
              });

              fdom.div({
                className: 'p-4 rounded-lg',
                s_background: 'hsl(240, 20%, 8%)', // 固定值
                children() {
                  fdom.div({
                    className: 'space-y-2',
                    children() {
                      fdom.div({
                        s_color: 'hsl(0, 0%, 95%)', // 固定白色
                        className: 'font-medium text-sm',
                        children: '固定白色文本',
                      });
                      fdom.div({
                        className: 'flex gap-2',
                        children() {
                          fdom.button({
                            className: 'px-3 py-1 rounded text-xs',
                            s_background: 'hsl(140, 60%, 50%)', // 固定绿色
                            s_color: 'white',
                            children: '成功',
                          });
                          fdom.button({
                            className: 'px-3 py-1 rounded text-xs',
                            s_background: 'hsl(0, 60%, 50%)', // 固定红色
                            s_color: 'white',
                            children: '错误',
                          });
                        },
                      });
                    },
                  });
                },
              });

              fdom.div({
                className: 'text-xs text-white/50 text-center',
                children: '颜色突兀，缺乏和谐感',
              });
            },
          });

          // 动态计算配色
          fdom.div({
            className: 'space-y-3',
            children() {
              fdom.div({
                className: 'text-center text-white/70 text-sm',
                children: '✅ 动态计算配色',
              });

              fdom.div({
                className: 'p-4 rounded-lg',
                s_background: 'var(--bg-primary)', // 动态计算
                children() {
                  fdom.div({
                    className: 'space-y-2',
                    children() {
                      fdom.div({
                        s_color: 'var(--text-primary)', // 动态计算
                        className: 'font-medium text-sm',
                        children: '动态计算文本',
                      });
                      fdom.div({
                        className: 'flex gap-2',
                        children() {
                          fdom.button({
                            className: 'px-3 py-1 rounded text-xs',
                            s_background: 'hsl(var(--successHue), 60%, 50%)', // 基于主题计算
                            s_color: 'white',
                            children: '成功',
                          });
                          fdom.button({
                            className: 'px-3 py-1 rounded text-xs',
                            s_background: 'hsl(var(--dangerHue), 60%, 50%)', // 基于主题计算
                            s_color: 'white',
                            children: '错误',
                          });
                        },
                      });
                    },
                  });
                },
              });

              fdom.div({
                className: 'text-xs text-white/50 text-center',
                children: '色彩和谐，自动适配',
              });
            },
          });
        },
      });

      // 当前配置显示
      fdom.div({
        className: 'mt-6 p-4 bg-black/20 rounded-lg',
        children() {
          fdom.div({
            className: 'text-white font-medium text-sm mb-2',
            children: '📊 当前主题参数',
          });
          fdom.div({
            className: 'text-xs text-white/70 space-y-1',
            children() {
              const config = currentAdvancedTheme.get();
              fdom.div({
                children: `色相: ${Math.round(
                  config.baseHue
                )}° | 饱和度: ${Math.round(
                  config.baseSaturation
                )}% | 亮度: ${Math.round(
                  config.baseLightness
                )}% | 对比度: ${Math.round(config.baseContrast)}%`,
              });
              fdom.div({
                children: `模式: ${config.colorMode || 'custom'} | 语义: ${
                  config.semanticMode || 'harmony'
                }`,
              });
            },
          });
        },
      });
    },
  });
}
