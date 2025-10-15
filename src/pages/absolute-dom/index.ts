import { faker } from '@faker-js/faker';
import {
  createSignal,
  emptyArray,
  flexDisplayUtil,
  quote,
  simpleFlex,
  simpleStack,
  StoreRef,
} from 'wy-helper';
import { hookTrackSignal, renderArray } from 'mve-helper';
import { dom, fdom, fsvg } from 'mve-dom';
import { hookMeasureSize, renderALayout } from 'mve-dom-helper';

/**
 * @todo 布局是父容器配置子容器
 *  子容器读取到父容器的布局参数,提供给自己的布局方案
 *  这套方案又能读取子容器自身的个性化参数,实现最终的自定义
 *
 *  如果文字或图片,生成建议尺寸
 *  但父容器的布局是否采用它的建议尺寸?不,是容器强制使用用户自己的覆盖尺寸
 * @param n
 * @returns
 */
export default function () {
  const a = createSignal(0);
  const list = createSignal<readonly number[]>(emptyArray as any[]);
  const alist = createSignal<readonly number[]>(emptyArray as any[]);
  const node = renderALayout({
    layout() {
      return simpleFlex({
        direction: 'y',
        alignItems: 'center',
        gap: 10,
      });
    },
    render(n) {
      return fdom.div({
        s_width() {
          return `${n.axis.x.size()}px`;
        },
        s_height() {
          return `${n.axis.y.size()}px`;
        },
        s_position: 'relative',
        children() {
          renderList(list, a);
          renderList(alist, a);
          const size = hookMeasureSize();
          renderALayout({
            ...size,
            render(n) {
              return fdom.button({
                s_whiteSpace: 'nowrap',
                s_position: 'absolute',
                s_left: n.axis.x.position,
                s_top() {
                  return `${n.axis.y.position()}px`;
                },
                plugin: size.plugin,
                onClick() {
                  a.set(a.get() + 1);
                  list.set(list.get().concat(Date.now()));
                  alist.set(alist.get().concat(Date.now()));
                },
                childrenType: 'text',
                children() {
                  return `${list.get().length}数据`;
                },
              });
            },
          });
        },
      });
    },
  });
}

function renderList(list: StoreRef<readonly number[]>, a: StoreRef<number>) {
  renderArray(list.get, (row, getIndex) => {
    const size = hookMeasureSize();
    renderALayout({
      ...size,
      render(n) {
        return fdom.div({
          s_position: 'absolute',
          s_left() {
            return `${n.axis.x.position()}px`;
          },
          s_top() {
            return `${n.axis.y.position()}px`;
          },
          s_whiteSpace: 'nowrap',
          plugin: size.plugin,
          s_background: faker.color.rgb(),
          childrenType: 'text',
          onClick() {
            list.set(list.get().toSpliced(getIndex(), 1));
          },
          children() {
            return `${a.get()}====${row}-${n.index()}--${getIndex()}`;
          },
        });
      },
    });
  });
}
