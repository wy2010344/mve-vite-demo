import { faker } from '@faker-js/faker';
import { fdom, FPDomAttributes } from 'mve-dom';
import { hookDestroy, renderArrayToArray, renderOne } from 'mve-helper';
import { animateSignal } from 'wy-dom-helper';
import {
  alawaysFalse,
  AnimateSignal,
  arrayMove,
  batchSignalEnd,
  beforeMoveOperate,
  createSignal,
  easeFns,
  GetValue,
  memo,
  quote,
  reorderCheckTarget,
  StoreRef,
  tween,
  ValueOrGet,
} from 'wy-helper';
import themeDropdown, { randomTheme } from '../../themeDropdown';
import fixRightTop from '../../fixRightTop';
import { renderMobileView } from '../../onlyMobile';
import { cns, setEdgeScroll } from 'mve-dom-helper';
import {
  getClickPosition,
  simpleDragContainer,
  SimpleDragData,
} from 'mve-dom-helper';
import { animate } from 'motion';

export const dataList = Array(30)
  .fill(1)
  .map((_, i) => {
    return {
      index: i,
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      theme: randomTheme(),
      h: Math.floor(Math.random() * 100 + 50),
    };
  });

type Row = (typeof dataList)[0];
const ease1 = tween(600, easeFns.out(easeFns.circ));

type DragData = SimpleDragData<Row> & {
  targetPlaceholder?: {
    readonly index: () => number;
    readonly beforeId: () => Row;
  };
};

/**
 * 不太靠谱，不应该实时交换，而应该最终交换
 * 1.偏移量，其实正在拖拽的容器，应该向外露出一个高度，即使变，也是observerSize。
 * 如果大家都是observerSize,则绝对定位也是可以的。
 * 绝对定位相对轻松
 * 但每个高度不一样，需要累积前面的高度。。
 * 那么还是拖拽的预览？？就需要一个预览视图
 * @returns
 */
export default function () {
  fixRightTop(function () {
    themeDropdown();
  });
  const orderList = createSignal(dataList);
  const dragData = createSignal<DragData | undefined>(undefined);
  const { createListContainer, getAccept } = simpleDragContainer({
    getDragData: dragData.get,
    setDragData: dragData.set,
    changeIndexAnimate(div, dir, from) {
      animate(div, { [dir]: [from, 0] });
    },
    onDragFinish(d, value) {
      if (value) {
        if (value.accept == 'move') {
          //立即调整本地顺序，乐观更新
          // onDrop(d);
          const preview = d.targetPlaceholder;
          if (!preview) {
            throw 'no preview placeholder';
          }
          const fromList = orderList.get().filter(x => x != d.id);

          const beforeId = preview.beforeId();
          if (beforeId) {
            const idx = fromList.indexOf(beforeId);
            fromList.splice(idx, 0, d.id);
          } else {
            fromList.push(d.id);
          }
          orderList.set(fromList);
        }
      }
      d.onDropEnd.set(true);
      batchSignalEnd();
    },
  });
  return renderMobileView(function ({ width, height }, mock) {
    const getList = memo<Row[]>(() => {
      return orderList.get().filter(x => {
        const d = dragData.get();
        if (d && x == d.id && !d.onDropEnd.get()) {
          return false;
        }
        return true;
      });
    });

    const { renderChildren, plugin } = createListContainer({
      accept(n) {
        return 'move';
      },
      direction: 'y',
      getList,
      getId: quote,
      createDragData(e, key, container) {
        return {
          ...getClickPosition(e, container),
          startEvent: e,
          id: key,
          activeContainer: createSignal(null),
          dragX: animateSignal(0),
          dragY: animateSignal(0),
          onDropEnd: createSignal(false),
        };
      },
      preview(index, d) {
        d.targetPlaceholder = {
          index,
          element: renderView(d.id, {
            children: index,
            s_opacity: 0,
            showTop: index,
          }),
          beforeId() {
            return getList()[index()];
          },
        };
      },
    });
    fdom.div({
      s_width: '100%',
      s_height: '100%',
      s_overflow: 'auto',
      s_marginInline: 'auto',
      s_position: 'relative',
      className: 'daisy-list touch-none pl-1 pr-1',
      plugin,
      children() {
        renderChildren(function ({
          key,
          getData,
          getIndex,
          onPointerDown,
          plugin,
        }) {
          renderView(key, {
            showTop: getIndex,
            children: getIndex,
            plugin,
            onPointerDown,
            className() {
              return dragData.get()?.id == key
                ? 'opacity-0 pointer-events-none'
                : '';
            },
          });
        });

        renderOne(dragData.get, d => {
          if (d) {
            renderView(d.id, {
              children: 'move...',
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
            });
          }
        });
      },
    });
  });
}

function renderView(
  v: Row,
  {
    showTop = alawaysFalse,
    children,
    ...args
  }: {
    showTop?: GetValue<any>;
    children: ValueOrGet<string | number>;
  } & FPDomAttributes<'div'>
) {
  const marginTop = 10; //Math.floor(Math.random() * 10 + 5)
  return fdom.div({
    s_position: 'relative',
    ...args,
    className: cns(
      'daisy-row daisy-card flex-row gap-1 pl-1 pr-1',
      args.className
    ),
    data_theme: v.theme,
    s_display: 'flex',
    s_alignItems: 'center',
    s_marginTop() {
      return showTop() ? `${marginTop}px` : '0px';
    },
    s_minHeight: `${v.h}px`,
    children() {
      fdom.img({
        src: v.avatar,
        s_width: '50px',
        s_height: '50px',
      });
      fdom.span({
        childrenType: 'text',
        children: v.name,
      });
      fdom.hr({
        s_flex: 1,
      });
      fdom.span({
        childrenType: 'text',
        children: children,
      });
    },
  });
}
