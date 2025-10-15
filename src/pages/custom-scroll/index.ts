import { fdom } from 'mve-dom';
import { OnScroll } from 'mve-dom-helper';
import { createSignal } from 'wy-helper';

export default function () {
  fdom.div({
    className: 'w-100 h-100 overflow-hidden relative',
    children(container: HTMLElement) {
      const scrollX: OnScroll = OnScroll.hookGet('x', container, {
        maxScroll() {
          return maxScrollX.get();
        },
      });
      const scrollY: OnScroll = OnScroll.hookGet('y', container, {
        maxScroll() {
          return maxScrollY.get();
        },
      });
      const maxScrollX = scrollX.measureMaxScroll();
      const maxScrollY = scrollY.measureMaxScroll();
      const content = fdom.div({
        className: 'w-500 h-500 absolute',
        s_background: `conic-gradient(red, orange, yellow, green, blue)`,
        s_top() {
          return `${-scrollY.get()}px`;
        },
        s_left() {
          return `${-scrollX.get()}px`;
        },
      });
      maxScrollX.hookInit(container, content);
      maxScrollY.hookInit(container, content);
    },
  });
}
