import { fsvg } from 'mve-dom';
import { IconInfo } from 'mve-icons';
import { EmptyFun, ValueOrGet } from 'wy-helper';

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
export function renderClassNameSvg(
  fun: IconInfo,
  attrs: {
    viewBox: string;
  },
  children: EmptyFun,
  className: ValueOrGet<string>
) {
  return fsvg.svg({
    ...attrs,
    className,
    fill: 'currentColor',
    stroke: 'currentColor',
    strokeWidth: 0,
    children,
  });
}
