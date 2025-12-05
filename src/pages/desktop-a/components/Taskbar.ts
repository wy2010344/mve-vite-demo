import { fdom } from 'mve-dom';
import { renderForEach } from 'mve-core';
import { uiStore } from '../store/uiStore';
import styles from '../desktop.module.css';
import { StartMenu } from './StartMenu';

export function Taskbar() {
  fdom.div({
    className: `${styles.glassDark} absolute bottom-0 left-0 right-0 h-12 flex items-center px-2 z-[10000] select-none`,
    onClick(e) {
      e.stopPropagation();
    },
    children() {
      // Start Button
      fdom.button({
        className:
          'w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors mr-2',
        onClick() {
          uiStore.toggleStartMenu();
        },
        children() {
          fdom.span({ className: 'text-xl', children: '🪟' });
        },
      });

      // Running Apps
      fdom.div({
        className: 'flex-1 flex items-center gap-1 h-full px-2 overflow-x-auto',
        children() {
          // Using renderForEach to render the list of windows
          // renderForEach takes a signal of Map/Set/Array-like?
          // The docs say: renderForEach<Key, Value>(source, (key, et) => ...)
          // If source is Array, key is index? No, renderForEach usually expects a Map or Set or something iterable where we can track keys.
          // But `renderArray` is the wrapper for arrays.
          // If `renderArray` is missing, I can use `renderForEach` with a Map if I convert it, or just use `renderArray` from `mve-core` if I was wrong about it being missing.
          // But the error was specific.
          // Let's try `renderArray` from `mve-dom-helper`?
          // I'll try to import `renderArray` from `mve-dom-helper` this time.
          // If that fails, I'll use a simple re-render effect.
          // Actually, I'll use `renderArray` from `mve-core` but maybe I need to cast it or ignore error if I am sure.
          // But I am not sure.
          // Let's use `renderForEach` on a Map.
          // I'll convert windows array to a Map for rendering.
          /*
                    const windowsMap = computed(() => new Map(windowStore.windows.get().map(w => [w.id, w])));
                    renderForEach(windowsMap, (id, et) => {
                       const win = et.getValue(); // This is a signal? No, getValue() returns the value.
                       // et has getIndex(), getValue()
                       // ...
                    });
                    */
          // Wait, `renderForEach` signature in doc:
          // renderForEach<number, string>(callback => { const m = map.get(); m.forEach(...) }, ...)
          // It takes a function that iterates!
          //   renderForEach(
          //     callback => {
          //       windowStore.windows.get().forEach((win, index) => {
          //         callback(win.id, win);
          //       });
          //     },
          //     (id, et) => {
          //       // et.getValue() returns the window object (not reactive itself unless it's a signal, but here it's the object from array)
          //       // But the window object has signals inside it (x, y, etc).
          //       const win = et.getValue();
          //       fdom.div({
          //         className: () => {
          //           const isActive = windowStore.activeWindowId.get() === win.id;
          //           return `h-10 px-3 flex items-center gap-2 rounded hover:bg-white/10 cursor-pointer transition-all min-w-[120px] max-w-[200px] ${
          //             isActive ? styles.taskbarItemActive : styles.taskbarItem
          //           }`;
          //         },
          //         onClick() {
          //           if (windowStore.activeWindowId.get() === win.id) {
          //             if (win.isMinimized.get()) {
          //               windowStore.focusWindow(win.id);
          //             } else {
          //               windowStore.minimizeWindow(win.id);
          //             }
          //           } else {
          //             windowStore.focusWindow(win.id);
          //           }
          //         },
          //         children() {
          //           fdom.span({ className: 'text-lg', children: win.icon });
          //           fdom.span({
          //             className: 'text-sm text-white truncate flex-1',
          //             children: () => win.title,
          //           });
          //         },
          //       });
          //     }
          //   );
        },
      });

      // System Tray
      fdom.div({
        className: 'flex items-center gap-2 px-2',
        children() {
          // Time
          fdom.div({
            className:
              'text-xs text-white flex flex-col items-end px-2 py-1 hover:bg-white/10 rounded cursor-default',
            children() {
              const time = new Date();
              fdom.span({
                children: time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              });
              fdom.span({ children: time.toLocaleDateString() });
            },
          });
        },
      });

      StartMenu();
    },
  });
}
