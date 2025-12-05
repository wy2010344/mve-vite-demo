import { fdom } from 'mve-dom';
import { LeafLoaderParam } from 'mve-helper';

export default function (
  args: LeafLoaderParam<{
    a: string;
  }>
) {
  fdom.div({
    childrenType: 'text',
    children() {
      return `bb-str - ${args.getQuery().a}`;
    },
  });
}
