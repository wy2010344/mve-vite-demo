import { dom, fdom } from 'mve-dom';
import { animateSignal } from 'wy-dom-helper';
import {
  batchSignalEnd,
  createSignal,
  getInterpolate,
  extrapolationClamp,
  memo,
} from 'wy-helper';
import { hookAnimateSignal } from 'mve-dom-helper';
import { createWindow } from 'daisy-mobile-helper';
import { PopWithRearrange } from 'mve-helper';

const DOCK_APPS = [
  {
    id: 'finder',
    icon: '📁',
    name: 'Finder',
    color: 'bg-blue-500',
    async load() {
      const panel = await import('./apps/FinderApp');
      return createWindow(panel.FinderApp.panel);
    },
  },
  {
    id: 'terminal',
    icon: '⌨️',
    name: 'Terminal',
    color: 'bg-gray-800',
    async load() {
      const panel = await import('./apps/TerminalApp');
      return createWindow(panel.TerminalApp.panel);
    },
  },
  {
    id: 'code',
    icon: '💻',
    name: 'Code Editor',
    color: 'bg-indigo-600',
    async load() {
      const panel = await import('./apps/CodeEditorApp');
      return createWindow(panel.CodeEditorApp.panel);
    },
  },
  {
    id: 'whiteboard',
    icon: '🎨',
    name: 'Whiteboard',
    color: 'bg-green-500',
    async load() {
      const panel = await import('./apps/WhiteboardApp');
      return createWindow(panel.WhiteboardApp.panel);
    },
  },
  {
    id: 'particle',
    icon: '✨',
    name: 'Particles',
    color: 'bg-purple-600',
    async load() {
      const panel = await import('./apps/ParticleApp');
      return createWindow(panel.ParticleApp.panel);
    },
  },
  {
    id: 'cube',
    icon: '🎲',
    name: 'Rubiks Cube',
    color: 'bg-red-500',
    async load() {
      const panel = await import('./apps/RubiksCubeApp');
      return createWindow(panel.RubiksCubeApp.panel);
    },
  },
  {
    id: 'visualizer',
    icon: '🎵',
    name: 'Audio Viz',
    color: 'bg-pink-500',
    async load() {
      const panel = await import('./apps/AudioVisualizerApp');
      return createWindow(panel.AudioVisualizerApp.panel);
    },
  },
  {
    id: 'music',
    icon: '🎶',
    name: 'Music',
    color: 'bg-rose-500',
    async load() {
      const panel = await import('./apps/MusicApp');
      return createWindow(panel.MusicApp.panel);
    },
  },
  {
    id: 'photos',
    icon: '🖼️',
    name: 'Photos',
    color: 'bg-yellow-500',
    async load() {
      const panel = await import('./apps/PhotosApp');
      return createWindow(panel.PhotosApp.panel);
    },
  },
  {
    id: 'settings',
    icon: '⚙️',
    name: 'Settings',
    color: 'bg-gray-600',
    async load() {
      const panel = await import('./apps/SettingsApp');
      return createWindow(panel.SettingsApp.panel);
    },
  },
  {
    id: 'form',
    icon: '📝',
    name: 'Form',
    color: 'bg-orange-500',
    async load() {
      const panel = await import('./apps/FormValidationApp');
      return createWindow(panel.FormValidationApp.panel);
    },
  },
  {
    id: 'virtual',
    icon: '📜',
    name: 'Virtual List',
    color: 'bg-teal-500',
    async load() {
      const panel = await import('./apps/VirtualScrollApp');
      return createWindow(panel.VirtualScrollApp.panel);
    },
  },
  {
    id: 'kanban',
    icon: '📋',
    name: 'Kanban',
    color: 'bg-cyan-500',
    async load() {
      const panel = await import('./apps/DragDropApp');
      return createWindow(panel.DragDropApp.panel);
    },
  },
  {
    id: 'infinite',
    icon: '♾️',
    name: 'Infinite',
    color: 'bg-violet-500',
    async load() {
      const panel = await import('./apps/InfiniteScrollApp');
      return createWindow(panel.InfiniteScrollApp.panel);
    },
  },
  {
    id: 'debounce',
    icon: '⏱️',
    name: 'Debounce',
    color: 'bg-amber-500',
    async load() {
      const panel = await import('./apps/DebounceThrottleApp');
      return createWindow(panel.DebounceThrottleApp.panel);
    },
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

const DISTANCE = 120;
const SCALE = 1.8;

const scaleMap = getInterpolate(
  {
    [-DISTANCE]: 1,
    0: SCALE,
    [DISTANCE]: 1,
  },
  extrapolationClamp
);

export function DockBar() {
  const mouseX = createSignal(-Infinity);

  fdom.div({
    className: 'absolute bottom-4 left-1/2 -translate-x-1/2 z-30',
    children() {
      dom
        .div({
          className:
            'flex items-end gap-2 px-3 py-2 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl',
          onMouseMove(e) {
            const { left } = e.currentTarget.getBoundingClientRect();
            mouseX.set(e.clientX - left);
            batchSignalEnd();
          },
          onMouseLeave() {
            mouseX.set(-Infinity);
            batchSignalEnd();
          },
        })
        .render(() => {
          DOCK_APPS.forEach(app => {
            app(function (arg) {
              let inited = false;
              const distance = memo(() => {
                if (inited) {
                  return mouseX.get() - btn.offsetLeft - btn.offsetWidth / 2;
                }
                return mouseX.get();
              });
              const scaleBase = memo(() => scaleMap(distance()));
              const scale = hookAnimateSignal(scaleBase);
              const btn = dom
                .button({
                  className: `${arg.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow origin-bottom relative group`,
                  style: {
                    transform() {
                      return `scale(${scale()})`;
                    },
                  },
                  onClick: arg.onClick,
                })
                .render(() => {
                  dom.span().renderTextContent(arg.icon);

                  // Tooltip
                  dom
                    .div({
                      className:
                        'invisible group-hover:visible absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap',
                    })
                    .render(() => {
                      dom.span().renderTextContent(app.name);
                    });

                  // 运行指示器
                  fdom.div({
                    className:
                      'absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white',
                    s_opacity() {
                      return arg.opened() ? 1 : 0;
                    },
                  });
                });
              inited = true;
            });
          });
        });
    },
  });
}
