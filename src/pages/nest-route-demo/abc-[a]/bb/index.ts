import { fdom } from 'mve-dom';

export default function () {
  fdom.div({
    className: 'bg-red-400',
    childrenType: 'text',
    children: 'bb',
  });
}
