import { fdom } from 'mve-dom';
import { tri } from 'three/tsl';
export default function () {
  fdom.div({
    className: 'bg-gray-600',
    children() {
      fdom.button({
        children: '点击',
      });
    },
  });
}
