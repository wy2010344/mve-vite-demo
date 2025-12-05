import { fdom, FPDomAttributes } from 'mve-dom';
import { EmptyFun, OneSetStoreRef, run, ValueOrGet } from 'wy-helper';
import {
  getWindowMoveInfo,
  instanceWithCopy,
  PanelWithClose,
} from 'daisy-mobile-helper';
import { hookCurrentParent, hookIsDestroyed } from 'mve-core';
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
        className: cns('absolute pointer-events-auto', className),
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
        s_transformOrigin: 'top left',
        onPointerDown(E) {
          if (isDestroyed()) {
            return;
          }
          info.setIndex(-1);
        },
        ...args,
        children() {
          fdom.div({
            className:
              'w-full h-full bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/20',
            children() {
              // 标题栏
              fdom.div({
                className:
                  'h-10 bg-gradient-to-b from-gray-100 to-gray-200 border-b border-gray-300 flex items-center px-4 cursor-move select-none',
                onPointerDown(e) {
                  beginStep({
                    action: 'move',
                    point: e,
                  });
                },
                children() {
                  // 窗口控制按钮
                  fdom.div({
                    className: 'flex gap-2',
                    children() {
                      // 关闭
                      fdom.button({
                        className:
                          'w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors',
                        onClick(e) {
                          e.stopPropagation();
                          info.closeIt(e);
                        },
                      });
                      // 最小化
                      fdom.button({
                        className:
                          'w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors',
                        onClick(e) {
                          e.stopPropagation();
                          // minimizeWindow();
                        },
                      });
                      // 最大化
                      fdom.button({
                        className:
                          'w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors',
                        onClick(e) {
                          e.stopPropagation();
                          // maximizeWindow();
                        },
                      });
                    },
                  });

                  // 标题
                  fdom.div({
                    className:
                      'flex-1 text-center text-sm font-medium text-gray-700 flex items-center justify-center gap-2',
                    children() {
                      fdom.span({
                        childrenType: 'text',
                        children: icon ?? '',
                      });
                      fdom.span({
                        childrenType: 'text',
                        children: title,
                      });
                    },
                  });

                  fdom.div({ className: 'w-16' }); // 占位
                },
              });

              // 窗口内容
              fdom.div({
                className: 'flex-1 overflow-auto',
                children,
              });

              // 调整大小手柄
              fdom.div({
                className:
                  'absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize',
                onPointerDown(e) {
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
      });
    },
  };
});
