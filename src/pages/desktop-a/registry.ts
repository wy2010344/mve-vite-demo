import { PopWithRearrange } from 'mve-helper';
import { createSignal } from 'wy-helper';
import { createWindow } from 'daisy-mobile-helper';

export const APPS = [
  {
    id: 'notepad',
    title: 'Notepad',
    icon: '📝',
    async load() {
      const panel = await import('./apps/Notepad');
      return createWindow(panel.Notepad.panel);
    },
    defaultWidth: 600,
    defaultHeight: 400,
  },
  {
    id: 'browser',
    title: 'Browser',
    icon: '🌐',
    async load() {
      const panel = await import('./apps/Browser');
      return createWindow(panel.browser.panel);
    },
    defaultWidth: 800,
    defaultHeight: 600,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    async load() {
      const panel = await import('./apps/Settings');
      return createWindow(panel.Settings.panel);
    },
    defaultWidth: 500,
    defaultHeight: 400,
  },
  {
    id: 'files',
    title: 'Files',
    icon: '📁',
    async load() {
      const panel = await import('./apps/Notepad');
      return createWindow(panel.Notepad.panel);
    },
    defaultWidth: 700,
    defaultHeight: 500,
  }, // Reuse notepad for now
  {
    id: 'music',
    title: 'Music',
    icon: '🎵',
    async load() {
      const panel = await import('./apps/Notepad');
      return createWindow(panel.Notepad.panel);
    },
    defaultWidth: 400,
    defaultHeight: 600,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '💻',
    async load() {
      const panel = await import('./apps/Notepad');
      return createWindow(panel.Notepad.panel);
    },
    defaultWidth: 600,
    defaultHeight: 400,
  },
].map(Loader);

function Loader<T extends object>(
  arg: T & {
    load(): Promise<PopWithRearrange<any>>;
  }
) {
  return function (
    callback: (
      arg: {
        onClick(): void;
        opened(): boolean;
      } & T
    ) => void
  ) {
    const ns = createSignal<PopWithRearrange | undefined>(undefined);
    callback({
      ...arg,
      onClick() {
        arg.load().then(ns.set);
      },
      opened() {
        const i = ns.get();
        if (i) {
          return i.getIndex() < 0 ? false : true;
        }
        return false;
      },
    });
  };
}
