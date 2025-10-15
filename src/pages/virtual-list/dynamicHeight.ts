import { getSubListInfo } from 'mve-helper';
import {
  batchSignalEnd,
  createSignal,
  getSubListForVirtualList,
  GetValue,
  memo,
  ReadArray,
} from 'wy-helper';
import hookMeasureHeight from './hookMeasureHeight';

export function dynamicHeightWithId() {
  const cacheMap = new Map<number, number>();
  const averageHeight = createSignal(100);
  function getHeightWithId(id: number) {
    const h = cacheMap.get(id);
    if (typeof h == 'number') {
      return h;
    }
    return averageHeight.get();
  }
  return {
    getHeightWithId,
    averageHeight: averageHeight.get,
    updateHeight(key: number, h: number) {
      if (h) {
        const c = cacheMap.size;
        if (cacheMap.has(key)) {
          //更新
          averageHeight.set((averageHeight.get() * (c - 1) + h) / c);
        } else {
          //新增
          averageHeight.set((averageHeight.get() * c + h) / (c + 1));
        }
        cacheMap.set(key, h);

        batchSignalEnd();
      }
    },
  };
}

/**
 * 这个每次汇总,性能倒显示不好?
 * @param getList
 * @param getCellHeight
 * @returns
 */
export function dynamidHeightWithData<T>(
  getList: GetValue<ReadArray<T>>,
  getCellHeight: (v: T) => number | undefined
) {
  const averageHeight = memo(() => {
    const array = getList();
    let h = 0;
    let c = 0;
    for (let i = 0; i < array.length; i++) {
      const rowHeight = getCellHeight(array[i]);
      if (typeof rowHeight == 'number') {
        h = h + rowHeight;
        c++;
      }
    }
    if (c) {
      /**
       * 计算平均高度
       */
      return h / c;
    }
    //不设个最小高度,会从0到结束
    return 100;
  });

  function getHeight(v: T) {
    const h = getCellHeight(v);
    if (typeof h == 'number') {
      return h;
    }
    return averageHeight() || 100;
  }

  return {
    getHeight,
    averageHeight,
  };
}

export function forEachSub<T, K>(
  getList: GetValue<ReadArray<T>>,
  getId: (v: T) => K,
  subList: GetValue<readonly [number, number]>
) {
  return function (callback: (key: K, value: T) => void) {
    const array = getList();
    const [beginIndex, endIndex] = subList();
    for (let i = beginIndex; i < endIndex; i++) {
      const row = array[i];
      callback(getId(row), row);
    }
  };
}

export function forEachSubWithPadding<T, K>(
  getList: GetValue<ReadArray<T>>,
  getId: (v: T) => K,
  subList: GetValue<readonly [number, number]>,
  getTop: GetValue<number>,
  getItemHeight: (n: K) => number
) {
  return function (
    callback: (key: K, value: { value: T; top: number }) => void
  ) {
    const array = getList();
    const [beginIndex, endIndex] = subList();
    let start = getTop();
    for (let i = beginIndex; i < endIndex; i++) {
      const row = array[i];
      const id = getId(row);
      callback(id, {
        value: row,
        top: start,
      });
      start = start + getItemHeight(id);
    }
  };
}

export function forEachSubReverse<T, K>(
  getList: GetValue<ReadArray<T>>,
  getId: (v: T) => K,
  subList: GetValue<readonly [number, number]>
) {
  return function (callback: (key: K, value: T) => void) {
    const array = getList();
    const [beginIndex, endIndex] = subList();
    for (let i = endIndex; i > beginIndex; i--) {
      const row = array[i - 1];
      callback(getId(row), row);
    }
  };
}
