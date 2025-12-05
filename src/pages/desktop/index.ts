import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { Desktop } from './components/Desktop';
import styles from './desktop.module.css';
import { renderWindows } from 'daisy-mobile-helper';
import { DockBar } from './components/DockBar';
import { ContextMenu } from './components/ContextMenu';

export default function () {
  // 全局状态
  const contextMenu = createSignal<{ x: number; y: number } | null>(null);

  fdom.div({
    className: `${styles.desktopContainer} w-screen h-screen overflow-hidden relative`,
    onContextMenu(e) {
      e.preventDefault();
      contextMenu.set({ x: e.clientX, y: e.clientY });
    },
    onClick() {
      contextMenu.set(null);
    },
    children() {
      // 桌面背景和图标
      Desktop();

      // 窗口管理器
      fdom.div({
        className: 'absolute inset-0 z-20 pointer-events-none',
        children: renderWindows,
      });
      // Dock 栏
      DockBar();

      // 右键菜单
      // ContextMenu({ contextMenu });
    },
  });
}
