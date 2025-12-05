import { fdom } from 'mve-dom';
import { animateSignal } from 'wy-dom-helper';
import { addEffect, tween, easeFns, spring } from 'wy-helper';

const MENU_ITEMS: Array<
  | { label: string; icon: string; type?: never }
  | { type: 'divider'; label?: never; icon?: never }
> = [
  { label: 'New Folder', icon: '📁' },
  { label: 'Get Info', icon: 'ℹ️' },
  { type: 'divider' },
  { label: 'Change Wallpaper', icon: '🖼️' },
  { label: 'Display Settings', icon: '🖥️' },
  { type: 'divider' },
  { label: 'Refresh', icon: '🔄' },
];

export function ContextMenu({ contextMenu }: { contextMenu: any }) {
  const scale = animateSignal(0.8);
  const opacity = animateSignal(0);

  fdom.div({
    s_display() {
      return contextMenu.get() ? 'block' : 'none';
    },
    s_position: 'fixed' as const,
    s_left() {
      const menu = contextMenu.get();
      return menu ? `${menu.x}px` : '0px';
    },
    s_top() {
      const menu = contextMenu.get();
      return menu ? `${menu.y}px` : '0px';
    },
    s_zIndex: 9999,
    s_transform() {
      return `scale(${scale.get()})`;
    },
    s_opacity() {
      return opacity.get();
    },
    s_transformOrigin: 'top left' as const,
    children() {
      addEffect(() => {
        if (contextMenu.get()) {
          scale.animateTo(1, spring());
          opacity.animateTo(1, tween(150, easeFns.out(easeFns.cubic)));
        } else {
          scale.set(0.8);
          opacity.set(0);
        }
      });

      fdom.div({
        className:
          'bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[200px]',
        onClick(e) {
          e.stopPropagation();
        },
        children() {
          MENU_ITEMS.forEach(item => {
            if (item.type === 'divider') {
              fdom.div({
                className: 'h-px bg-gray-200 my-1',
              });
            } else {
              fdom.button({
                className:
                  'w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-3',
                onClick() {
                  contextMenu.set(null);
                },
                children() {
                  fdom.span({
                    childrenType: 'text',
                    children: item.icon,
                  });
                  fdom.span({
                    childrenType: 'text',
                    children: item.label,
                  });
                },
              });
            }
          });
        },
      });
    },
  });
}
