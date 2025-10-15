import { fdom, fsvg } from 'mve-dom';
import { renderInput } from 'mve-dom-helper';
import { renderIf } from 'mve-helper';
import { cns } from 'wy-dom-helper';
import { createSignal, StoreRef } from 'wy-helper';

export default function (search: StoreRef<string>) {
  const focused = createSignal(false);
  fdom.div({
    className() {
      return cns(
        'relative max-w-md w-full',
        focused.get() && 'transform scale-105'
      );
    },
    children() {
      fdom.div({
        className: 'relative flex items-center transition-all duration-200',
        children() {
          //搜索图标
          fdom.div({
            className: 'absolute left-3 z-10',
            children() {
              fsvg.svg({
                className() {
                  return cns(
                    'w-5 h-5 transition-colors duration-200',
                    focused.get() ? 'text-blue-600' : 'text-gray-400'
                  );
                },
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24',
                children() {
                  fsvg.path({
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: 2,
                    d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                  });
                },
              });
            },
          });
          renderInput(
            search.get,
            search.set,
            fdom.input({
              onKeyDown(e) {
                if (e.key === 'Escape') {
                  search.set('');
                }
              },
              onFocus() {
                focused.set(true);
              },
              onBlur() {
                focused.set(false);
              },
              placeholder: '搜索...',
              className() {
                return `w-full pl-10 pr-10 py-3 border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  focused.get()
                    ? 'border-blue-300 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`;
              },
            })
          );

          renderIf(search.get, function () {
            fdom.button({
              className:
                'absolute right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200',
              onClick() {
                search.set('');
              },
              children() {
                fsvg.svg({
                  className: 'w-4 h-4 text-gray-400 hover:text-gray-600',
                  fill: 'none',
                  stroke: 'currentColor',
                  viewBox: '0 0 24 24',
                  children() {
                    fsvg.path({
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                      d: 'M6 18L18 6M6 6l12 12',
                    });
                  },
                });
              },
            });
          });
        },
      });

      renderIf(
        () => focused.get() && search.get(),
        function () {
          //搜索建议
          fdom.div({
            className:
              'absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto',
            children() {
              fdom.div({
                className: 'p-2',
                children() {
                  fdom.div({
                    className: 'text-xs text-gray-500 mb-2',
                    children: '搜索建议',
                  });
                  //这里可以添加搜索建议逻辑
                  fdom.div({
                    className: 'space-y-1',
                    children() {
                      fdom.button({
                        className:
                          'w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm',
                        childrenType: 'text',
                        children() {
                          return `${search.get()} - 在标题中搜索`;
                        },
                      });

                      fdom.button({
                        className:
                          'w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm',
                        childrenType: 'text',
                        children() {
                          return `${search.get()} - 在作者中搜索`;
                        },
                      });
                    },
                  });
                },
              });
            },
          });
        }
      );
    },
  });
}
