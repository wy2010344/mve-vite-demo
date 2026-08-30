import { createSignal, emptyArray, superCall } from 'wy-helper';
import {
  CursorType,
  KeyCode,
  LayoutNode,
  PlatformImage,
  Renderer,
  Scroll,
  SimpleScrollBar,
  drawRect,
  flex,
  getActiveEditor,
  grow,
  layoutSizeDirection,
  loadCanvasKit,
  registerFont,
  registerScroll,
  renderCanvas,
  renderEditableText,
  renderImage,
  renderRect,
  renderScrollContent,
  renderWrappedText,
  strokeInnerRect,
} from 'mve-dom-helper/canvasRender';
import { fdom } from 'mve-dom';
import { renderArray } from 'mve-helper';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

await loadCanvasKit(
  '/canvas-kit/canvaskit.js'
  // 'https://unpkg.com/canvaskit-wasm@0.41.1/bin/canvaskit.js'
);
await loadDemoFont();

export default function () {
  const canvasEl = fdom.canvas({
    width: 600,
    height: 800,
  });
  const render = renderCanvas(canvasEl, {
    layout: flex({
      directionJustify: 'center',
      gap: 10,
      alignFix: true,
    }),
    children() {
      const list = createSignal<readonly number[]>(emptyArray);

      renderRect({
        width: 300,
        height: 400,
        layout: flex({
          direction: 'x',
          alignFix: true,
          alignItem: 'stretch',
          directionJustify: 'start',
        }),
        draw(ctx) {
          ctx.fillStyle = '#f1f5f9';
          drawRect.call(this, ctx);
          superCall(this, 'draw', ctx);
        },
        children() {
          const container = this.node as LayoutNode;
          const scroll = new Scroll(container, 'y');
          registerScroll(scroll);

          renderScrollContent({
            exts: [grow({ argGrow: 1 })],
            y: () => -scroll.value(),
            layout: flex({
              alignFix: true,
              alignItem: 'stretch',
              gap: 10,
            }),
            children() {
              renderArray(list.get, function (value) {
                renderRect({
                  height: 50,
                  draw(ctx) {
                    ctx.fillStyle = 'blue';
                    ctx.fillText(this.index() + 'xx', 0, 0);
                    strokeInnerRect.call(this, ctx);
                  },
                  mouseClick() {
                    list.set(list.get().filter(x => x != value));
                  },
                });
              });
            },
          });

          class DemoScrollBar extends SimpleScrollBar {
            scroll() {
              return scroll;
            }
          }
          new DemoScrollBar(this, 'y');
        },
      });

      renderRect({
        width: 100,
        height: 50,
        draw(ctx) {
          ctx.fillStyle = 'red';
          drawRect.call(this, ctx);
        },
        mouseClick() {
          list.set(list.get().concat(Date.now()));
        },
      });

      renderRect({
        width: 300,
        paddingInline: 10,
        paddingBlock: 8,
        layout: flex({
          direction: 'y',
          alignFix: true,
          alignItem: 'stretch',
        }),
        draw(ctx) {
          ctx.fillStyle = '#ffffff';
          drawRect.call(this, ctx);
          ctx.strokeStyle = '#cbd5e1';
          ctx.strokeRect(
            0.5,
            0.5,
            this.outerWidth() - 1,
            this.outerHeight() - 1
          );
          superCall(this, 'draw', ctx);
        },
        children() {
          const t = createSignal(
            '点击编辑：键盘输入 / Ctrl+Z 撤销 / Ctrl+A 全选 / 支持中文输入法'
          );
          renderEditableText({
            text: t.get,
            setText: t.set,
            fontFamily: 'Noto Sans SC',
            fontSize: 15,
          });
          renderWrappedText({
            text: t.get,
          });
        },
      });

      const img = createSignal<PlatformImage | null>(null);
      makeDemoImage().then(v => img.set(v));
      renderRect({
        width: 300,
        padding: 8,
        layout: flex({
          direction: 'y',
          alignFix: true,
          alignItem: 'center',
        }),
        draw(ctx) {
          ctx.fillStyle = '#ffffff';
          drawRect.call(this, ctx);
          ctx.strokeStyle = '#cbd5e1';
          ctx.strokeRect(
            0.5,
            0.5,
            this.outerWidth() - 1,
            this.outerHeight() - 1
          );
          superCall(this, 'draw', ctx);
        },
        children() {
          renderImage({
            image: img.get,
            imageSize: layoutSizeDirection('x', 200, true),
            radius: 12,
          });
        },
      });
    },
  });

  setupInput(render, canvasEl);
}

function setupInput(render: Renderer, canvas: HTMLCanvasElement) {
  const textarea = document.createElement('textarea');
  textarea.style.cssText = [
    'position:fixed',
    'z-index:9999',
    'opacity:0',
    'pointer-events:none',
    'resize:none',
    'border:none',
    'outline:none',
    'background:transparent',
    'overflow:hidden',
    'white-space:pre',
    'font-family:sans-serif',
  ].join(';');
  document.body.appendChild(textarea);

  render.setInputOverlayHandler(
    (x, y, w, h, fontSize) => {
      const rect = canvas.getBoundingClientRect();
      textarea.style.display = 'block';
      textarea.style.left = `${rect.left + x}px`;
      textarea.style.top = `${rect.top + y}px`;
      textarea.style.width = `${Math.max(1, w)}px`;
      textarea.style.height = `${Math.max(1, h)}px`;
      textarea.style.fontSize = `${fontSize}px`;
      textarea.focus();
    },
    () => {
      textarea.style.display = 'none';
    }
  );

  render.setCursorHandler(type => {
    canvas.style.cursor = type as CursorType;
  });

  let composing = false;
  textarea.addEventListener('compositionstart', () => {
    composing = true;
    textarea.value = '';
  });
  textarea.addEventListener('compositionupdate', () => {
    render.composingText(textarea.value, textarea.selectionStart);
  });
  textarea.addEventListener('compositionend', () => {
    composing = false;
    const ed = getActiveEditor();
    if (ed) {
      ed.commitComposingText(textarea.value);
    }
    textarea.value = '';
  });
  textarea.addEventListener('input', () => {
    if (!composing) {
      textarea.value = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (composing) return;
    const code = keyCodeOf(e);
    render.keyPress(e.key, code, e.ctrlKey, e.shiftKey, e.altKey, e.metaKey);
    if (e.code == 'Tab') {
      e.preventDefault();
    }
  });
}

function keyCodeOf(e: KeyboardEvent): KeyCode {
  switch (e.code) {
    case 'Backspace':
      return KeyCode.Backspace;
    case 'Delete':
      return KeyCode.Delete;
    case 'ArrowLeft':
      return KeyCode.Left;
    case 'ArrowRight':
      return KeyCode.Right;
    case 'ArrowUp':
      return KeyCode.Up;
    case 'ArrowDown':
      return KeyCode.Down;
    case 'PageUp':
      return KeyCode.PageUp;
    case 'PageDown':
      return KeyCode.PageDown;
    case 'Home':
      return KeyCode.Home;
    case 'End':
      return KeyCode.End;
    case 'Enter':
      return KeyCode.Enter;
    case 'Tab':
      return KeyCode.Tab;
    case 'Escape':
      return KeyCode.Escape;
    default:
      return KeyCode.Unknown;
  }
}

function makeDemoImage(): Promise<PlatformImage | null> {
  const c = document.createElement('canvas');
  c.width = 240;
  c.height = 160;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 240, 160);
  grad.addColorStop(0, '#f97316');
  grad.addColorStop(1, '#6366f1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 240, 160);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ImageNode', 120, 80);
  return Promise.resolve({ width: 240, height: 160, source: c });
}

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
