import { panel } from 'daisy-mobile-helper';
import { fdom } from 'mve-dom';
import { renderInput } from 'mve-dom-helper';
import { level, scheme, sourceColor } from './context';

export const themeChooser = panel(function () {
  return {
    title: '主题选择器',
    typeIcon: '🎨',
    width: 400,
    height: 600,
    children() {
      fdom.div({
        className: 'bg-white rounded-lg border border-gray-200 p-4 mb-4',
        children() {
          fdom.h3({
            className: 'text-lg font-semibold mb-3',
            children: '🎨 源颜色',
          });

          fdom.div({
            className: 'flex items-center gap-4',
            children() {
              // 颜色输入框
              fdom.label({
                className:
                  'w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300 flex-shrink-0',
                s_background: sourceColor.get,
                children() {
                  renderInput(
                    sourceColor.get,
                    sourceColor.set,
                    fdom.input({
                      type: 'color',
                      className: 'w-0 h-0 opacity-0',
                    })
                  );
                },
              });

              // 十六进制输入框
              renderInput(
                sourceColor.get,
                value => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    sourceColor.set(value);
                  }
                },
                fdom.input({
                  type: 'text',
                  className:
                    'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  s_fontFamily: 'monospace',
                })
              );
            },
          });

          fdom.p({
            className: 'text-sm text-gray-600 mt-3',
            children:
              '选择一个主色调，系统将自动生成完整的Material Design 3.0调色板',
          });
        },
      });
      renderSchemeSelector();
      renderContrastLevelSelector();
    },
  };
});

function renderSchemeSelector() {
  fdom.div({
    className: 'bg-white rounded-lg border border-gray-200 p-4 mb-4',
    children() {
      fdom.h3({
        className: 'text-lg font-semibold mb-3',
        children: '🌓 主题模式',
      });

      fdom.div({
        className: 'flex gap-2',
        children() {
          // 浅色模式按钮
          fdom.button({
            className() {
              const baseClasses =
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors';
              return scheme.get() === 'light'
                ? `${baseClasses} bg-blue-500 text-white`
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
            },
            children: '☀️ 浅色模式',
            onClick() {
              scheme.set('light');
            },
          });

          // 深色模式按钮
          fdom.button({
            className() {
              const baseClasses =
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors';
              return scheme.get() === 'dark'
                ? `${baseClasses} bg-blue-500 text-white`
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
            },
            children: '🌙 深色模式',
            onClick() {
              scheme.set('dark');
            },
          });
        },
      });

      fdom.p({
        className: 'text-sm text-gray-600 mt-3',
        children: '选择浅色或深色主题模式，所有组件将自动适配',
      });
    },
  });
}

function renderContrastLevelSelector() {
  fdom.div({
    className: 'bg-white rounded-lg border border-gray-200 p-4',
    children() {
      fdom.h3({
        className: 'text-lg font-semibold mb-3',
        children: '🔍 对比度级别',
      });

      fdom.div({
        className: 'flex gap-2',
        children() {
          // 标准对比度
          fdom.button({
            className() {
              const baseClasses =
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors';
              return level.get() === 0
                ? `${baseClasses} bg-blue-500 text-white`
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
            },
            children: '标准',
            onClick() {
              level.set(0);
            },
          });

          // 中等对比度
          fdom.button({
            className() {
              const baseClasses =
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors';
              return level.get() === 1
                ? `${baseClasses} bg-blue-500 text-white`
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
            },
            children: '中等',
            onClick() {
              level.set(1);
            },
          });

          // 高对比度
          fdom.button({
            className() {
              const baseClasses =
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors';
              return level.get() === 2
                ? `${baseClasses} bg-blue-500 text-white`
                : `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
            },
            children: '高对比度',
            onClick() {
              level.set(2);
            },
          });
        },
      });

      fdom.p({
        className: 'text-sm text-gray-600 mt-3',
        children: '调整颜色对比度以满足不同的无障碍需求',
      });
    },
  });
}
