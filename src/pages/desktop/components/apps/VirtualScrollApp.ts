import { dom, fdom } from 'mve-dom';
import { createSignal, addEffect, memo } from 'wy-helper';
import { panel } from '../WindowManager';

/**
 * 虚拟滚动列表 - 业务中常见的性能优化场景
 * 难点：
 * 1. 动态高度计算
 * 2. 滚动位置同步
 * 3. 快速滚动时的白屏问题
 * 4. 缓冲区管理
 */

interface ListItem {
  id: number;
  title: string;
  content: string;
  height?: number;
}

// 生成大量测试数据
function generateItems(count: number): ListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    content: `这是第 ${i + 1} 条数据。${Math.random() > 0.5 ? '内容较短。' : '这是一段比较长的内容，用来测试动态高度的虚拟滚动列表。在实际业务中，列表项的高度往往是不固定的，这给虚拟滚动的实现带来了很大挑战。我们需要在滚动时动态计算每个项的高度，并且保持滚动位置的准确性。'}`,
  }));
}

export const VirtualScrollApp = panel(function (info) {
  return {
    title: '虚拟滚动列表',
    icon: '📜',
    width: 600,
    height: 700,
    children() {
      const itemCount = createSignal(10000);
      const items = createSignal<ListItem[]>(generateItems(10000));
      const scrollTop = createSignal(0);
      const containerHeight = createSignal(600);
      const itemHeights = createSignal<Map<number, number>>(new Map());
      const bufferSize = 5; // 缓冲区大小

      // 估算的平均高度
      const estimatedItemHeight = 80;

      // 计算总高度
      const totalHeight = memo(() => {
        const heights = itemHeights.get();
        let total = 0;
        for (let i = 0; i < items.get().length; i++) {
          total += heights.get(i) || estimatedItemHeight;
        }
        return total;
      });

      // 计算可见范围
      const visibleRange = memo(() => {
        const scroll = scrollTop.get();
        const height = containerHeight.get();
        const heights = itemHeights.get();

        let startIndex = 0;
        let accumulatedHeight = 0;

        // 找到起始索引
        for (let i = 0; i < items.get().length; i++) {
          const itemHeight = heights.get(i) || estimatedItemHeight;
          if (accumulatedHeight + itemHeight > scroll) {
            startIndex = Math.max(0, i - bufferSize);
            break;
          }
          accumulatedHeight += itemHeight;
        }

        // 计算结束索引
        let endIndex = startIndex;
        accumulatedHeight = 0;
        for (let i = startIndex; i < items.get().length; i++) {
          const itemHeight = heights.get(i) || estimatedItemHeight;
          accumulatedHeight += itemHeight;
          if (accumulatedHeight > height + scroll - getOffsetTop(startIndex)) {
            endIndex = Math.min(items.get().length - 1, i + bufferSize);
            break;
          }
        }

        return { startIndex, endIndex };
      });

      // 计算偏移量
      function getOffsetTop(index: number): number {
        const heights = itemHeights.get();
        let offset = 0;
        for (let i = 0; i < index; i++) {
          offset += heights.get(i) || estimatedItemHeight;
        }
        return offset;
      }

      // 记录高度
      function recordHeight(index: number, height: number) {
        const heights = new Map(itemHeights.get());
        if (heights.get(index) !== height) {
          heights.set(index, height);
          itemHeights.set(heights);
        }
      }

      // 滚动到指定位置
      function scrollToIndex(index: number) {
        const offset = getOffsetTop(index);
        scrollTop.set(offset);
      }

      fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-50',
        children() {
          // 工具栏
          fdom.div({
            className:
              'h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4',
            children() {
              fdom.div({
                className: 'text-sm text-gray-600',
                children() {
                  fdom.span({
                    childrenType: 'text',
                    children: '总数据量: ',
                  });
                  fdom.span({
                    className: 'font-bold text-blue-600',
                    childrenType: 'text',
                    children() {
                      return `${itemCount.get().toLocaleString()}`;
                    },
                  });
                  fdom.span({
                    className: 'ml-4',
                    childrenType: 'text',
                    children: '可见范围: ',
                  });
                  fdom.span({
                    className: 'font-bold text-green-600',
                    childrenType: 'text',
                    children() {
                      const { startIndex, endIndex } = visibleRange();
                      return `${startIndex} - ${endIndex}`;
                    },
                  });
                },
              });

              fdom.div({ className: 'flex-1' });

              fdom.button({
                className:
                  'px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700',
                childrenType: 'text',
                children: '跳到中间',
                onClick() {
                  scrollToIndex(Math.floor(items.get().length / 2));
                },
              });

              fdom.button({
                className:
                  'px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700',
                childrenType: 'text',
                children: '跳到底部',
                onClick() {
                  scrollToIndex(items.get().length - 1);
                },
              });

              fdom.button({
                className:
                  'px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700',
                childrenType: 'text',
                children: '重新生成',
                onClick() {
                  const count = itemCount.get();
                  items.set(generateItems(count));
                  itemHeights.set(new Map());
                  scrollTop.set(0);
                },
              });
            },
          });

          // 虚拟滚动容器
          fdom.div({
            className: 'flex-1 overflow-auto relative',
            onScroll(e) {
              scrollTop.set((e.target as HTMLElement).scrollTop);
            },
            children() {
              // 占位元素（撑开滚动条）
              fdom.div({
                s_height() {
                  return `${totalHeight()}px`;
                },
                s_position: 'relative',
                children() {
                  // 可见项容器
                  fdom.div({
                    s_position: 'absolute',
                    s_top() {
                      return `${getOffsetTop(visibleRange().startIndex)}px`;
                    },
                    s_left: '0',
                    s_right: '0',
                    children() {
                      const { startIndex, endIndex } = visibleRange();
                      const visibleItems = items
                        .get()
                        .slice(startIndex, endIndex + 1);

                      visibleItems.forEach((item, idx) => {
                        const actualIndex = startIndex + idx;

                        const itemEl = dom
                          .div({
                            className:
                              'bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors',
                          })
                          .render(() => {
                            fdom.div({
                              className: 'font-semibold text-gray-900 mb-2',
                              childrenType: 'text',
                              children: item.title,
                            });
                            fdom.div({
                              className: 'text-gray-700 text-sm',
                              childrenType: 'text',
                              children: item.content,
                            });
                            fdom.div({
                              className: 'text-xs text-gray-600 mt-2',
                              childrenType: 'text',
                              children: `Index: ${actualIndex} | ID: ${item.id}`,
                            });
                          });

                        // 测量高度
                        addEffect(() => {
                          const height = itemEl.offsetHeight;
                          if (height > 0) {
                            recordHeight(actualIndex, height);
                          }
                        });
                      });
                    },
                  });
                },
              });
            },
          });

          // 性能指标
          fdom.div({
            className:
              'h-10 bg-gray-800 text-white text-xs flex items-center px-4 gap-6',
            children() {
              fdom.div({
                children() {
                  fdom.span({
                    className: 'text-gray-400',
                    childrenType: 'text',
                    children: '渲染项数: ',
                  });
                  fdom.span({
                    className: 'font-bold',
                    childrenType: 'text',
                    children() {
                      const { startIndex, endIndex } = visibleRange();
                      return `${endIndex - startIndex + 1}`;
                    },
                  });
                },
              });
              fdom.div({
                children() {
                  fdom.span({
                    className: 'text-gray-400',
                    childrenType: 'text',
                    children: '已测量高度: ',
                  });
                  fdom.span({
                    className: 'font-bold',
                    childrenType: 'text',
                    children() {
                      return `${itemHeights.get().size}`;
                    },
                  });
                },
              });
              fdom.div({
                children() {
                  fdom.span({
                    className: 'text-gray-400',
                    childrenType: 'text',
                    children: '滚动位置: ',
                  });
                  fdom.span({
                    className: 'font-bold',
                    childrenType: 'text',
                    children() {
                      return `${Math.round(scrollTop.get())}px`;
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
