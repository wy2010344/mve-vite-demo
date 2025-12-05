import { fdom, fsvg, createRoot } from 'mve-dom';
import { AllPoint, FavoritePoint } from './types';
import { createSignal, emptyFun, GetValue, StoreRef } from 'wy-helper';
import { hookTrackSignalSkipFirst, renderIf } from 'mve-helper';
import { hookMeasureSize } from 'mve-dom-helper';

/**
 * 渲染搜索结果列表
 */
export function renderSearchResults(
  results: readonly any[],
  onSelect: (result: any) => void
) {
  if (results.length > 0) {
    fdom.div({
      className:
        'absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10',
      children() {
        results.forEach((result, i) => {
          if (i > 8) return;
          fdom.div({
            className:
              'p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150',
            onClick() {
              onSelect(result);
            },
            children() {
              fdom.div({
                className: 'font-medium text-gray-900',
                childrenType: 'text',
                children: result.name,
              });
              fdom.div({
                className: 'text-sm text-gray-600 truncate',
                childrenType: 'text',
                children: result.address,
              });
            },
          });
        });
      },
    });
  }
}

/**
 * 渲染加载指示器
 */
export function renderLoadingIndicator() {
  fdom.div({
    className:
      'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-pulse',
    children() {
      fsvg.svg({
        className: 'w-5 h-5',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
        children() {
          fsvg.circle({
            className: 'opacity-25',
            cx: '12',
            cy: '12',
            r: '10',
            strokeWidth: '4',
          });
          fsvg.path({
            className: 'opacity-75',
            fill: 'currentColor',
            d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
          });
        },
      });
    },
  });
}

/**
 * 渲染地图加载状态
 */
export function renderMapLoading() {
  fdom.div({
    className: 'absolute inset-0 flex items-center justify-center bg-white',
    children() {
      fdom.div({
        className: 'text-center',
        children() {
          fdom.div({
            className:
              'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2',
          });
          fdom.p({
            className: 'text-gray-600',
            childrenType: 'text',
            children: '地图加载中...',
          });
        },
      });
    },
  });
}

/**
 * 渲染信息窗口
 */
export function renderInfoWindow({
  map,
  marker,
  get,
  favoritePoints,
}: {
  map: any;
  marker: any;
  get: GetValue<AllPoint>;
  favoritePoints: StoreRef<readonly FavoritePoint[]>;
}) {
  const infoWindow = new window.AMap.InfoWindow({
    offset: new window.AMap.Pixel(0, -30),
    closeWhenClickMap: true,
    autoMove: false,
  });

  // 创建信息窗口内容
  const destroy = createRoot(infoWindow.Fy, function () {
    // 检查是否已收藏
    // 创建备注信号
    const remark = createSignal(get().remark || '');
    const size = hookMeasureSize();

    size.plugin(infoWindow.dom);
    hookTrackSignalSkipFirst(
      () => {
        return [size.width(), size.height()];
      },
      a => {
        infoWindow.setSize(a);
      }
    );
    // 获取当前收藏点信息
    return fdom.div({
      className: 'text-gray-900',
      children() {
        // 标题区域
        fdom.div({
          className: 'flex justify-between items-start mb-3',
          children() {
            fdom.h4({
              className: 'm-0 text-gray-800 text-sm font-semibold',
              childrenType: 'text',
              children() {
                return get().name || '未知地点';
              },
            });

            // 根据收藏状态显示不同的样式
            renderIf(
              () => get().favorite,
              function () {
                fdom.span({
                  className:
                    'ml-2 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-md',
                  childrenType: 'text',
                  children: '已收藏',
                });
              },
              function () {
                fdom.span({
                  className:
                    'ml-2 text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-md',
                  childrenType: 'text',
                  children: '未收藏',
                });
              }
            );
          },
        });

        // 信息区域
        fdom.div({
          className: 'mb-3 text-gray-600 text-xs leading-relaxed',
          children() {
            // 地址行
            fdom.div({
              className: 'flex items-center mb-2',
              children() {
                fdom.span({
                  className: 'text-blue-500 mr-2',
                  childrenType: 'text',
                  children: '📍',
                });
                fdom.span({
                  className: 'text-gray-600',
                  childrenType: 'text',
                  children() {
                    return `地址: ${get().address || '暂无地址信息'}`;
                  },
                });
              },
            });

            // 备注行（仅已收藏的地点显示）
            fdom.div({
              className: 'flex items-start mb-4',
              s_display() {
                return get().favorite ? 'flex' : 'none';
              },
              children() {
                fdom.span({
                  className: 'text-blue-500 mr-2 mt-1',
                  childrenType: 'text',
                  children: '📝',
                });
                fdom.div({
                  className: 'flex-1',
                  children() {
                    fdom.div({
                      className: 'font-medium text-gray-700 mb-1',
                      childrenType: 'text',
                      children: '备注:',
                    });
                    fdom.input({
                      className:
                        'w-full px-2 py-1 border border-gray-300 rounded text-xs text-gray-900',
                      type: 'text',
                      value: remark.get(),
                      onInput(e) {
                        remark.set((e.target as HTMLInputElement).value);
                      },
                    });
                  },
                });
              },
            });
          },
        });

        // 操作按钮区域
        fdom.div({
          className: 'flex justify-end gap-2',
          children() {
            renderIf(
              () => get().favorite,
              function () {
                // 已收藏状态：保存备注和取消收藏按钮
                fdom.button({
                  className:
                    'bg-blue-500 text-white border-none px-3 py-1 rounded-md cursor-pointer text-xs transition-all duration-200',
                  childrenType: 'text',
                  s_display() {
                    return get().remark != remark.get() ? 'block' : 'none';
                  },
                  children: '保存备注',
                  onClick() {
                    const updatedPoints = favoritePoints.get().map(point => {
                      if (
                        point.address === get().address &&
                        point.name === get().name
                      ) {
                        return {
                          ...point,
                          remark: remark.get(),
                        };
                      }
                      return point;
                    });
                    favoritePoints.set(updatedPoints);
                  },
                });

                fdom.button({
                  className:
                    'bg-red-500 text-white border-none px-3 py-1 rounded-md cursor-pointer text-xs transition-all duration-200',
                  childrenType: 'text',
                  children: '取消收藏',
                  onClick() {
                    favoritePoints.set(
                      favoritePoints
                        .get()
                        .filter(
                          x =>
                            !(
                              x.address == get().address && x.name == get().name
                            )
                        )
                    );
                  },
                });
              },
              function () {
                // 未收藏状态：添加到收藏按钮
                fdom.button({
                  className:
                    'bg-green-500 text-white border-none px-3 py-1 rounded-md cursor-pointer text-xs transition-all duration-200',
                  childrenType: 'text',
                  children: '添加收藏',
                  onClick() {
                    const newFavoritePoint: FavoritePoint = {
                      ...get(),
                      favorite: true,
                      remark: '',
                      position: get().position || [0, 0],
                    };
                    favoritePoints.set(
                      favoritePoints.get().concat(newFavoritePoint)
                    );
                  },
                });
              }
            );
          },
        });
      },
    });
  });

  infoWindow.on('close', () => {
    destroy();
  });

  // 打开新的信息窗口
  infoWindow.open(map, marker.getPosition());

  return infoWindow;
}
