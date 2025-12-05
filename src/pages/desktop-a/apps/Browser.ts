import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../components/Window';

export const browser = panel(info => {
  return {
    title: 'Browser',
    icon: '🌐',
    width: 800,
    height: 600,
    children() {
      const url = createSignal('https://www.google.com');
      const iframeUrl = createSignal('https://www.google.com/webhp?igu=1'); // igu=1 allows some embedding

      fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-100',
        children() {
          // Toolbar
          fdom.div({
            className:
              'h-10 bg-gray-200 flex items-center px-2 gap-2 border-b border-gray-300',
            children() {
              fdom.input({
                className:
                  'flex-1 px-3 py-1 rounded-full border border-gray-300 text-sm outline-none focus:border-blue-500 text-gray-900',
                value: url.get,
                onKeyDown(e) {
                  if (e.key === 'Enter') {
                    iframeUrl.set(url.get());
                  }
                },
                onInput(e) {
                  url.set((e.target as HTMLInputElement).value);
                },
              });
              fdom.button({
                className:
                  'px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600',
                onClick() {
                  iframeUrl.set(url.get());
                },
                children: 'Go',
              });
            },
          });

          // Content
          fdom.iframe({
            className: 'flex-1 w-full border-none bg-white',
            src: iframeUrl.get,
          });
        },
      });
    },
  };
});
