import { fdom } from 'mve-dom';
import { draftText, noteText } from './todo-editor';
import view from './view';

export default function () {
  fdom.div({
    className: 'h-full w-full overflow-y-auto px-4 py-8',
    children() {
      fdom.div({
        className: 'mx-auto flex w-full max-w-5xl flex-col gap-4',
        children() {
          fdom.div({
            className: 'flex flex-wrap items-end justify-between gap-3',
            children() {
              fdom.div({
                children() {
                  fdom.p({
                    className:
                      'text-xs font-semibold uppercase tracking-widest opacity-60',
                    childrenType: 'text',
                    children: 'CANVAS / CLASS-BASED NODE TREE',
                  });
                  fdom.h1({
                    className: 'text-3xl font-bold',
                    childrenType: 'text',
                    children: 'canvasRender · 待办清单',
                  });
                },
              });
              fdom.p({
                className: 'text-sm opacity-70',
                childrenType: 'text',
                children: () =>
                  `草稿 ${draftText.get().length} 字 · 备注 ${noteText.get().length} 字`,
              });
            },
          });

          const canvas = fdom.canvas({
            aria_label: 'canvasRender 待办清单演示',
            className:
              'block h-[1000px] min-h-95 w-full rounded-md border border-base-300 bg-white',
          });

          // view 内部会先 await CanvasKit/字体就绪再渲染
          void view(canvas);
        },
      });
    },
  });
}
