import { fsvg } from 'mve-dom';
import { IconInfo } from 'mve-icons';
import { EmptyFun } from 'wy-helper';

export function renderSizeSvg(
  fun: IconInfo,
  attrs: {
    viewBox: string;
  },
  children: EmptyFun,
  size: string
) {
  return fsvg.svg({
    ...attrs,
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeWidth: 0,
    width: size,
    height: size,
    children,
  });
}
