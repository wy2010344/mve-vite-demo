import { hookTheme } from 'daisy-mobile-helper';
import { fsvg } from 'mve-dom';
import { createStyle } from 'wy-dom-helper/window-theme';
import { GetValue, SetValue, StoreRef, alawaysFalse } from 'wy-helper';
import { context } from './context';
import { getSmoothStepPath } from './util/smoothstep-edge';
import { getBezierPath } from './util/bezier-edge';

export interface Edge {}

export function Edge({
  fromX,
  fromY,
  toX,
  toY,
  selected = alawaysFalse,
  isNew,
  onPointerDown,
}: {
  fromX: GetValue<number>;
  fromY: GetValue<number>;
  toX: GetValue<number>;
  toY: GetValue<number>;
  isNew?: boolean;
  selected?(): any;
  onPointerDown?(e: PointerEvent): void;
}) {
  const getStyle = hookTheme(edge);

  fsvg.svg({
    className: getStyle('wrapper'),
    children() {
      fsvg.path({
        className() {
          return getStyle('edge', {
            new: isNew,
            selected: selected(),
          });
        },
        onPointerDown(e) {
          e.stopPropagation();
          onPointerDown?.(e);
        },
        d() {
          const [path] = getBezierPath({
            sourceX: fromX(),
            sourceY: fromY(),
            targetX: toX(),
            targetY: toY(),
          });
          return path;
        },
      });
    },
  });
}

const edge = createStyle(
  token => {
    return {
      wrapper: {
        base: {
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        },
      },
      edge: {
        base: {
          pointerEvents: 'all',
          stroke: 'rgba(168, 168, 168, 0.8)',
          strokeWidth: 2,
          fill: 'transparent',
          cursor: 'pointer',
        },
        variants: {
          new: {
            true: {
              stroke: 'rgba(168, 168, 168, 0.4)',
            },
          },
          selected: {
            true: {
              stroke: 'rgb(216, 141, 62)',
              strokeWidth: 3,
              zIndex: 100,
            },
          },
        },
      },
    };
  },
  { wrapper: {}, edge: {} }
);
