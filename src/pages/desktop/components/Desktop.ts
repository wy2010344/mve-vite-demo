import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import styles from '../desktop.module.css';
import { DesktopIcon } from './DesktopIcon';

const DESKTOP_APPS = [
  { id: 'form', name: 'Form', icon: '📝', color: 'bg-orange-500' },
  { id: 'virtual', name: 'Virtual List', icon: '📜', color: 'bg-teal-500' },
  { id: 'kanban', name: 'Kanban', icon: '📋', color: 'bg-cyan-500' },
  { id: 'infinite', name: 'Infinite', icon: '♾️', color: 'bg-violet-500' },
  { id: 'debounce', name: 'Debounce', icon: '⏱️', color: 'bg-amber-500' },
  { id: 'code', name: 'Code', icon: '💻', color: 'bg-indigo-600' },
];

export function Desktop() {
  fdom.div({
    className: styles.wallpaper,
  });

  fdom.div({
    className: styles.wallpaperOverlay,
  });

  // 桌面图标网格
  fdom.div({
    className: 'absolute top-4 left-4 z-10 grid grid-cols-1 gap-4',
    s_gridAutoRows: 'min-content',
    children() {
      DESKTOP_APPS.forEach(app => {
        DesktopIcon({ app });
      });
    },
  });
}
