import { fdom } from 'mve-dom';

export default function () {
  fdom.div({
    className: 'bg-amber-400',
    childrenType: 'text',
    children: 'aa',
  });
}
