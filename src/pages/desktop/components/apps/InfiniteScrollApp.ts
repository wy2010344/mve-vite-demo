import { dom, fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

/**
 * 无限滚动加载 - 业务中常见的列表加载场景
 * 难点：
 * 1. 滚动到底部的精确判断
 * 2. 防止重复加载
 * 3. 加载失败重试
 * 4. 加载状态管理
 * 5. 空状态和错误状态处理
 */

interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

// 模拟 API 请求
async function fetchPosts(page: number, pageSize: number): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

  // 模拟偶尔失败
  if (Math.random() < 0.1) {
    throw new Error('网络请求失败');
  }

  return Array.from({ length: pageSize }, (_, i) => {
    const id = page * pageSize + i;
    return {
      id,
      title: `帖子标题 ${id + 1}`,
      author: `用户${Math.floor(Math.random() * 1000)}`,
      content: `这是第 ${id + 1} 条帖子的内容。${Math.random() > 0.5 ? '简短内容。' : '这是一段较长的内容，用来模拟真实的社交媒体帖子。在实际业务中，我们需要处理各种边界情况，比如网络失败、数据为空、滚动到底部等。'}`,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      timestamp: new Date(
        Date.now() - Math.random() * 86400000 * 7
      ).toLocaleString(),
    };
  });
}

export const InfiniteScrollApp = panel(function (info) {
  return {
    title: '无限滚动加载',
    icon: '♾️',
    width: 650,
    height: 750,
    children() {
      const posts = createSignal<Post[]>([]);
      const page = createSignal(0);
      const isLoading = createSignal(false);
      const hasMore = createSignal(true);
      const error = createSignal<string | null>(null);
      const pageSize = 10;
      let scrollContainer: HTMLElement;

      // 加载更多数据
      async function loadMore() {
        if (isLoading.get() || !hasMore.get()) return;

        isLoading.set(true);
        error.set(null);

        try {
          const newPosts = await fetchPosts(page.get(), pageSize);

          if (newPosts.length < pageSize) {
            hasMore.set(false);
          }

          posts.set([...posts.get(), ...newPosts]);
          page.set(page.get() + 1);
        } catch (e: any) {
          error.set(e.message);
        } finally {
          isLoading.set(false);
        }
      }

      // 检查是否滚动到底部
      function checkScrollBottom() {
        if (!scrollContainer) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const threshold = 100; // 距离底部100px时触发加载

        if (scrollHeight - scrollTop - clientHeight < threshold) {
          loadMore();
        }
      }

      // 初始加载
      addEffect(() => {
        loadMore();
      });

      // 重置
      function reset() {
        posts.set([]);
        page.set(0);
        hasMore.set(true);
        error.set(null);
        loadMore();
      }

      fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-100',
        children() {
          // 顶部栏
          fdom.div({
            className:
              'h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4',
            children() {
              fdom.h2({
                className: 'text-lg font-bold text-gray-800',
                childrenType: 'text',
                children: '社交动态',
              });

              fdom.div({ className: 'flex-1' });

              fdom.div({
                className: 'text-sm text-gray-600',
                children() {
                  fdom.span({
                    childrenType: 'text',
                    children: '已加载: ',
                  });
                  fdom.span({
                    className: 'font-bold text-blue-600',
                    childrenType: 'text',
                    children() {
                      return `${posts.get().length}`;
                    },
                  });
                  fdom.span({
                    className: 'ml-2',
                    childrenType: 'text',
                    children: '条',
                  });
                },
              });

              fdom.button({
                className:
                  'px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700',
                childrenType: 'text',
                children: '🔄 重置',
                onClick: reset,
              });
            },
          });

          // 滚动容器
          scrollContainer = dom
            .div({
              className: 'flex-1 overflow-auto',
              onScroll: checkScrollBottom,
            })
            .render(() => {
              // 帖子列表
              fdom.div({
                className: 'max-w-2xl mx-auto p-4 space-y-4',
                children() {
                  // 空状态
                  fdom.div({
                    s_display() {
                      return posts.get().length === 0 &&
                        !isLoading.get() &&
                        !error.get()
                        ? 'flex'
                        : 'none';
                    },
                    className:
                      'flex flex-col items-center justify-center py-20',
                    children() {
                      fdom.div({
                        className: 'text-6xl mb-4',
                        childrenType: 'text',
                        children: '📭',
                      });
                      fdom.div({
                        className: 'text-gray-500',
                        childrenType: 'text',
                        children: '暂无动态',
                      });
                    },
                  });

                  // 帖子卡片
                  posts.get().forEach(post => {
                    fdom.div({
                      className:
                        'bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow',
                      children() {
                        // 头部
                        fdom.div({
                          className: 'flex items-center gap-3 mb-3',
                          children() {
                            fdom.div({
                              className:
                                'w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold',
                              childrenType: 'text',
                              children: post.author[0],
                            });
                            fdom.div({
                              className: 'flex-1',
                              children() {
                                fdom.div({
                                  className: 'font-semibold text-gray-900',
                                  childrenType: 'text',
                                  children: post.author,
                                });
                                fdom.div({
                                  className: 'text-xs text-gray-600',
                                  childrenType: 'text',
                                  children: post.timestamp,
                                });
                              },
                            });
                          },
                        });

                        // 内容
                        fdom.div({
                          className: 'mb-3',
                          children() {
                            fdom.h3({
                              className: 'font-semibold text-gray-900 mb-2',
                              childrenType: 'text',
                              children: post.title,
                            });
                            fdom.p({
                              className: 'text-gray-700 text-sm',
                              childrenType: 'text',
                              children: post.content,
                            });
                          },
                        });

                        // 底部互动
                        fdom.div({
                          className:
                            'flex items-center gap-6 text-sm text-gray-600',
                          children() {
                            fdom.button({
                              className:
                                'flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors',
                              children() {
                                fdom.span({
                                  childrenType: 'text',
                                  children: '❤️',
                                });
                                fdom.span({
                                  childrenType: 'text',
                                  children: `${post.likes}`,
                                });
                              },
                            });
                            fdom.button({
                              className:
                                'flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors',
                              children() {
                                fdom.span({
                                  childrenType: 'text',
                                  children: '💬',
                                });
                                fdom.span({
                                  childrenType: 'text',
                                  children: `${post.comments}`,
                                });
                              },
                            });
                            fdom.button({
                              className:
                                'flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors',
                              children() {
                                fdom.span({
                                  childrenType: 'text',
                                  children: '🔗',
                                });
                                fdom.span({
                                  childrenType: 'text',
                                  children: '分享',
                                });
                              },
                            });
                          },
                        });
                      },
                    });
                  });

                  // 加载中
                  fdom.div({
                    s_display() {
                      return isLoading.get() ? 'flex' : 'none';
                    },
                    className: 'flex flex-col items-center justify-center py-8',
                    children() {
                      fdom.div({
                        className:
                          'w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2',
                      });
                      fdom.div({
                        className: 'text-gray-500 text-sm',
                        childrenType: 'text',
                        children: '加载中...',
                      });
                    },
                  });

                  // 错误状态
                  fdom.div({
                    s_display() {
                      return error.get() ? 'flex' : 'none';
                    },
                    className: 'flex flex-col items-center justify-center py-8',
                    children() {
                      fdom.div({
                        className: 'text-4xl mb-2',
                        childrenType: 'text',
                        children: '⚠️',
                      });
                      fdom.div({
                        className: 'text-red-500 mb-3',
                        childrenType: 'text',
                        children() {
                          return error.get() || '';
                        },
                      });
                      fdom.button({
                        className:
                          'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700',
                        childrenType: 'text',
                        children: '重试',
                        onClick: loadMore,
                      });
                    },
                  });

                  // 没有更多
                  fdom.div({
                    s_display() {
                      return !hasMore.get() && posts.get().length > 0
                        ? 'flex'
                        : 'none';
                    },
                    className:
                      'flex flex-col items-center justify-center py-8 text-gray-400',
                    children() {
                      fdom.div({
                        className: 'text-2xl mb-2',
                        childrenType: 'text',
                        children: '📄',
                      });
                      fdom.div({
                        className: 'text-sm',
                        childrenType: 'text',
                        children: '没有更多内容了',
                      });
                    },
                  });
                },
              });
            });
        },
      });
    },
  };
});
