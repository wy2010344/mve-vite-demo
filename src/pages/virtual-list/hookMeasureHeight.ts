import { hookDestroy } from 'mve-helper';
import { EmptyFun } from 'wy-helper';

export default function (div: HTMLElement, callback: EmptyFun) {
  const ob = new ResizeObserver(callback);
  ob.observe(div);
  hookDestroy(() => {
    ob.disconnect();
  });
}
