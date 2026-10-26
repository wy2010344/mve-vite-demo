import {
  createScroll,
  flex,
  grow,
  imageNode,
  layoutSizeDirection,
  node2,
  nodeOf,
  rectNode,
  registerScroll,
  renderCanvas,
  richTextNode,
  scrollBar,
  scrollContent,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import type { PlatformImage } from 'mve-dom-helper/canvasRender2';
import { loadCanvasKit, registerFont } from 'mve-dom-helper/canvasRender';
import { alawaysFalse, asLazy, createSignal } from 'wy-helper';
import { alawaysGet } from 'wy-helper/tokenParser';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

/**
 * 加载演示字体。CanvasKit（wasm 版）没有系统默认字体，
 * 不注册字体的话段落量出来的宽高都是 0（getLongestLine/getHeight），画不出任何文本。
 */
async function loadDemoFont(): Promise<void> {
  for (const url of FONT_URLS) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const bytes = await resp.arrayBuffer();
      registerFont('Noto Sans SC', bytes);
      return;
    } catch {
      // 尝试下一个源
    }
  }
}

/** 用离屏 canvas 生成一张测试图，避免依赖外部资源 */
function makeImage(colorA: string, colorB: string): PlatformImage {
  const c = document.createElement('canvas');
  c.width = 120;
  c.height = 80;
  const g = c.getContext('2d')!;
  const gradient = g.createLinearGradient(0, 0, c.width, c.height);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);
  g.fillStyle = gradient;
  g.fillRect(0, 0, c.width, c.height);
  return { width: c.width, height: c.height, source: c };
}
export default async function (
  canvas: HTMLCanvasElement,
  onSelectionChange?: (text: string) => void
) {
  // 与其它 demo 一致：先等 CanvasKit 与字体就绪再渲染，避免空段落闪一下
  await loadCanvasKit('/canvas-kit/canvaskit.js');
  await loadDemoFont();

  const imageA = makeImage('#ff8a3d', '#ffd23d');
  const imageB = makeImage('#3d7bff', '#3dffd2');
  const current = createSignal(imageA);

  const { selectionManager } = renderCanvas({
    canvas,
    layout: flex({
      directionJustify: 'center',
      gap: 10,
      alignFix: true,
    }),
    children: [
      // rectNode：背景 + 边框 + 圆角 + padding 一站式可视化盒子
      rectNode.of({
        width: () => 200,
        height: () => 90,
        background: () => 0xfff1f5f9,
        borderColor: () => 0xffcbd5e1,
        borderWidth: () => 1,
        radius: () => 8,
        padding: () => 10,
        children: [
          // nodeOf(() =>
          //   wrappedTextNode({
          //     text: () => 'rectNode：背景/边框/圆角',
          //     fontFamily: () => 'Noto Sans SC',
          //     fontSize: () => 14,
          //     fontWeight: () => 700,
          //     color: () => 0xff0f172a,
          //   })
          // ),
          // nodeOf(() =>
          //   wrappedTextNode({
          //     text: () => '内部是 wrappedTextNode 单片段文本',
          //     fontFamily: () => 'Noto Sans SC',
          //     fontSize: () => 12,
          //     color: () => 0xff64748b,
          //   })
          // ),
        ],
      }),
      // nodeOf(node =>
      //   node2({
      //     layout: flex({
      //       directionJustify: 'center',
      //       gap: 10,
      //       alignFix: true,
      //     }),
      //     width() {
      //       return 100;
      //     },
      //     height() {
      //       return 200;
      //     },
      //     draw(ctx) {
      //       ctx.fillStyle = '#f4f6f4';
      //       ctx.fillRect(0, 0, node.width(), node.height());
      //     },
      //     children: [
      //       nodeOf(node =>
      //         node2({
      //           width() {
      //             return 100;
      //           },
      //           height() {
      //             return 10;
      //           },
      //           draw(ctx) {
      //             ctx.fillStyle = 'red';
      //             ctx.fillRect(0, 0, node.width(), node.height());
      //           },
      //         })
      //       ),
      //       nodeOf(node =>
      //         node2({
      //           width() {
      //             return 100;
      //           },
      //           height() {
      //             return 10;
      //           },
      //           draw(ctx) {
      //             ctx.fillStyle = 'red';
      //             ctx.fillRect(0, 0, node.width(), node.height());
      //           },
      //         })
      //       ),
      //     ],
      //   })
      // ),
      // 原图尺寸 + 圆角 + padding，点击可切换图片（验证信号驱动的重绘）
      imageNode.of({
        image: current.get,
        radius: () => 12,
        padding: () => 8,
        mouseClick() {
          current.set(current.get() === imageA ? imageB : imageA);
        },
      }),
      // 约束外宽为 160，高度按原图比例推算
      // nodeOf(node =>
      //   imageNode({
      //     image: current.get,
      //     radius: () => 12,
      //     padding: () => 8,
      //     imageSize: () => layoutSizeDirection('x', 160, false),
      //   })
      // ),
      // 定宽富文本：自动换行，按住拖拽可以划词
      richTextNode.of({
        width: () => 320,
        padding: () => 8,
        spans: asLazy([
          {
            text: '富文本',
            style: {
              fontSize: 20,
              fontWeight: 700,
              color: 0xff333333,
              fontFamily: 'Noto Sans SC',
            },
          },
          {
            text: 'RichText',
            style: {
              fontSize: 16,
              color: 0xff3d7bff,
              fontFamily: 'Noto Sans SC',
            },
          },
          {
            text: '，按住拖拽可以划词选中（CanvasKit 渲染）。',
            style: {
              fontSize: 14,
              color: 0xff888888,
              fontFamily: 'Noto Sans SC',
            },
          },
        ]),
      }),
      // autoWidth 富文本：宽度由内容决定
      richTextNode.of({
        autoWidth: () => true,
        padding: () => 8,
        spans: () => [
          {
            text: 'autoWidth：宽度由内容决定',
            style: {
              fontSize: 16,
              color: 0xff333333,
              fontFamily: 'Noto Sans SC',
            },
          },
        ],
      }),
      // 滚动列表：容器 rect + scrollContent（裁剪 + 偏移）+ scrollBar（可拖拽滑块）
      // nodeOf(container =>
      //   rectNode({
      //     width: () => 320,
      //     height: () => 220,
      //     background: () => 0xfff8fafc,
      //     borderColor: () => 0xffcbd5e1,
      //     radius: () => 8,
      //     padding: () => 8,
      //     layout: flex({
      //       direction: 'x',
      //       gap: 4,
      //       alignItem: 'stretch',
      //       alignFix: true,
      //     }),
      //     children: [
      //       ctx => {
      //         const scroll = createScroll(container, 'y');
      //         registerScroll(scroll); // 滚轮滚动（指针在容器 inner 区内时消费）
      //         // nodeOf 返回的是待应用的 Fc，数组形态由 buildChildren 统一调用；
      //         // 命令式创建时需手动应用当前 ctx（与 buildChildren 的行为一致）
      //         nodeOf(() =>
      //           scrollContent({
      //             scroll,
      //             exts: [grow({ argGrow: 1 })], // 横向撑满容器剩余空间
      //             // alignFix 锁定 cross 为自身 inner（避免与子项宽度循环推导）；
      //             // stretch 让条目横向撑满内容区
      //             layout: flex({
      //               alignFix: true,
      //               alignItem: 'stretch',
      //               gap: 6,
      //             }),
      //             children: Array.from({ length: 24 }, (_, i) =>
      //               nodeOf(() =>
      //                 rectNode({
      //                   height: () => 34,
      //                   background: () => (i % 2 ? 0xffffffff : 0xffeef2ff),
      //                   radius: () => 4,
      //                   paddingInline: () => 8,
      //                   layout: flex({ direction: 'x' }),
      //                   children: [
      //                     nodeOf(() =>
      //                       wrappedTextNode({
      //                         text: () => `第 ${i + 1} 项（滚轮/拖滑块可滚动）`,
      //                         fontFamily: () => 'Noto Sans SC',
      //                         fontSize: () => 13,
      //                         color: () => 0xff334155,
      //                         exts: [grow({ argGrow: 1 })], // 横向撑满条目
      //                       })
      //                     ),
      //                   ],
      //                 })
      //               )
      //             ),
      //           })
      //         )(ctx);
      //         nodeOf(() => scrollBar({ scroll }))(ctx);
      //       },
      //     ],
      //   })
      // ),
    ],
  });

  // 跨组件选择：松手时把 SelectionManager 拼接出的选区文本抛给上层
  if (onSelectionChange) {
    canvas.addEventListener('mouseup', () => {
      onSelectionChange(selectionManager.selectedText ?? '');
    });
  }
}
