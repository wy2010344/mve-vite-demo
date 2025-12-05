// 基础位置点类型
export interface LocationPoint {
  name: string; // 如白石洲
  position: [number, number];
  address: string; // 如"广东省深圳市南山区"
}

// 收藏点类型
export interface FavoritePoint extends LocationPoint {
  favorite?: boolean;
  remark?: string;
}

// 完整搜索结果点类型
export interface CompletePointOrignal {
  id: string;
  name: string;
  address: string;
  location: string;
  typecode: string;
  district: string;
  adcode: string;
  city: any[];
}

// 完整点类型
export interface CompletePoint extends LocationPoint {
  dropdown: true;
}

// 地点搜索结果类型
export interface PlacePointOrignal {
  id: string;
  name: string;
  address: string;
  location: string;
  typecode: string;
  parent: any[];
  childtype: any[];
  type: string;
  biz_type: any[];
  tel: any[];
  pname: string;
  cityname: string;
  adname: string;
  importance: any[];
  shopid: any[];
  shopinfo: string;
  poiweight: any[];
  distance: any[];
  biz_ext: BizExt;
  photos: Photo[];
}

// 地图显示的地点类型
export interface PlacePoint extends LocationPoint {
  place: true;
}

// 所有可能的点类型
export type AllPoint = LocationPoint &
  Partial<FavoritePoint & PlacePoint & CompletePoint>;

// 业务扩展信息
export interface BizExt {
  rating: any[];
  cost: any[];
}

// 照片信息
export interface Photo {
  title: any[];
  url: string;
}

// 城市选项类型
export interface CityOption {
  value: string;
  label: string;
  center: [number, number];
  zoom: number;
}
