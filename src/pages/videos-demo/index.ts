import { fdom } from 'mve-dom';
import {
  hookPromiseSignalLoadMore,
  renderIf,
  renderOne,
  renderOneKey,
} from 'mve-helper';
import { generateMockVideos } from './mockData';
import { createSignal, delay, GetValue } from 'wy-helper';
import { renderOrKey } from 'mve-helper';
import searchBar from './search-bar';
import filterTabs from './filter-tabs';
import videoList from './video-list';

export default function () {
  const search = createSignal('');
  const activeFilter = createSignal('');
  const { get, loadMore, loading, reduceSet } = hookPromiseSignalLoadMore(
    () => {
      return {
        async getAfter(k) {
          await delay(Math.random() * 1000);
          const list = generateMockVideos(k, 1000);
          return {
            nextKey: k + 1,
            hasMore: list.length === 1000,
            list,
          };
        },
        first: 1,
      };
    }
  );
  renderOrKey(
    () => {
      if (loading()) {
        return {
          key: 'loading',
        } as const;
      }
      const data = get();
      if (data?.type == 'success') {
        return {
          key: 'success',
          value: data.value,
        } as const;
      }
      if (data?.type == 'error') {
        return {
          key: 'error',
          error: data.value,
        } as const;
      }
      // return {
      //   key: "unknown",
      // } as const;
    },
    'key',
    // (v) => v?.key,
    function (type, get) {
      if (!type) {
        return;
      }
      if (type == 'loading') {
        fdom.div({
          className:
            'w-full h-full bg-gray-50 flex items-center justify-center',
          children() {
            fdom.div({
              className: 'text-center',
              children() {
                fdom.div({
                  className:
                    'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4',
                });
                fdom.p({
                  className: 'text-gray-600',
                  children: '加载视频列表中...',
                });
              },
            });
          },
        });
      }
      if (type == 'success') {
        fdom.div({
          className: 'w-full h-full bg-gray-50',
          children() {
            //头部区域
            fdom.div({
              className: 'sticky top-0 z-10 bg-white shadow-sm border-b',
              children() {
                fdom.div({
                  className: 'max-w-7xl mx-auto px-4 py-4',
                  children() {
                    fdom.div({
                      className: 'flex flex-col space-y-4',
                      children() {
                        fdom.div({
                          className: 'flex items-center justify-between',
                          children() {
                            fdom.h1({
                              className: 'text-2xl font-bold text-gray-900',
                              childrenType: 'text',
                              children() {
                                return `视频中心 (${get().value.list.length.toLocaleString()})`;
                              },
                            });
                            fdom.div({
                              className: 'text-sm text-gray-500',
                              children: '高性能虚拟滚动演示',
                            });
                          },
                        });

                        //searchBar
                        searchBar(search);

                        filterTabs(activeFilter);
                      },
                    });
                  },
                });
              },
            });

            fdom.main({
              className: 'max-w-7xl mx-auto px-4 py-6',
              children() {
                renderIf(
                  () => get().value.list.length,
                  function () {
                    videoList(get);
                  },
                  function () {
                    fdom.div({
                      className: 'text-center py-12',
                      children() {
                        fdom.div({
                          className: 'text-gray-400 text-6xl mb-4',
                          children: '🎬',
                        });
                        fdom.h3({
                          className: 'text-lg font-medium text-gray-900 mb-2',
                          children: '没有找到匹配的视频',
                        });
                        fdom.p({
                          className: 'text-gray-500',
                          children: '尝试调整搜索条件或过滤器',
                        });
                      },
                    });
                  }
                );
              },
            });
          },
        });
      }
    }
  );
}
