import { FPDomAttributes, fdom } from 'mve-dom';
import { renderOne } from 'mve-helper';
import { StoreRef, batchSignalEnd, createSignal, memo, quote } from 'wy-helper';
import {
  SimpleDragData,
  getClickPosition,
  simpleDragContainer,
} from 'mve-dom-helper';
import { cns } from 'mve-dom-helper';
import { animateSignal } from 'wy-dom-helper';
import { animate } from 'motion';

type Model = number | ListModel;
type ListModel = StoreRef<Model[]>;
type DragData = SimpleDragData<Model> & {
  readonly from: ListModel;
  targetPlaceholder?: {
    readonly index: () => number;
    readonly list: ListModel;
    readonly beforeId: () => Model;
  };
};

const dragData = createSignal<DragData | undefined>(undefined);
const { createListContainer } = simpleDragContainer({
  getDragData: dragData.get,
  setDragData: dragData.set,
  changeIndexAnimate(div, dir, from) {
    animate(div, { [dir]: [from, 0] });
  },
  onDragFinish(d, value) {
    //这里可以改成
    if (value) {
      if (value.accept == 'move') {
        //立即调整本地顺序，乐观更新
        // onDrop(d);
        const preview = d.targetPlaceholder;
        if (!preview) {
          throw 'no preview placeholder';
        }
        const fromList = d.from.get().filter(x => x != d.id);
        if (d.from != preview.list) {
          //操作两处
          preview.list.set(
            preview.list.get().toSpliced(preview.index(), 0, d.id)
          );
        } else {
          const beforeId = preview.beforeId();
          if (beforeId) {
            const idx = fromList.indexOf(beforeId);
            fromList.splice(idx, 0, d.id);
          } else {
            fromList.push(d.id);
          }
        }
        d.from.set(fromList);
      }
    }
    d.onDropEnd.set(true);
    batchSignalEnd();
  },
});
/**
 * 嵌套列表，当然可以抽象出单列表
 * 还有一种常用的是左边是原型的拖拽复制，但右边是调整嵌套顺序。模板页面，只有pointerDown事件
 */
export default function () {
  const root = createSignal([0, 1, 2, createSignal([3, 4, 5, 6])]);

  fdom.div({
    className: 'w-full h-full',
    children() {
      renderModel(root);
      renderOne(dragData.get, d => {
        if (d) {
          renderModel(d.id, {
            className: 'pointer-events-none opacity-90 fixed',
            s_position: 'fixed',
            s_width: `${d.width}px`,
            s_height: `${d.height}px`,
            s_top() {
              return `${d.dragY.get() - d.y}px`;
            },
            // s_left() {
            //   return `${d.dragX.get() - d.x}px`;
            // },
            s_transformOrigin() {
              return `${d.x}px ${d.y}px`;
            },
            // s_rotate() {
            //   return dragData.get()?.onDropEnd.get() ? '0deg' : '-15deg';
            // },
          });
        }
      });
    },
  });
}

function renderModel(
  model: Model,
  args?: FPDomAttributes<'div'>,
  onPointerDown?: (e: PointerEvent, container?: Element) => void
) {
  if (typeof model == 'number') {
    return fdom.div({
      ...args,
      onPointerDown,
      className: cns('h-10 bg-blue-300', args?.className),
      children: model,
    });
  } else {
    const getList = memo<Model[]>(() => {
      return model.get().filter(x => {
        const d = dragData.get();
        if (d && x == d.id && !d.onDropEnd.get()) {
          return false;
        }
        return true;
      });
    });
    const { plugin, renderChildren } = createListContainer({
      accept(n) {
        return 'move';
      },
      direction: 'y',
      getList,
      getId: quote,
      createDragData(e, key, target) {
        return {
          ...getClickPosition(e, target),
          id: key,
          activeContainer: createSignal(null),
          dragX: animateSignal(0),
          dragY: animateSignal(0),
          onDropEnd: createSignal(false),
          from: model,
        };
      },
      preview(index, d) {
        const element = renderModel(d.id, {
          s_opacity: 0,
          s_backgroundColor: 'yellow',
        });
        d.targetPlaceholder = {
          index,
          element,
          list: model,
          beforeId() {
            return getList()[index()];
          },
        };
      },
    });
    return fdom.div({
      ...args,
      plugin(e) {
        plugin(e);
        args?.plugin?.(e);
      },
      className: cns(
        'flex flex-col gap-1 items-stretch p-4 relative border-green-700 border-2',
        args?.className
      ),
      children(c: HTMLElement) {
        fdom.div({
          onPointerDown(e) {
            onPointerDown?.(e, c);
          },
          className: 'h-5 bg-gray-300',
        });
        renderChildren(function ({ key, plugin, onPointerDown }) {
          renderModel(
            key,
            {
              plugin,
              className() {
                return dragData.get()?.id == key
                  ? 'opacity-0 pointer-events-none'
                  : '';
              },
            },
            onPointerDown
          );
        });
      },
    });
  }
}
