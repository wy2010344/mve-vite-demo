import { setLayoutIndex } from 'daisy-mobile-helper';
import { setEdgeScroll } from 'mve-dom-helper';
import { hookDestroy, renderArrayKey } from 'mve-helper';
import { pointerMove } from 'wy-dom-helper';
import {
  AnimateSignal,
  GetValue,
  PointKey,
  ReadArray,
  SetValue,
  StoreRef,
  ValueOrGet,
  addEffect,
  createSignal,
  emptyFun,
  memo,
  readArraySlice,
  valueOrGetToGet,
} from 'wy-helper';

/**
 * 二分查找（升序数组）
 * @param arr 已排序数组
 * @param target 目标值
 * @param compare 可选的比较器；默认升序数字比较
 * @returns 找到则返回索引；否则返回 -(插入位置 + 1)，保证负数且连续
 */
export function binarySearch<A, T>(
  arr: ReadArray<A>,
  compare: (a: A) => number
): number {
  // for (let i = 0; i < arr.length; i++) {
  //   //可以启用二分查找法
  //   const o = compare(arr[i]);
  //   if (o > 0) {
  //     return i;
  //   }
  // }
  // return arr.length;

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // 位运算防溢出
    const mid = Math.floor((left + right) / 2); // 无位运算
    const cmp = Math.sign(compare(arr[mid]));

    if (cmp === 0)
      return mid; // 命中
    else if (cmp < 0) {
      // 中间值偏小，搜右半
      left = mid + 1;
    } else {
      right = mid - 1; // 中间值偏大，搜左半
    }
  }

  return left;
  // 未找到：返回 -(插入位置 + 1)
  // return -(left + 1);
}

function watchScrollable(el: HTMLElement, cb: SetValue<boolean>) {
  let last = false; // 缓存上一次的溢出状态
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const cr = entry.contentRect; // 内容尺寸
      const isScrollable = cr.height > el.clientHeight;
      if (isScrollable !== last) {
        last = isScrollable;
        cb(isScrollable);
      }
    }
  });
  ro.observe(el, { box: 'content-box' }); // 只观察内容区
  return () => ro.disconnect(); // 返回取消函数
}
const acceptKey = Symbol('accept');
type GetActiveContainer<DragData> = (d: DragData) => Element | null;
export function hookAccept<DragData, DragType>(
  getDragData: () => DragData | void,
  getActiveContainer: GetActiveContainer<DragData>
) {
  return memo<
    | undefined
    | {
        data: DragData;
        container: Element;
        accept: DragType;
      }
  >(last => {
    const data = getDragData();
    if (!data) {
      return;
    }
    let element: Element | null = getActiveContainer(data);

    while (element) {
      const accept = (element as any)[acceptKey] as
        | ((n: DragData) => DragType)
        | undefined;
      if (accept) {
        if (last && last.container == element && last.data == data) {
          //幂等缓存
          return last;
        }
        return {
          data,
          accept: accept(data),
          container: element,
        };
      }
      element = element.parentElement;
    }
  });
}

class Preview<DragData> {
  constructor(readonly dragData: DragData) {}
}
type PointerEventBase = {
  pageX: number;
  pageY: number;
  currentTarget: any;
};
type PointerDownArg<DragData> = {
  createDragData(): DragData;
  onDragFinish(d: DragData): void;
};
export function buildContainer<T, DragData, DragType, K = any>({
  setDragData,
  getDragData,
  getDragX,
  getDragY,
  setDragX,
  setDragY,
  getActiveContainer,
  setActiveContainer,
  getDropped,
  getPreviewRef,
  pluginChild,
}: {
  setDragData: SetValue<DragData>;
  getDragData: GetValue<DragData | undefined>;
  getDragX(n: DragData): number;
  getDragY(n: DragData): number;
  setDragX(x: DragData, n: number): void;
  setDragY(x: DragData, n: number): void;
  // getDragId(n: DragData): K;
  //是否已经停止拖拽
  getDropped(n: DragData): any;
  getActiveContainer: GetActiveContainer<DragData>;
  setActiveContainer(n: DragData, e: Element): void;
  getPreviewRef(x: DragData): Element | undefined;
  pluginChild(key: K, e: Element): void;
}) {
  const getAccept = hookAccept<DragData, DragType>(
    getDragData,
    getActiveContainer
  );
  function onPointerDown(
    e: PointerEventBase,
    arg: PointerDownArg<DragData>,
    container: HTMLElement
  ) {
    if (getDragData()) {
      console.log('正在拖拽中。。。');
      return;
    }
    const d = arg.createDragData();
    setDragData(d);
    setDragX(d, e.pageX);
    setDragY(d, e.pageY);
    setActiveContainer(d, container);
    let lastE = e as unknown as PointerEvent;
    document.body.style.userSelect = 'none';
    function didMove(moveE: PointerEvent) {
      const diffX = moveE.pageX - lastE.pageX;
      const diffY = moveE.pageY - lastE.pageY;
      setDragX(d, getDragX(d) + diffX);
      setDragY(d, getDragY(d) + diffY);
      lastE = moveE;
      //要从preview的上一层开始
      let place = moveE.target as any;
      const preveRef = getPreviewRef(d);
      if (preveRef) {
        if (preveRef.contains(place)) {
          place = preveRef.parentElement;
        }
      }
      setActiveContainer(d, place);
    }
    pointerMove({
      onMove: didMove,
      onEnd(e) {
        didMove(e);
        document.body.style.userSelect = '';
        arg.onDragFinish(d);
      },
    });
  }

  const createListContainer: CreateListContainer<T, DragData, DragType, K> = ({
    getList,
    getId,
    accept,
    preview = emptyFun,
    direction = 'y',
  }) => {
    const getDirection = valueOrGetToGet(direction);
    const map = new Map<K, HTMLElement>();
    const scrollTop = createSignal(0);
    const scrollLeft = createSignal(0);
    // let container: HTMLElement;
    function index() {
      const dragD = getDragData();
      if (!dragD) {
        return;
      }
      if (getAccept()?.container != n.container) {
        return;
      }
      if (getDropped(dragD)) {
        return;
      }
      const crect = n.container!.getBoundingClientRect();
      if (getDirection() == 'y') {
        const dy = getDragY(dragD);
        const st = scrollTop.get();
        if (dy < crect.top) {
          return;
        }
        if (dy > crect.bottom) {
          return;
        }
        const tasks = getList();
        return {
          dragData: dragD,
          index: binarySearch(tasks, function (task) {
            const div = map.get(getId(task));
            if (!div) {
              throw '';
            }
            //使用offsetTop,所有父容器需要是relative/absolute/fixed
            const top = div.offsetTop + crect.top - st;
            return top + div.clientHeight / 2 - dy;
          }),
        };
      } else {
        const dx = getDragX(dragD);
        const st = scrollLeft.get();
        if (dx < crect.left) {
          return;
        }
        if (dx > crect.right) {
          return;
        }
        const tasks = getList();
        return {
          dragData: dragD,
          index: binarySearch(tasks, function (task) {
            const div = map.get(getId(task));
            if (!div) {
              throw '';
            }
            const left = div.offsetLeft + crect.left - st;
            return left + div.clientWidth / 2 - dx;
          }),
        };
      }
      // return tasks.length;
    }
    const getTasksWithPreview = memo<ReadArray<T | Preview<DragData>>>(() => {
      const i = index();
      if (!i) {
        return getList();
      }
      const ts = readArraySlice(getList()) as (T | Preview<DragData>)[];
      ts.splice(i.index, 0, new Preview(i.dragData));
      return ts;
    });
    const n: ListContainer<T, DragData, DragType, K> = {
      plugin(div: HTMLElement) {
        n.container = div;
        (div as any)[acceptKey] = accept;
        div.addEventListener('scroll', e => {
          scrollTop.set(div.scrollTop);
          scrollLeft.set(div.scrollLeft);
        });
        setEdgeScroll(div, {
          shouldMeasure() {
            //其实是一停止拖拽，就需要停止
            return getTasksWithPreview().length != getList().length;
          },
          direction: getDirection,
        });
      },
      renderChildren(render) {
        renderArrayKey(
          getTasksWithPreview,
          v => {
            if (v instanceof Preview) {
              return v;
            }
            return getId(v as T);
          },
          function (getValue, getIndex, key) {
            if (key instanceof Preview) {
              preview(getIndex, key.dragData);
            } else {
              render({
                container: n.container!,
                key: key as K,
                getData: getValue as GetValue<T>,
                getIndex,
                plugin(e) {
                  setLayoutIndex(e, getIndex, getDirection);
                  map.set(key as K, e);
                  hookDestroy(() => {
                    map.delete(key as K);
                  });
                  pluginChild(key, e);
                },
                onPointerDown(e, arg) {
                  onPointerDown(e, arg, n.container!);
                },
              });
            }
          }
        );
      },
    };
    return n;
  };
  return {
    onPointerDown,
    getAccept,
    createListContainer,
  };
}

export type CreateListContainer<T, DragData, DragType, K = any> = (args: {
  /**是否接受dragData中的data,如果accept，返回什么类型*/
  accept(n: DragData): DragType | void;
  direction?: ValueOrGet<PointKey>;
  getList: GetValue<ReadArray<T>>;
  getId(n: T): K;
  /**点位预览*/
  preview?(getIndex: GetValue<number>, d: DragData): void;
}) => ListContainer<T, DragData, DragType, K>;
export type ListContainer<T, DragData, DragType, K = any> = {
  plugin(div: HTMLElement): void;
  container?: HTMLElement;
  renderChildren(
    render: (args: {
      key: K;
      container: Element;
      getData: GetValue<T>;
      getIndex: GetValue<number>;
      onPointerDown(e: PointerEventBase, arg: PointerDownArg<DragData>): void;
      plugin(e: HTMLElement): void;
    }) => void
  ): void;
};
export function getClickPosition(
  e: PointerEvent,
  container: Element = e.currentTarget as any
) {
  const p = container.getBoundingClientRect();
  return {
    x: e.pageX - p.x,
    y: e.pageY - p.y,
    width: p.width,
    height: p.height,
  };
}

export type SimpleDragData<K> = {
  readonly id: K;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly dragX: AnimateSignal;
  readonly dragY: AnimateSignal;
  readonly activeContainer: StoreRef<Element | null>;
  readonly onDropEnd: StoreRef<boolean>;
  targetPlaceholder?: {
    readonly element: Element;
  };
};
export function simpleDragContainer<
  T,
  DragData extends SimpleDragData<K>,
  DragType,
  K = any,
>(arg: {
  setDragData: SetValue<DragData | undefined>;
  getDragData(): DragData | undefined;
}) {
  const out = buildContainer<T, DragData, DragType, K>({
    setDragData: arg.setDragData,
    getDragData: arg.getDragData,
    getPreviewRef(n) {
      return n.targetPlaceholder?.element;
    },
    getActiveContainer(n) {
      return n.activeContainer.get();
    },
    getDragX(n) {
      return n.dragX.get();
    },
    setDragX(x, n) {
      x.dragX.set(n);
    },
    getDragY(n) {
      return n.dragY.get();
    },
    setDragY(x, n) {
      x.dragY.set(n);
    },
    getDropped(n) {
      return n.onDropEnd.get();
    },
    setActiveContainer(n, e) {
      n.activeContainer.set(e);
    },
    pluginChild(key, e) {
      const d = arg.getDragData();
      //必须由影子去表演迁移动画，因为不在容器内，可以会遮住。。。
      if (d && key == d.id && d.onDropEnd.get()) {
        addEffect(() => {
          const r = e.getBoundingClientRect();
          Promise.all([
            d.dragX.animateTo(r.x + d.x),
            d.dragY.animateTo(r.y + d.y),
          ]).then(() => {
            arg.setDragData(undefined);
          });
        });
      }
    },
  });
  return out;
}
