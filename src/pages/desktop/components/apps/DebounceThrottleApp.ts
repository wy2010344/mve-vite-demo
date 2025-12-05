import { fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

/**
 * 防抖节流 - 性能优化中最常见的场景
 * 难点：
 * 1. 理解防抖和节流的区别
 * 2. 正确的实现方式
 * 3. 取消机制
 * 4. 边界情况处理
 */

export const DebounceThrottleApp = panel(function (info) {
  return {
    title: '防抖与节流',
    icon: '⏱️',
    width: 900,
    height: 700,
    children() {
      // 普通搜索（无优化）
      const normalInput = createSignal('');
      const normalSearchCount = createSignal(0);
      const normalResults = createSignal<string[]>([]);

      // 防抖搜索
      const debounceInput = createSignal('');
      const debounceSearchCount = createSignal(0);
      const debounceResults = createSignal<string[]>([]);
      let debounceTimer: any = null;

      // 节流搜索
      const throttleInput = createSignal('');
      const throttleSearchCount = createSignal(0);
      const throttleResults = createSignal<string[]>([]);
      let throttleTimer: any = null;
      let throttleLastTime = 0;

      // 滚动事件计数
      const normalScrollCount = createSignal(0);
      const throttleScrollCount = createSignal(0);
      let scrollThrottleTimer: any = null;

      // 模拟搜索
      function search(query: string): string[] {
        if (!query) return [];
        return [
          `${query} - 搜索结果 1`,
          `${query} - 搜索结果 2`,
          `${query} - 搜索结果 3`,
        ];
      }

      // 普通搜索
      function handleNormalSearch(value: string) {
        normalInput.set(value);
        normalSearchCount.set(normalSearchCount.get() + 1);
        normalResults.set(search(value));
      }

      // 防抖搜索
      function handleDebounceSearch(value: string) {
        debounceInput.set(value);

        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          debounceSearchCount.set(debounceSearchCount.get() + 1);
          debounceResults.set(search(value));
        }, 500);
      }

      // 节流搜索
      function handleThrottleSearch(value: string) {
        throttleInput.set(value);

        const now = Date.now();
        if (now - throttleLastTime < 500) {
          if (throttleTimer) {
            clearTimeout(throttleTimer);
          }
          throttleTimer = setTimeout(
            () => {
              throttleSearchCount.set(throttleSearchCount.get() + 1);
              throttleResults.set(search(value));
              throttleLastTime = Date.now();
            },
            500 - (now - throttleLastTime)
          );
          return;
        }

        throttleLastTime = now;
        throttleSearchCount.set(throttleSearchCount.get() + 1);
        throttleResults.set(search(value));
      }

      // 普通滚动
      function handleNormalScroll() {
        normalScrollCount.set(normalScrollCount.get() + 1);
      }

      // 节流滚动
      function handleThrottleScroll() {
        if (scrollThrottleTimer) return;

        throttleScrollCount.set(throttleScrollCount.get() + 1);
        scrollThrottleTimer = setTimeout(() => {
          scrollThrottleTimer = null;
        }, 100);
      }

      // 重置
      function reset() {
        normalInput.set('');
        normalSearchCount.set(0);
        normalResults.set([]);
        debounceInput.set('');
        debounceSearchCount.set(0);
        debounceResults.set([]);
        throttleInput.set('');
        throttleSearchCount.set(0);
        throttleResults.set([]);
        normalScrollCount.set(0);
        throttleScrollCount.set(0);
      }

      fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-50',
        children() {
          // 顶部栏
          fdom.div({
            className:
              'h-14 bg-white border-b border-gray-200 flex items-center px-6',
            children() {
              fdom.h2({
                className: 'text-lg font-bold text-gray-800',
                childrenType: 'text',
                children: '防抖与节流对比演示',
              });

              fdom.div({ className: 'flex-1' });

              fdom.button({
                className:
                  'px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700',
                childrenType: 'text',
                children: '🔄 重置',
                onClick: reset,
              });
            },
          });

          // 内容区
          fdom.div({
            className: 'flex-1 overflow-auto p-6',
            children() {
              // 搜索对比
              fdom.div({
                className: 'mb-8',
                children() {
                  fdom.h3({
                    className: 'text-xl font-bold text-gray-800 mb-4',
                    childrenType: 'text',
                    children: '场景一：搜索输入框',
                  });

                  fdom.div({
                    className: 'grid grid-cols-3 gap-4',
                    children() {
                      // 普通搜索
                      renderSearchBox({
                        title: '无优化',
                        description: '每次输入都触发搜索',
                        color: 'red',
                        input: normalInput,
                        searchCount: normalSearchCount,
                        results: normalResults,
                        onInput: handleNormalSearch,
                      });

                      // 防抖搜索
                      renderSearchBox({
                        title: '防抖 (Debounce)',
                        description: '停止输入500ms后搜索',
                        color: 'blue',
                        input: debounceInput,
                        searchCount: debounceSearchCount,
                        results: debounceResults,
                        onInput: handleDebounceSearch,
                      });

                      // 节流搜索
                      renderSearchBox({
                        title: '节流 (Throttle)',
                        description: '每500ms最多搜索一次',
                        color: 'green',
                        input: throttleInput,
                        searchCount: throttleSearchCount,
                        results: throttleResults,
                        onInput: handleThrottleSearch,
                      });
                    },
                  });
                },
              });

              // 滚动对比
              fdom.div({
                children() {
                  fdom.h3({
                    className: 'text-xl font-bold text-gray-800 mb-4',
                    childrenType: 'text',
                    children: '场景二：滚动事件',
                  });

                  fdom.div({
                    className: 'grid grid-cols-2 gap-4',
                    children() {
                      // 普通滚动
                      renderScrollBox({
                        title: '无优化',
                        description: '每次滚动都触发',
                        color: 'red',
                        count: normalScrollCount,
                        onScroll: handleNormalScroll,
                      });

                      // 节流滚动
                      renderScrollBox({
                        title: '节流 (Throttle)',
                        description: '每100ms最多触发一次',
                        color: 'green',
                        count: throttleScrollCount,
                        onScroll: handleThrottleScroll,
                      });
                    },
                  });
                },
              });

              // 说明
              fdom.div({
                className:
                  'mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6',
                children() {
                  fdom.h4({
                    className: 'font-bold text-blue-900 mb-3',
                    childrenType: 'text',
                    children: '💡 核心区别',
                  });

                  fdom.div({
                    className: 'space-y-2 text-sm text-blue-800',
                    children() {
                      fdom.div({
                        children() {
                          fdom.strong({
                            childrenType: 'text',
                            children: '防抖 (Debounce): ',
                          });
                          fdom.span({
                            childrenType: 'text',
                            children:
                              '在事件停止触发后的一段时间才执行。适用于搜索框、表单验证等场景。',
                          });
                        },
                      });

                      fdom.div({
                        children() {
                          fdom.strong({
                            childrenType: 'text',
                            children: '节流 (Throttle): ',
                          });
                          fdom.span({
                            childrenType: 'text',
                            children:
                              '在一段时间内最多执行一次。适用于滚动、resize、鼠标移动等高频事件。',
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

function renderSearchBox({
  title,
  description,
  color,
  input,
  searchCount,
  results,
  onInput,
}: any) {
  const colorClasses: any = {
    red: 'border-red-300 bg-red-50',
    blue: 'border-blue-300 bg-blue-50',
    green: 'border-green-300 bg-green-50',
  };

  fdom.div({
    className: `bg-white border-2 ${colorClasses[color]} rounded-lg p-4`,
    children() {
      fdom.h4({
        className: 'font-bold text-gray-900 mb-1',
        childrenType: 'text',
        children: title,
      });
      fdom.p({
        className: 'text-xs text-gray-700 mb-3',
        childrenType: 'text',
        children: description,
      });

      fdom.input({
        type: 'text',
        placeholder: '输入搜索关键词...',
        className:
          'w-full px-3 py-2 border border-gray-300 rounded mb-3 outline-none focus:ring-2 focus:ring-blue-500',
        value() {
          return input.get();
        },
        onInput(e: any) {
          onInput(e.target.value);
        },
      });

      fdom.div({
        className: 'text-sm text-gray-700 mb-3',
        children() {
          fdom.span({
            className: 'text-gray-600',
            childrenType: 'text',
            children: '搜索次数: ',
          });
          fdom.span({
            className: 'font-bold text-blue-600',
            childrenType: 'text',
            children() {
              return `${searchCount.get()}`;
            },
          });
        },
      });

      fdom.div({
        className: 'space-y-1',
        children() {
          results.get().forEach((result: string) => {
            fdom.div({
              className: 'text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded',
              childrenType: 'text',
              children: result,
            });
          });
        },
      });
    },
  });
}

function renderScrollBox({ title, description, color, count, onScroll }: any) {
  const colorClasses: any = {
    red: 'border-red-300 bg-red-50',
    green: 'border-green-300 bg-green-50',
  };

  fdom.div({
    className: `bg-white border-2 ${colorClasses[color]} rounded-lg p-4`,
    children() {
      fdom.h4({
        className: 'font-bold text-gray-900 mb-1',
        childrenType: 'text',
        children: title,
      });
      fdom.p({
        className: 'text-xs text-gray-700 mb-3',
        childrenType: 'text',
        children: description,
      });

      fdom.div({
        className: 'text-sm text-gray-700 mb-3',
        children() {
          fdom.span({
            className: 'text-gray-600',
            childrenType: 'text',
            children: '触发次数: ',
          });
          fdom.span({
            className: 'font-bold text-blue-600',
            childrenType: 'text',
            children() {
              return `${count.get()}`;
            },
          });
        },
      });

      fdom.div({
        className:
          'h-40 overflow-auto border border-gray-300 rounded p-2 bg-white',
        onScroll,
        children() {
          fdom.div({
            className:
              'h-[500px] flex items-center justify-center text-gray-400',
            childrenType: 'text',
            children: '滚动这个区域试试',
          });
        },
      });
    },
  });
}
