import { fdom, fsvg } from 'mve-dom';
import { hookDebounceState } from './hooks';
import { hookStorageSignal, renderInput } from 'mve-dom-helper';
import { markerRender } from './markerRender';
import { hookAddResult } from 'mve-core';
import { MapService } from './mapService';
import {
  LocationPoint,
  AllPoint,
  CompletePoint,
  PlacePoint,
  CityOption,
  FavoritePoint,
} from './types';
import {
  renderSearchResults,
  renderLoadingIndicator,
  renderMapLoading,
  renderInfoWindow,
} from './uiComponents';
import {
  arrayMapCreater,
  createLateSignal,
  createSignal,
  emptyArray,
  memo,
  PromiseResult,
  run,
} from 'wy-helper';
import {
  hookDestroy,
  hookPromiseSignal,
  hookTrackSignal,
  promiseSignal,
  renderArrayKey,
  renderOne,
  renderOrKey,
} from 'mve-helper';
import markPNG from './mark_b.png';
// 全局类型声明
declare global {
  interface Window {
    AMap?: any;
  }
}

// 城市选项配置
const cityOptions: readonly CityOption[] = [
  { value: '全国', label: '全国', center: [116.397428, 39.90923], zoom: 4 },
  { value: '深圳', label: '深圳', center: [114.066541, 22.547], zoom: 12 },
  { value: '重庆', label: '重庆', center: [106.550763, 29.563009], zoom: 12 },
];

export default function MapAnalysisPage() {
  // 引用和状态管理
  const searchKeyword = createSignal('');
  const debounceSearchKeyword = hookDebounceState(searchKeyword.get, 300);
  const didSearchKeyword = createSignal('');
  const selectedCity = hookStorageSignal('selectCity', '全国');
  const showSearchResults = createSignal(false);

  // 地图状态管理
  const mapSignal = createLateSignal<PromiseResult<any> | undefined>(undefined);
  function getMap() {
    const mapV = mapSignal.get();
    if (mapV?.type != 'success') return;
    return mapV.value;
  }

  // 搜索结果管理
  const searchResults = hookPromiseSignal(() => {
    const key = debounceSearchKeyword();
    if (!key) return;
    const map = getMap();
    if (!map) return;

    return function () {
      return new Promise<CompletePoint[]>(function (resolve) {
        map.plugin('AMap.AutoComplete', () => {
          const autoComplete = new window.AMap.AutoComplete({
            city: selectedCity.get(),
          });
          autoComplete.search(key, (status: string, result: any) => {
            if (status === 'complete' && result.tips) {
              const results = result.tips.map((tip: any) => ({
                name: tip.name,
                address: tip.district + tip.address,
                dropdown: true,
                position: tip.location
                  ? [tip.location.lng, tip.location.lat]
                  : null,
              }));
              resolve(results);
            } else {
              resolve(emptyArray);
            }
          });
        });
      });
    };
  });

  // 地点搜索结果管理
  const placeSearch = hookPromiseSignal(() => {
    const key = didSearchKeyword.get();
    if (!key) return;
    const map = getMap();
    if (!map) return;

    return function () {
      return new Promise<PlacePoint[]>(resolve => {
        map.plugin('AMap.PlaceSearch', () => {
          const placeSearch = new window.AMap.PlaceSearch({
            city: selectedCity.get(),
            pageSize: 10,
            pageIndex: 1,
            autoFitView: true,
          });
          placeSearch.search(key, (status: string, result: any) => {
            if (
              status === 'complete' &&
              result.poiList &&
              result.poiList.pois.length > 0
            ) {
              resolve(
                result.poiList.pois.map((r: any) => ({
                  name: r.name,
                  address: r.address,
                  place: true,
                  position: [r.location.lng, r.location.lat] as const,
                }))
              );
            } else {
              resolve(emptyArray);
            }
          });
        });
      });
    };
  });

  // 收藏点管理
  const favoritePoints = hookStorageSignal<readonly FavoritePoint[]>(
    'favoritePoints',
    emptyArray
  );

  // 搜索下拉选择管理
  const dropdownSelect = createSignal<LocationPoint | undefined>(undefined);

  // 检查点是否包含在列表中
  function includePoint(
    fs: readonly LocationPoint[],
    dp: LocationPoint
  ): boolean {
    return !!fs.find(x => x.address == dp.address && x.name == dp.name);
  }

  // 渲染组件
  fdom.div({
    className: 'w-full h-screen bg-gray-50 flex flex-col',
    children() {
      // 头部搜索区域
      fdom.div({
        className: 'p-4 bg-white shadow-sm',
        children() {
          fdom.div({
            className: 'relative max-w-3xl mx-auto',
            children() {
              // 城市选择器
              fdom.div({
                className: 'flex gap-4 mb-3',
                children() {
                  fdom.div({
                    className: 'relative flex-1',
                    children() {
                      fdom.select({
                        className:
                          'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none text-gray-900',
                        value: selectedCity.get,
                        onInput(e) {
                          const target = e.target as HTMLSelectElement;
                          selectedCity.set(target.value);
                        },
                        children() {
                          cityOptions.forEach(city => {
                            fdom.option({
                              value: city.value,
                              children: city.label,
                              className: 'text-gray-900',
                            });
                          });
                        },
                      });
                      fdom.div({
                        className:
                          'absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500',
                        children() {
                          fsvg.svg({
                            className: 'w-4 h-4',
                            fill: 'none',
                            stroke: 'currentColor',
                            viewBox: '0 0 24 24',
                            children() {
                              fsvg.path({
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                                strokeWidth: '2',
                                d: 'M19 9l-7 7-7-7',
                              });
                            },
                          });
                        },
                      });
                    },
                  });
                },
              });

              // 搜索输入框
              fdom.div({
                className: 'relative',
                children() {
                  renderInput(
                    searchKeyword.get,
                    searchKeyword.set,
                    fdom.input({
                      type: 'text',
                      className:
                        'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500',
                      placeholder: '搜索地点...',
                      onFocus() {
                        showSearchResults.set(true);
                      },
                      onBlur() {
                        setTimeout(() => {
                          showSearchResults.set(false);
                        }, 200);
                      },
                      onKeyDown(e) {
                        if (e.key === 'Enter' && searchKeyword.get()) {
                          didSearchKeyword.set(searchKeyword.get());
                        }
                      },
                      disabled: isLoading,
                    })
                  );

                  // 加载指示器
                  renderOne(
                    () => isLoading(),
                    function (loading) {
                      if (loading) {
                        renderLoadingIndicator();
                      }
                    }
                  );
                },
              });

              // 搜索结果下拉框
              renderOne(
                () => {
                  if (!showSearchResults.get()) return emptyArray;
                  const value = searchResults.get();
                  if (value?.type != 'success') return emptyArray;
                  return value.value;
                },
                function (list) {
                  renderSearchResults(list, result => {
                    dropdownSelect.set(result);
                  });
                }
              );
            },
          });
        },
      });

      // 地图区域
      fdom.div({
        className: 'flex-1 relative',
        children() {
          const mapContainer = fdom.div({
            className: 'w-full h-full',
          });

          // 地图初始化
          const { get: getMap } = promiseSignal(
            new Promise((resolve, reject) => {
              run(async () => {
                try {
                  const map = await MapService.initMap(
                    mapContainer,
                    [114.066541, 22.547],
                    12
                  );
                  resolve(map);
                } catch (error) {
                  reject(error);
                }
              });
            }),
            { signal: mapSignal }
          );

          // 标记为收藏点的数据
          const memoFavoritePoints = memo(() => {
            return favoritePoints.get().map(row => {
              return {
                ...row,
                favorite: true,
              };
            });
          });

          // 渲染地图
          renderOrKey(getMap, 'type', function (key, get) {
            if (key == 'success') {
              renderOne(
                () => get().value,
                function (map) {
                  hookDestroy(() => {
                    map.destroy();
                  });

                  // 监听城市变化，更新地图视图
                  hookTrackSignal(selectedCity.get, () => {
                    const currentCity =
                      cityOptions.find(
                        city => city.value === selectedCity.get()
                      ) || cityOptions[0];
                    map.setCenter(currentCity.center);
                    map.setZoom(currentCity.zoom);
                  });

                  // 渲染标记
                  markerRender.renderChildren(map, function () {
                    renderArrayKey<AllPoint, readonly [string, string]>(
                      () => {
                        let fs: readonly AllPoint[] = memoFavoritePoints();
                        const dp = dropdownSelect.get();

                        if (dp && !includePoint(fs, dp)) {
                          fs = fs.concat({
                            ...dp,
                            dropdown: true,
                          });
                        }

                        const ps = placeSearch.get();
                        if (ps?.type == 'success') {
                          const psv = ps.value;
                          if (psv.length) {
                            const list: AllPoint[] = [...fs];
                            psv.forEach(d => {
                              if (!includePoint(fs, d)) {
                                list.push(d);
                              }
                            });
                            fs = list;
                          }
                        }
                        return fs;
                      },
                      v => [v.address, v.name] as const,
                      function (get) {
                        const point = get();
                        const marker = new window.AMap.Marker({
                          position: point.position,
                          label: point.name,
                          icon: markPNG,
                          offset: new window.AMap.Pixel(-10, -30),
                          zIndex: 100,
                        });
                        hookTrackSignal(get, function (o) {
                          marker.setPosition(o.position);
                          marker.setLabel(o.name);
                        });
                        hookAddResult(marker);

                        let infoWindow: any = null;
                        hookDestroy(() => {
                          infoWindow?.close();
                        });
                        // 标记点击事件
                        function eventHandler() {
                          try {
                            infoWindow = renderInfoWindow({
                              map,
                              marker,
                              get,
                              favoritePoints,
                            });
                          } catch (e) {
                            console.error('创建信息窗口失败:', e);
                          }
                        }

                        marker.on('mouseover', eventHandler);
                        marker.on('click', eventHandler);
                        marker.on('touchstart', eventHandler);
                      },
                      arrayMapCreater
                    );
                  });
                }
              );
            } else {
              // 地图加载失败或未加载完成
              renderMapLoading();
            }
          });
        },
      });
    },
  });

  // 检查是否正在加载
  function isLoading() {
    return !mapSignal.get() || placeSearch.loading();
  }
}
