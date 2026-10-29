import { fdom } from 'mve-dom';
import view from './view';

export default function () {
  fdom.div({
    className: 'h-full w-full overflow-y-auto px-4 py-8',
    children() {
      fdom.div({
        className: 'mx-auto flex w-full max-w-5xl flex-col gap-4',
        children() {
          fdom.div({
            children() {
              fdom.p({
                className:
                  'text-xs font-semibold uppercase tracking-widest opacity-60',
                childrenType: 'text',
                children: 'CANVAS / OVERLAY · RICH TEXT · ASYNC',
              });
              fdom.h1({
                className: 'text-3xl font-bold',
                childrenType: 'text',
                children: 'canvasRender2 · 新特性',
              });
            },
          });
          fdom.p({
            className: 'text-sm opacity-70',
            childrenType: 'text',
            children:
              'Toast / Popover·Placement / 右键菜单 / 异步图片（ImageLoader + postDelayed）/ 富文本样式段 / 布局审计 / 指针语义',
          });

          const canvas = fdom.canvas({
            aria_label: 'canvasRender2 新特性演示',
            className:
              'block h-[1180px] min-h-95 w-full rounded-md border border-base-300 bg-white',
          });

          // view 内部会先 await CanvasKit/字体就绪再渲染
          void view(canvas);
        },
      });
    },
  });
}
