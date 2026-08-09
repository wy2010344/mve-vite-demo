import { createSignal } from 'wy-helper';
import { fdom } from 'mve-dom';
import {
  CursorType,
  KeyCode,
  Renderer,
  flex,
  getActiveEditor,
  loadCanvasKit,
  registerFont,
  renderCanvas,
  renderEditableText,
  renderRect,
} from 'mve-dom-helper/canvasRender';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

await loadCanvasKit('/canvas-kit/canvaskit.js');
await loadDemoFont();

export default function () {
  const text = createSignal(`TS
类型.  
:(context: SubmitContext<FormData>) => void
表单提交时触发。其中 context.validateResult 表示校验结果，context.firstError 表示校验不通过的第一个规则提醒。context.validateResult 值为 true 表示校验通过；如果校验不通过，context.validateResult 值为校验结果列表。`);
  const canvasEl = fdom.canvas({
    className: 'touch-none',
    width: 600,
    height: 400,
  });
  const render = renderCanvas(canvasEl, {
    children() {
      renderRect({
        width: 600,
        height: 400,
        padding: 20,
        layout: flex({
          direction: 'y',
          alignFix: true,
          alignItem: 'stretch',
        }),
        draw(ctx) {
          ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
          ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            0.5,
            0.5,
            this.outerWidth() - 1,
            this.outerHeight() - 1
          );
        },
        children() {
          renderEditableText({
            text: text.get,
            setText: text.set,
            fontFamily: 'Noto Sans SC',
            fontSize: 16,
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
