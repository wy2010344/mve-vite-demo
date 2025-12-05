import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../WindowManager';

const SETTINGS = [
  { id: 'general', icon: '⚙️', label: 'General', color: 'bg-gray-500' },
  { id: 'display', icon: '🖥️', label: 'Display', color: 'bg-blue-500' },
  { id: 'sound', icon: '🔊', label: 'Sound', color: 'bg-red-500' },
  { id: 'network', icon: '🌐', label: 'Network', color: 'bg-green-500' },
  { id: 'privacy', icon: '🔒', label: 'Privacy', color: 'bg-purple-500' },
  { id: 'about', icon: 'ℹ️', label: 'About', color: 'bg-yellow-500' },
];

export const SettingsApp = panel(function (info) {
  return {
    title: 'Settings',
    children() {
      const selected = createSignal('general');

      fdom.div({
        className: 'w-full h-full flex',
        children() {
          // 侧边栏
          fdom.div({
            className: 'w-56 bg-gray-50 border-r border-gray-200 p-4',
            children() {
              fdom.div({
                className: 'space-y-1',
                children() {
                  SETTINGS.forEach(setting => {
                    fdom.button({
                      className:
                        'w-full px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-3 text-left',
                      s_backgroundColor() {
                        return selected.get() === setting.id ? '#e5e7eb' : '';
                      },
                      onClick() {
                        selected.set(setting.id);
                      },
                      children() {
                        fdom.div({
                          className: `${setting.color} w-8 h-8 rounded-lg flex items-center justify-center`,
                          childrenType: 'text',
                          children: setting.icon,
                        });
                        fdom.span({
                          className: 'font-medium text-gray-900',
                          childrenType: 'text',
                          children: setting.label,
                        });
                      },
                    });
                  });
                },
              });
            },
          });

          // 内容区域
          fdom.div({
            className: 'flex-1 p-8',
            children() {
              fdom.div({
                className: 'max-w-2xl',
                children() {
                  fdom.h2({
                    className: 'text-2xl font-bold text-gray-900 mb-6',
                    childrenType: 'text',
                    children() {
                      return (
                        SETTINGS.find(s => s.id === selected.get())?.label || ''
                      );
                    },
                  });

                  // 示例设置项
                  fdom.div({
                    className: 'space-y-6',
                    children() {
                      // 开关设置
                      fdom.div({
                        className:
                          'flex items-center justify-between py-3 border-b border-gray-200',
                        children() {
                          fdom.div({
                            children() {
                              fdom.div({
                                className: 'font-medium text-gray-900',
                                childrenType: 'text',
                                children: 'Enable notifications',
                              });
                              fdom.div({
                                className: 'text-sm text-gray-600',
                                childrenType: 'text',
                                children: 'Receive system notifications',
                              });
                            },
                          });
                          fdom.input({
                            type: 'checkbox',
                            className: 'w-12 h-6',
                            checked: true,
                          });
                        },
                      });

                      // 下拉选择
                      fdom.div({
                        className:
                          'flex items-center justify-between py-3 border-b border-gray-200',
                        children() {
                          fdom.div({
                            children() {
                              fdom.div({
                                className: 'font-medium text-gray-900',
                                childrenType: 'text',
                                children: 'Theme',
                              });
                              fdom.div({
                                className: 'text-sm text-gray-600',
                                childrenType: 'text',
                                children: 'Choose your preferred theme',
                              });
                            },
                          });
                          fdom.select({
                            className:
                              'px-3 py-1 border border-gray-300 rounded',
                            children() {
                              ['Light', 'Dark', 'Auto'].forEach(theme => {
                                fdom.option({
                                  value: theme.toLowerCase(),
                                  childrenType: 'text',
                                  children: theme,
                                });
                              });
                            },
                          });
                        },
                      });

                      // 滑块设置
                      fdom.div({
                        className: 'py-3 border-b border-gray-200',
                        children() {
                          fdom.div({
                            className: 'font-medium text-gray-900 mb-2',
                            childrenType: 'text',
                            children: 'Volume',
                          });
                          fdom.input({
                            type: 'range',
                            className: 'w-full',
                            min: '0',
                            max: '100',
                            value: '70',
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
    },
  };
});
