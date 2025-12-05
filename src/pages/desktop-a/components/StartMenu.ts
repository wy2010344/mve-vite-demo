import { fdom } from 'mve-dom';
import { APPS } from '../registry';
import { uiStore } from '../store/uiStore';
import styles from '../desktop.module.css';

export function StartMenu() {
  fdom.div({
    className: `${styles.glassDark} ${styles.startMenu} absolute bottom-12 left-2 w-80 h-[500px] rounded-xl flex flex-col overflow-hidden z-[9999]`,
    s_display() {
      return uiStore.isStartMenuOpen.get() ? 'flex' : 'none';
    },
    onClick(e) {
      e.stopPropagation();
    },
    children() {
      // Search Bar
      fdom.div({
        className: 'p-4',
        children() {
          fdom.input({
            className:
              'w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:bg-white/20 transition-colors',
            placeholder: 'Search apps...',
          });
        },
      });

      // Pinned Apps Grid
      fdom.div({
        className: 'flex-1 overflow-y-auto p-4',
        children() {
          fdom.div({
            className: 'text-xs font-medium text-white/50 mb-3 px-2',
            children: 'Pinned',
          });

          fdom.div({
            className: 'grid grid-cols-4 gap-4',
            children() {
              APPS.forEach(app => {
                app(function (arg) {
                  fdom.div({
                    className:
                      'flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group',
                    onClick() {
                      arg.onClick();
                      uiStore.closeStartMenu();
                    },
                    children() {
                      fdom.div({
                        className:
                          'w-10 h-10 flex items-center justify-center text-2xl bg-white/10 rounded-lg group-hover:scale-110 transition-transform',
                        children: arg.icon,
                      });
                      fdom.span({
                        className:
                          'text-xs text-white/90 text-center truncate w-full',
                        children: arg.title,
                      });
                    },
                  });
                });
              });
            },
          });
        },
      });

      // User Profile / Bottom Bar
      fdom.div({
        className:
          'p-4 bg-black/20 flex items-center justify-between border-t border-white/10',
        children() {
          fdom.div({
            className: 'flex items-center gap-3',
            children() {
              fdom.div({
                className:
                  'w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500',
              });
              fdom.span({
                className: 'text-sm font-medium text-white',
                children: 'User',
              });
            },
          });

          fdom.button({
            className:
              'p-2 hover:bg-white/10 rounded-lg transition-colors text-white',
            children: '⏻', // Power icon
          });
        },
      });
    },
  });
}
