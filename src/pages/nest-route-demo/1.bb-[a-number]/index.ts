import { fdom } from 'mve-dom';
import { LeafLoaderParam } from 'mve-helper';
import { PairNode } from 'wy-helper/router';

export default function (
  args: LeafLoaderParam<{
    a: number;
  }>
) {
  fdom.div({
    childrenType: 'text',
    children() {
      return `bb-number - ${args.getQuery().a}`;
    },
  });
}
