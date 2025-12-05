import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../WindowManager';

export const BrowserApp = panel(() => {
  return {
    title: 'Browser',
    icon: '🌐',
    children() {
      const url = createSignal('https://github.com/wy2010344/mve');
      const inputUrl = createSignal(url.get());
      fdom.div({
        className: 'w-full h-full flex flex-col',
        children() {
          // 地址栏
          fdom.div({
            className:
              'h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-3',
            children() {
              fdom.button({
                className:
                  'text-xl text-gray-700 hover:bg-gray-200 rounded px-2',
                childrenType: 'text',
                children: '←',
              });
              fdom.button({
                className:
                  'text-xl text-gray-700 hover:bg-gray-200 rounded px-2',
                childrenType: 'text',
                children: '→',
              });
              fdom.button({
                className:
                  'text-xl text-gray-700 hover:bg-gray-200 rounded px-2',
                childrenType: 'text',
                children: '↻',
              });
              fdom.input({
                type: 'text',
                className:
                  'flex-1 px-4 py-1.5 bg-white rounded-full border border-gray-300 text-sm',
                value() {
                  return inputUrl.get();
                },
                onInput(e) {
                  inputUrl.set((e.target as HTMLInputElement).value);
                },
                onKeyDown(e) {
                  if (e.key === 'Enter') {
                    url.set(inputUrl.get());
                  }
                },
              });
            },
          });

          // 内容区域
          fdom.div({
            className: 'flex-1 bg-white flex items-center justify-center',
            children() {
              fdom.div({
                className: 'text-center',
                children() {
                  fdom.div({
                    className: 'text-6xl mb-4',
                    childrenType: 'text',
                    children: '🌐',
                  });
                  fdom.div({
                    className: 'text-xl font-semibold text-gray-900 mb-2',
                    childrenType: 'text',
                    children: 'Browser',
                  });
                  fdom.div({
                    className: 'text-gray-600 text-sm',
                    children() {
                      fdom.span({
                        childrenType: 'text',
                        children: 'Current URL: ',
                      });
                      fdom.a({
                        href() {
                          return url.get();
                        },
                        target: '_blank',
                        className: 'text-blue-500 hover:underline',
                        childrenType: 'text',
                        children() {
                          return url.get();
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
