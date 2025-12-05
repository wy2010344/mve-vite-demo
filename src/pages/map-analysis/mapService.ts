import {
  LocationPoint,
  CompletePoint,
  PlacePoint,
  FavoritePoint,
} from './types';
import { emptyArray } from 'wy-helper';

export class MapService {
  private map: any = null;

  constructor(map: any) {
    this.map = map;
  }

  /**
   * 初始化地图
   */
  static async initMap(
    mapContainer: any,
    center: [number, number],
    zoom: number
  ): Promise<any> {
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '811146c1dedbe9a85efd6941649c3c2f',
    };

    await loadAMap();
    const map = new window.AMap.Map(mapContainer, {
      center,
      zoom,
      resizeEnable: true,
    });

    // 加载定位插件
    map.plugin('AMap.Geolocation', () => {
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        buttonPosition: 'RB',
      });

      map.addControl(geolocation);
    });

    return map;
  }

  /**
   * 搜索地点
   */
  searchPlace(keyword: string, city: string): Promise<CompletePoint[]> {
    return new Promise(resolve => {
      this.map.plugin('AMap.AutoComplete', () => {
        const autoComplete = new window.AMap.AutoComplete({ city });
        autoComplete.search(keyword, (status: string, result: any) => {
          if (status === 'complete' && result.tips) {
            const results = result.tips.map((tip: any) => ({
              id: tip.id,
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
  }

  /**
   * 定位当前位置
   */
  locateCurrentPosition(): Promise<[number, number] | null> {
    return new Promise(resolve => {
      this.map.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete' && result.position) {
            resolve([result.position.lng, result.position.lat]);
          } else {
            resolve(null);
          }
        });
      });
    });
  }

  /**
   * 设置地图中心点
   */
  setCenter(center: [number, number]): void {
    this.map.setCenter(center);
  }

  /**
   * 设置地图缩放级别
   */
  setZoom(zoom: number): void {
    this.map.setZoom(zoom);
  }

  /**
   * 销毁地图
   */
  destroy(): void {
    this.map.destroy();
  }
}

/**
 * 加载AMap API
 */
async function loadAMap(): Promise<void> {
  if (window.AMap) return;

  await import('@amap/amap-jsapi-loader').then(loader => {
    return loader.load({
      key: '03df49f09390a61d18f9e85389487e8e',
      version: '2.0',
      plugins: ['AMap.Geolocation', 'AMap.AutoComplete', 'AMap.PlaceSearch'],
    });
  });
}
