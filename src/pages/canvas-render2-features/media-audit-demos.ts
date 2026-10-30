import {
  CursorType2,
  Fc,
  Node2,
  auditLayoutReport,
  createImageLoader,
  flex,
  ifNode,
  imageNode,
  layoutSizeDirection,
  postDelayed,
  rectNode,
  richTextNode,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import type { PlatformImage } from 'mve-dom-helper/canvasRender2';
import type { StateHolder } from 'mve-core';
import { createSignal } from 'wy-helper';
import { palette } from '../canvas-render2/todo-store';
import { CARD_W, button, card, hint, row } from './ui';

/**
 * 三块"引擎外围"能力：
 * - ImageLoader：取字节 → 解码 → 回调 + 去重缓存（宿主注入 fetcher）；
 * - postDelayed：与重绘无关的延时调度（Toast 自动关闭同一条路）；
 * - LayoutAudit：在**已建好的树**上探测布局依赖并判环（只读）。
 */

// ---------- ImageLoader + postDelayed ----------

const IMAGE_URL = 'demo://gradient';

/** fetcher 调用次数（同 URL 并发 / 重复请求应当只取一次字节） */
const fetchCount = createSignal(0);
/** 解码后的图片（null = 还没加载好） */
const remoteImage = createSignal<PlatformImage | null>(null);

/** 造一张渐变 PNG 的字节流，模拟"从网络拿到的字节" */
function makePngBytes(): Promise<ArrayBuffer | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 110;
  const g = canvas.getContext('2d');
  if (!g) return Promise.resolve(null);
  const grad = g.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#22d3ee');
  grad.addColorStop(0.55, '#818cf8');
  grad.addColorStop(1, '#f472b6');
  g.fillStyle = grad;
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.fillStyle = 'rgba(255,255,255,0.9)';
  g.font = 'bold 18px sans-serif';
  g.fillText('remote', 14, 60);
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      if (!blob) {
        resolve(null);
        return;
      }
      blob.arrayBuffer().then(
        bytes => resolve(bytes),
        () => resolve(null)
      );
    }, 'image/png');
  });
}

/**
 * 加载器：取字节实现由宿主注入。
 * 这里用 postDelayed 模拟 700ms 网络延迟——**不能用"下一帧回调"代替**：
 * 没有后续重绘时也必须按时触发。
 */
const imageLoader = createImageLoader((_url, onBytes) => {
  fetchCount.set(fetchCount.get() + 1);
  postDelayed(700, () => {
    makePngBytes().then(
      bytes => onBytes(bytes),
      () => onBytes(null)
    );
  });
});

/** 发起一次加载（同一 URL 的并发 / 重复请求由 loader 去重） */
function loadRemote(): void {
  imageLoader.load(IMAGE_URL, image => {
    if (image) remoteImage.set(image);
  });
}

export function imageLoaderDemo(): Fc {
  // 建树时连续发两次：第二次命中 inflight → 排队复用第一次的字节
  loadRemote();
  loadRemote();
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    return card('异步图片（ImageLoader + postDelayed）', [
      hint(
        () =>
          '建树时连续请求两次同一 URL：loader 只取一次字节，两个回调共享结果。'
      ),
      ifNode(
        () => remoteImage.get() != null,
        function (this: StateHolder<Node2, readonly Node2[]>) {
          imageNode({
            image: () => remoteImage.get(),
            radius: () => 8,
            padding: () => 0,
            imageSize: () => layoutSizeDirection('x', 180, false),
          })(this);
        },
        function (this: StateHolder<Node2, readonly Node2[]>) {
          rectNode({
            width: () => 180,
            height: () => 110,
            radius: () => 8,
            background: () => palette().cardDone,
            borderColor: () => palette().border,
            borderWidth: () => 1,
            layout: flex({
              direction: 'x',
              alignItem: 'center',
              directionJustify: 'center',
            }),
            children: [
              wrappedTextNode({
                autoWidth: () => true,
                text: () => '加载中…（postDelayed 700ms）',
                fontFamily: () => 'Noto Sans SC',
                fontSize: () => 12,
                color: () => textDefaults.placeholder(),
              }),
            ],
          })(this);
        }
      ),
      row([
        button({
          label: () => '再请求一次（命中缓存）',
          onClick() {
            loadRemote();
          },
        }),
        button({
          label: () => '清缓存后重载',
          onClick() {
            imageLoader.clearCache();
            remoteImage.set(null);
            loadRemote();
          },
        }),
      ]),
      hint(
        () =>
          `fetcher 调用 ${fetchCount.get()} 次 · ${
            remoteImage.get() ? '已解码并缓存' : '加载中'
          }`
      ),
    ])(ctx);
  };
}

// ---------- LayoutAudit ----------

/** 审计根节点（由 view 在建树后回填） */
let auditRoot: Node2 | null = null;

export function setAuditRoot(node: Node2): void {
  auditRoot = node;
}

const auditLines = createSignal<readonly string[]>([]);
const auditStats = createSignal('尚未审计');

/** 数一下树里有多少节点（顺带证明遍历是纯读） */
function countNodes(root: Node2): number {
  let n = 0;
  (function walk(node: Node2) {
    n++;
    for (const child of node.children()) walk(child);
  })(root);
  return n;
}

export function layoutAuditDemo(): Fc {
  return card('布局依赖审计（LayoutAudit）', [
    hint(
      () =>
        '节点是 children 里的闭包，编译期没有树，只能在已建好的树上探针测量 + 判环。'
    ),
    row([
      button({
        label: () => '审计当前树',
        primary: true,
        onClick() {
          if (!auditRoot) return;
          const findings = auditLayoutReport(auditRoot);
          auditLines.set(findings);
          auditStats.set(
            `已审计 ${countNodes(auditRoot)} 个节点，成环 ${findings.length} 处`
          );
        },
      }),
    ]),
    hint(() => auditStats.get()),
    wrappedTextNode({
      width: () => CARD_W - 20,
      text: () =>
        auditLines.get().length === 0
          ? '（没有依赖环：布局测量不会自我递归）'
          : auditLines.get()[0],
      fontFamily: () => 'Noto Sans SC',
      fontSize: () => 11,
      color: () => textDefaults.placeholder(),
    }),
  ]);
}

// ---------- 指针语义：双击 / 右键 / 光标 ----------

const clicks = createSignal(0);
const doubleClicks = createSignal(0);

/** 一个小的"悬停光标"示意块 */
function cursorSwatch(text: string, cursor: CursorType2): Fc {
  return rectNode({
    width: () => 96,
    height: () => 40,
    radius: () => 6,
    background: () => palette().cardDone,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    // cursor 是"读取式"消息：每次移动都重新求值，改信号立即生效
    cursor: () => cursor,
    layout: flex({
      direction: 'x',
      alignItem: 'center',
      directionJustify: 'center',
    }),
    children: [
      richTextNode({
        autoWidth: () => true,
        spans: () => [
          {
            text,
            style: {
              fontFamily: 'Noto Sans SC',
              fontSize: 12,
              color: textDefaults.text(),
            },
          },
        ],
      }),
    ],
  });
}

export function pointerDemo(): Fc {
  return card('指针语义（双击 / 光标派生）', [
    hint(
      () =>
        '双击不吞单击（先 click 再 dblclick）；光标由节点消息派生，编辑器命中自动变 text。'
    ),
    rectNode({
      width: () => CARD_W - 20,
      height: () => 56,
      radius: () => 8,
      background: () => palette().cardDone,
      borderColor: () => palette().border,
      borderWidth: () => 1,
      mouseClick() {
        clicks.set(clicks.get() + 1);
      },
      mouseDoubleClick() {
        doubleClicks.set(doubleClicks.get() + 1);
      },
      layout: flex({
        direction: 'x',
        alignItem: 'center',
        directionJustify: 'center',
      }),
      children: [
        richTextNode({
          autoWidth: () => true,
          spans: () => [
            {
              text: `点我：单击 ${clicks.get()} 次 · 双击 ${doubleClicks.get()} 次`,
              style: {
                fontFamily: 'Noto Sans SC',
                fontSize: 13,
                color: textDefaults.text(),
              },
            },
          ],
        }),
      ],
    }),
    row([
      cursorSwatch('cursor: pointer', CursorType2.POINTER),
      cursorSwatch('cursor: text', CursorType2.TEXT),
      cursorSwatch('cursor: default', CursorType2.DEFAULT),
    ]),
  ]);
}
