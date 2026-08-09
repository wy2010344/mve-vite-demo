import { fdom } from 'mve-dom';
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
