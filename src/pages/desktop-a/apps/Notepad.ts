import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../components/Window';

export const Notepad = panel(info => {
  return {
    title: 'Notepad',
    icon: '📝',
    width: 600,
    height: 400,
    children() {
      const content = createSignal('');

      fdom.div({
        className: 'w-full h-full flex flex-col bg-white',
        children() {
          fdom.textarea({
            className:
              'w-full h-full p-4 resize-none outline-none font-mono text-sm text-gray-900',
            value: content.get,
            onInput(e) {
              content.set((e.target as HTMLTextAreaElement).value);
            },
          });
        },
      });
    },
  };
});
