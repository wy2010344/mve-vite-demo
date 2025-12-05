import { fdom, FPDomAttributes } from 'mve-dom';
import styles from '../desktop.module.css';
import {
  getWindowMoveInfo,
  instanceWithCopy,
  PanelWithClose,
} from 'daisy-mobile-helper';
import { hookCurrentParent, hookIsDestroyed } from 'mve-core';
import { EmptyFun, OneSetStoreRef, run, ValueOrGet } from 'wy-helper';
import { PopWithRearrange } from 'mve-helper';
import { cns } from 'mve-dom-helper';

export const panel = instanceWithCopy<
  [
    (info: PopWithRearrange<any>) => {
      icon?: ValueOrGet<string>;
      title: ValueOrGet<string | number>;
      x?: OneSetStoreRef<number> | number;
      y?: OneSetStoreRef<number> | number;
      width?: OneSetStoreRef<number> | number;
      height?: OneSetStoreRef<number> | number;
      minWidth?: number;
      minHeight?: number;
      children(): void;
      noCopy?: boolean;
      titleControls?(): void;
    } & FPDomAttributes<'div'>,
  ],
  PanelWithClose
>(function (clone, callback) {
  const closeList: EmptyFun[] = [];
  return {
    closeOther() {
      closeList.forEach(run);
    },
    panel(info) {
      const parent = hookCurrentParent() as HTMLDivElement;
      const {
        title,
        icon,
        children,
        className,
        noCopy,
        titleControls,
        ...args
      } = callback(info);
      const { x, y, beginStep } = getWindowMoveInfo(args, parent);
      const isDestroyed = hookIsDestroyed();
      fdom.div({
        className: cns(
          `${styles.glass} absolute flex flex-col rounded-lg overflow-hidden shadow-2xl transition-opacity duration-200`,
          className
        ),
        s_left() {
          return `${x.position()}px`;
        },
        s_top() {
          return `${y.position()}px`;
        },
        s_width() {
          return `${x.size()}px`;
        },
        s_height() {
          return `${y.size()}px`;
        },
        s_zIndex: info.getIndex,
        onPointerDown(E) {
          if (isDestroyed()) {
            return;
          }
          info.setIndex(-1);
        },
        ...args,
        children() {
          // Title Bar
          fdom.div({
            className:
              'h-10 flex items-center justify-between px-3 select-none bg-white/10 border-b border-white/10',
            onPointerDown(e) {
              beginStep({
                action: 'move',
                point: e,
              });
            },
            children() {
              // Left: Title & Icon
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.span({ children: icon, className: 'text-lg' });
                  fdom.span({
                    children: title,
                    className: 'text-sm font-medium text-white/90',
                  });
                },
              });

              // Right: Controls
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  // Minimize
                  fdom.button({
                    className:
                      'w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors',
                    onClick(e) {
                      e.stopPropagation();
                    },
                  });
                  // Maximize
                  fdom.button({
                    className:
                      'w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors',
                    onClick(e) {
                      e.stopPropagation();
                    },
                  });
                  // Close
                  fdom.button({
                    className:
                      'w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors',
                    onClick(e) {
                      e.stopPropagation();
                      info.closeIt(e);
                    },
                  });
                },
              });
            },
          });

          // Content Area
          fdom.div({
            className:
              'flex-1 overflow-auto bg-white/50 relative text-gray-900',
            children,
          });

          // Resize Handle (Bottom Right)
          fdom.div({
            className:
              'absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50',
            onPointerDown(e) {
              e.stopPropagation();
              beginStep({
                action: 'drag',
                point: e,
                bottom: true,
                right: true,
              });
            },
          });
        },
      });
    },
  };
});
