import { fdom, fsvg, renderText } from 'mve-dom';
import themes from 'daisyui/functions/themeOrder';
import { createSignal } from 'wy-helper';
import { faker } from '@faker-js/faker';
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

export const themeSignal = createSignal(isDarkMode.matches ? 'dark' : 'light');
isDarkMode.addEventListener('change', e => {
  themeSignal.set(e.matches ? 'dark' : 'light');
});

export function randomTheme() {
  return themes[
    faker.number.int({
      max: themes.length - 1,
    })
  ];
}

export default function () {
  fdom.div({
    className: 'daisy-dropdown',
    children() {
      fdom.div({
        className: 'daisy-dropdown daisy-dropdown-end ',
        children() {
          fdom.div({
            tabIndex: 0,
            role: 'button',
            className: 'daisy-btn m-1',
            children() {
              renderText`Theme`;
              fsvg.svg({
                width: '12px',
                height: '12px',
                className: 'inline-block h-2 w-2 fill-current opacity-60',
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 2048 2048',
                children() {
                  fsvg.path({
                    d: 'M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z',
                  });
                },
              });
            },
          });
          fdom.ul({
            tabIndex: 0,
            className:
              'daisy-dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl',
            children() {
              for (const theme of themes) {
                fdom.li({
                  className: 'relative flex items-center',
                  onClick() {
                    themeSignal.set(theme);
                  },
                  children() {
                    fdom.div({
                      data_theme: theme,
                      className:
                        'grid grid-cols-2 gap-0.5 p-1 rounded-md shadow-sm shrink-0 bg-base-100 absolute right-0 z-10',
                      children() {
                        fdom.div({
                          className: 'size-1 rounded-full bg-base-content',
                        });
                        fdom.div({
                          className: 'size-1 rounded-full bg-primary',
                        });
                        fdom.div({
                          className: 'size-1 rounded-full bg-secondary',
                        });
                        fdom.div({
                          className: 'size-1 rounded-full bg-accent',
                        });
                      },
                    });
                    fdom.input({
                      type: 'radio',
                      name: 'theme-dropdown',
                      className:
                        'theme-controller daisy-btn daisy-btn-sm daisy-btn-block daisy-btn-ghost justify-start',
                      aria_label: theme,
                      value: theme,
                    });
                  },
                });
              }
            },
          });
        },
      });
    },
  });
}
