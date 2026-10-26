import { fdom } from 'mve-dom';
import { fc } from 'mve-helper';

export default function () {
  fdom.div({
    children: [
      [
        function (node) {
          console.log('this', this);
          fdom.div({
            children: 'abc',
          });
        },
        function (node) {
          console.log('ddd', node);
          fdom.div({
            children: 'bbb',
          });
        },
        Bbb(),
      ],
    ],
  });
}

const Bbb = fc(function () {
  fdom.div({
    children: 'zzz',
  });
});
