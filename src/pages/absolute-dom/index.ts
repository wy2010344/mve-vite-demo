import { faker } from '@faker-js/faker';
import { createSignal, emptyArray, StoreRef } from 'wy-helper';
import { renderArray } from 'mve-helper';
import { fdom } from 'mve-dom';
import { hookMeasureSize } from 'mve-dom-helper';

export default function () {
  const a = createSignal(0);
  const list = createSignal<readonly number[]>(emptyArray as any[]);
  const alist = createSignal<readonly number[]>(emptyArray as any[]);
  return fdom.div({
    s_display: 'flex',
    s_flexDirection: 'column',
    s_alignItems: 'center',
    s_gap: '10px',
    s_position: 'relative',
    children() {
      renderList(list, a);
      renderList(alist, a);
      const size = hookMeasureSize();
      fdom.button({
        s_whiteSpace: 'nowrap',
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
}

function renderList(list: StoreRef<readonly number[]>, a: StoreRef<number>) {
  renderArray(list.get, (row, getIndex) => {
    const size = hookMeasureSize();
    fdom.div({
      s_whiteSpace: 'nowrap',
      plugin: size.plugin,
      s_background: faker.color.rgb(),
      childrenType: 'text',
      onClick() {
        list.set(list.get().toSpliced(getIndex(), 1));
      },
      children() {
        return `${a.get()}====${row}-${getIndex()}`;
      },
    });
  });
}
