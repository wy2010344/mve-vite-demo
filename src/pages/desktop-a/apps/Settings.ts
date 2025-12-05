import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { panel } from '../components/Window';

export const Settings = panel(() => {
  return {
    title: 'Settings',
    icon: '⚙️',
    width: 500,
    height: 400,
    children() {
      const theme = createSignal('light');

      fdom.div({
        className: 'w-full h-full p-6 bg-gray-50 text-gray-900',
        children() {
          fdom.h1({
            className: 'text-2xl font-bold mb-6',
            children: 'Settings',
          });

          fdom.div({
            className:
              'bg-white p-4 rounded-lg shadow-sm border border-gray-200',
            children() {
              fdom.h2({
                className: 'text-lg font-medium mb-4',
                children: 'Appearance',
              });

              fdom.div({
                className: 'flex items-center gap-4',
                children() {
                  fdom.label({
                    className: 'flex items-center gap-2',

                    children() {
                      fdom.input({
                        type: 'radio',
                        name: 'theme',
                        checked: () => theme.get() === 'light',
                        onInput: () => theme.set('light'),
                      });
                      fdom.span({ children: 'Light Mode' });
                    },
                  });

                  fdom.label({
                    className: 'flex items-center gap-2',
                    children() {
                      fdom.input({
                        type: 'radio',
                        name: 'theme',
                        checked: () => theme.get() === 'dark',
                        onInput: () => theme.set('dark'),
                      });
                      fdom.span({ children: 'Dark Mode' });
                    },
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
