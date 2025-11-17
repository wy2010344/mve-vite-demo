import { faker } from '@faker-js/faker';
import { fdom } from 'mve-dom';
import { hookDestroy, renderArrayToArray } from 'mve-helper';
import {
  animateSignal,
  observerResize,
  pointerMove,
  subscribeScroller,
} from 'wy-dom-helper';
import {
  AnimateSignal,
  arrayMove,
  batchSignalEnd,
  beforeMoveOperate,
  createSignal,
  easeFns,
  reorderCheckTarget,
  StoreRef,
  tween,
} from 'wy-helper';
import themeDropdown, { randomTheme } from '../../themeDropdown';
import fixRightTop from '../../fixRightTop';
import { renderMobileView } from '../../onlyMobile';
import { setEdgeScroll } from 'mve-dom-helper';

export const dataList = Array(30)
  .fill(1)
  .map((_, i) => {
    return {
      index: i,
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
    };
  });

type Row = (typeof dataList)[0];
const ease1 = tween(600, easeFns.out(easeFns.circ));
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
  const onDrag = createSignal<Row | undefined>(undefined);
  return renderMobileView(function ({ width, height }, mock) {
    const container = fdom.div({
      s_width: '100%',
      s_height: '100%',
      s_overflow: 'auto',
      s_marginInline: 'auto',
      s_position: 'relative',
      className: 'daisy-list touch-none pl-1 pr-1',
      s_userSelect() {
        return onDrag.get() ? 'none' : 'auto';
      },
      plugin(div) {
        setEdgeScroll(div, {
          shouldMeasure: onDrag.get,
          direction: 'y',
          config: {
            padding: 10,
            config: true,
          },
        });
      },
      children() {
        const outArray = renderArrayToArray(orderList.get, (v, getIndex) => {
          const h = Math.floor(Math.random() * 100 + 50);
          const transY = animateSignal(0);
          const marginTop = 10; //Math.floor(Math.random() * 10 + 5)
          const div = fdom.div({
            className: 'daisy-row daisy-card flex-row gap-1 pl-1 pr-1',
            data_theme: randomTheme(),
            s_display: 'flex',
            s_alignItems: 'center',
            s_marginTop() {
              return getIndex() ? `${marginTop}px` : '0px';
            },
            s_position: 'relative',
            s_minHeight: `${h}px`,
            s_zIndex() {
              return onDrag.get() == v ? '1' : '0';
            },
            s_transform() {
              return `translateY(${transY.get()}px)`;
            },
            onPointerDown(e) {
              if (onDrag.get()) {
                return;
              }
              const destroyScroll = subscribeScroller(container, 'y', e => {
                transY.set(transY.get() + e);
                return true;
              });
              onDrag.set(v);
              let lastPageY = e.pageY;
              pointerMove({
                onMove(e) {
                  transY.set(transY.get() + e.pageY - lastPageY);
                  lastPageY = e.pageY;
                  const outList = outArray();
                  didMove(orderList, out, outList, marginTop);
                  batchSignalEnd();
                },
                onEnd(e) {
                  destroyScroll();
                  transY.animateTo(0, ease1).then(() => {
                    onDrag.set(undefined);
                  });
                  batchSignalEnd();
                },
              });
              batchSignalEnd();
            },
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
                children: getIndex,
              });
            },
          });

          const height = createSignal(0);
          hookDestroy(
            observerResize(() => {
              height.set(div.offsetHeight);
            }, div)
          );
          const out = {
            height: height.get,
            div,
            transY,
            getIndex,
          };
          return out;
        });
      },
    });
  });
}

function getOffset(v: {
  div: {
    offsetHeight: number;
  };
  transY: AnimateSignal;
}) {
  return v.div.offsetHeight;
}

type MoveItem = {
  div: HTMLElement;
  getIndex(): number;
  transY: AnimateSignal;
};

function didMove<T>(
  orderList: StoreRef<T[]>,
  item: MoveItem,
  outList: MoveItem[],
  gap: number = 0
) {
  const n = reorderCheckTarget(
    outList,
    item.getIndex(),
    getOffset,
    item.transY.get(),
    gap
  );
  if (n) {
    const [fromIndex, toIndex] = n;
    const diff = beforeMoveOperate(
      fromIndex,
      toIndex,
      outList,
      getOffset,
      gap,
      (row, from) => {
        /**
         * 如果依margin,则元素应该有margin?
         * 如果元素在位置1,则无margin与gap
         * 如果不在位置1,则有margin与gap
         */
        row.transY.set(from);
        row.transY.changeTo(0, ease1);
        console.log('change...');
      }
    );
    orderList.set(arrayMove(orderList.get(), fromIndex, toIndex, true));
    item.transY.silentDiff(diff);
  }
}

function didMoveMarginTop<T>(
  orderList: StoreRef<T[]>,
  { div, transY, getIndex }: MoveItem,
  outList: MoveItem[],
  marginTop: number = 0
) {
  const index = getIndex();

  const didCenterOffsetTop =
    div.offsetTop + transY.get() + div.offsetHeight / 2;
  // console.log("dd", transY.get())
  if (transY.get() < 0) {
    //向上
    let justIndex = -1;
    for (let i = 0; i < index && justIndex < 0; i++) {
      const row = outList[i];
      const rowCenter = row.div.offsetTop + row.div.offsetHeight / 2;
      if (didCenterOffsetTop < rowCenter) {
        //第一个超过的元素
        justIndex = i;
      }
    }
    if (justIndex > -1) {
      const diff = div.offsetTop - outList[justIndex].div.offsetTop;
      for (let i = justIndex; i < index; i++) {
        const row = outList[i];
        // row.transY.changeTo(-div.offsetHeight - marginTop)
        row.transY.set(-div.offsetHeight - marginTop);
        /**
         * 如果依margin,则元素应该有margin?
         * 如果元素在位置1,则无margin与gap
         * 如果不在位置1,则有margin与gap
         */
        row.transY.changeTo(0, ease1);
      }
      console.log(
        'aa',
        index,
        justIndex,
        diff,
        transY.get(),
        diff + transY.get()
      );
      orderList.set(arrayMove(orderList.get(), index, justIndex, true));
      transY.silentDiff(diff);
    }
  } else {
    //向下
    let justIndex = -1;
    for (let i = index + 1; i < outList.length && justIndex < 0; i++) {
      const row = outList[i];
      const rowCenter = row.div.offsetTop + row.div.offsetHeight / 2;
      if (didCenterOffsetTop > rowCenter) {
        justIndex = i;
      }
    }
    if (justIndex > -1) {
      const flagDiv = outList[justIndex].div;
      //就是受影响的间隔
      const diff =
        div.offsetTop +
        div.offsetHeight -
        (flagDiv.offsetTop + flagDiv.offsetHeight);
      for (let i = index + 1; i < justIndex + 1; i++) {
        //受影响的表演一次animation动画
        const row = outList[i];
        // row.transY.changeTo(div.offsetHeight + marginTop)
        row.transY.set(div.offsetHeight + marginTop);
        /**
         * 如果依margin,则元素应该有margin?
         * 如果元素在位置1,则无margin与gap
         * 如果不在位置1,则有margin与gap
         */
        row.transY.changeTo(0, ease1);
      }
      console.log('bb', index, justIndex);
      orderList.set(arrayMove(orderList.get(), index, justIndex, true));
      transY.silentDiff(diff);
    }
  }
}
