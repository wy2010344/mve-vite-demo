import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../WindowManager';

export const TerminalApp = panel(function (info) {
  return {
    title: 'Terminal',

    children() {
      const lines = createSignal<string[]>([
        '$ Welcome to Terminal',
        '$ Type "help" for available commands',
        '',
      ]);
      const input = createSignal('');

      function executeCommand(cmd: string) {
        const newLines = [...lines.get(), `$ ${cmd}`];

        if (cmd === 'help') {
          newLines.push('Available commands: help, clear, date, echo [text]');
        } else if (cmd === 'clear') {
          lines.set(['']);
          return;
        } else if (cmd === 'date') {
          newLines.push(new Date().toString());
        } else if (cmd.startsWith('echo ')) {
          newLines.push(cmd.substring(5));
        } else if (cmd) {
          newLines.push(`Command not found: ${cmd}`);
        }

        newLines.push('');
        lines.set(newLines);
        input.set('');
      }

      fdom.div({
        className:
          'w-full h-full bg-gray-900 text-green-400 font-mono text-sm p-4 overflow-auto',
        children() {
          fdom.div({
            className: 'space-y-1',
            children() {
              fdom.div({
                children() {
                  lines.get().forEach(line => {
                    fdom.div({
                      childrenType: 'text',
                      children: line || '\u00A0',
                    });
                  });
                },
              });

              // 输入行
              fdom.div({
                className: 'flex gap-2',
                children() {
                  fdom.span({
                    childrenType: 'text',
                    children: '$',
                  });
                  fdom.input({
                    type: 'text',
                    className: 'flex-1 bg-transparent outline-none',
                    value() {
                      return input.get();
                    },
                    onInput(e) {
                      input.set((e.target as HTMLInputElement).value);
                    },
                    onKeyDown(e) {
                      if (e.key === 'Enter') {
                        executeCommand(input.get());
                      }
                    },
                    autoFocus: true,
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
