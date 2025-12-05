import { fdom } from 'mve-dom';
import { createSignal, tween, easeFns } from 'wy-helper';
import { animateSignal } from 'wy-dom-helper';
import { panel } from '../WindowManager';

const SAMPLE_CODE = `// 欢迎使用代码编辑器
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci(10) =', result);

// 尝试编辑代码并运行！`;

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go'];

export const CodeEditorApp = panel(function (info) {
  return {
    title: '代码编辑器',
    icon: '💻',
    children() {
      const code = createSignal(SAMPLE_CODE);
      const output = createSignal<string[]>([]);
      const language = createSignal('JavaScript');
      const fontSize = animateSignal(14);
      const lineNumbers = createSignal(true);

      function runCode() {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.join(' ')),
          };

          // 创建沙箱环境
          const func = new Function('console', code.get());
          func(customConsole);

          output.set([...output.get(), `> 执行成功`, ...logs]);
        } catch (error: any) {
          output.set([...output.get(), `> 错误: ${error.message}`]);
        }
      }

      function clearOutput() {
        output.set([]);
      }

      return fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-900 text-white',
        children() {
          // 工具栏
          fdom.div({
            className:
              'h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-4',
            children() {
              // 语言选择
              fdom.select({
                className: 'px-3 py-1 bg-gray-700 rounded text-sm',
                value() {
                  return language.get();
                },
                onInput(e: any) {
                  language.set((e.target as HTMLSelectElement).value);
                },
                children() {
                  LANGUAGES.forEach(lang => {
                    fdom.option({
                      value: lang,
                      childrenType: 'text',
                      children: lang,
                    });
                  });
                },
              });

              // 字体大小控制
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.button({
                    className:
                      'px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs',
                    childrenType: 'text',
                    children: 'A-',
                    onClick() {
                      fontSize.animateTo(
                        Math.max(10, fontSize.get() - 2),
                        tween(200, easeFns.out(easeFns.quad))
                      );
                    },
                  });
                  fdom.span({
                    className: 'text-xs text-gray-400',
                    childrenType: 'text',
                    children() {
                      return `${Math.round(fontSize.get())}px`;
                    },
                  });
                  fdom.button({
                    className:
                      'px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs',
                    childrenType: 'text',
                    children: 'A+',
                    onClick() {
                      fontSize.animateTo(
                        Math.min(24, fontSize.get() + 2),
                        tween(200, easeFns.out(easeFns.quad))
                      );
                    },
                  });
                },
              });

              // 行号切换
              fdom.label({
                className: 'flex items-center gap-2 text-sm cursor-pointer',
                children() {
                  fdom.input({
                    type: 'checkbox',
                    checked() {
                      return lineNumbers.get();
                    },
                    onInput(e: any) {
                      lineNumbers.set((e.target as HTMLInputElement).checked);
                    },
                  });
                  fdom.span({
                    childrenType: 'text',
                    children: '行号',
                  });
                },
              });

              fdom.div({ className: 'flex-1' });

              // 运行按钮
              fdom.button({
                className:
                  'px-4 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium',
                childrenType: 'text',
                children: '▶ 运行',
                onClick: runCode,
              });

              fdom.button({
                className:
                  'px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm',
                childrenType: 'text',
                children: '清空输出',
                onClick: clearOutput,
              });
            },
          });

          // 编辑器和输出区域
          fdom.div({
            className: 'flex-1 flex overflow-hidden',
            children() {
              // 代码编辑区
              fdom.div({
                className: 'flex-1 flex border-r border-gray-700',
                children() {
                  // 行号
                  fdom.div({
                    s_display() {
                      return lineNumbers.get() ? 'block' : 'none';
                    },
                    className:
                      'w-12 bg-gray-800 text-gray-500 text-right py-4 pr-2 select-none overflow-hidden',
                    s_fontSize() {
                      return `${fontSize.get()}px`;
                    },
                    children() {
                      const lines = code.get().split('\n');
                      lines.forEach((_, i) => {
                        fdom.div({
                          className: 'leading-6',
                          childrenType: 'text',
                          children: `${i + 1}`,
                        });
                      });
                    },
                  });

                  // 代码区
                  fdom.textarea({
                    className:
                      'flex-1 bg-gray-900 text-green-400 p-4 font-mono resize-none outline-none',
                    s_fontSize() {
                      return `${fontSize.get()}px`;
                    },
                    value() {
                      return code.get();
                    },
                    onInput(e) {
                      code.set((e.target as HTMLTextAreaElement).value);
                    },
                    spellcheck: false,
                  });
                },
              });

              // 输出区
              fdom.div({
                className:
                  'w-80 bg-black text-gray-300 p-4 overflow-auto font-mono text-sm',
                children() {
                  fdom.div({
                    className: 'text-gray-500 mb-2 text-xs',
                    childrenType: 'text',
                    children: '控制台输出:',
                  });
                  output.get().forEach(line => {
                    fdom.div({
                      className: line.startsWith('> 错误')
                        ? 'text-red-400'
                        : 'text-gray-300',
                      childrenType: 'text',
                      children: line,
                    });
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
