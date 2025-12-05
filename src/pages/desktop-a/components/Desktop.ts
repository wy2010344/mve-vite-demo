import { fdom } from 'mve-dom';
import { uiStore } from '../store/uiStore';
import styles from '../desktop.module.css';
import { DesktopIcons } from './DesktopIcons';
import { Taskbar } from './Taskbar';
import { renderWindows } from 'daisy-mobile-helper';
export function Desktop() {
  fdom.div({
    className: `${styles.desktop} w-screen h-screen relative overflow-hidden`,
    onClick() {
      // Click on desktop background
      uiStore.closeStartMenu();
    },
    children() {
      // Desktop Icons
      // Windows Layer
      fdom.div({
        className: 'absolute inset-0 flex flex-col',
        children() {
          fdom.div({
            className: 'flex-1 relative',
            children() {
              DesktopIcons();

              renderWindows();
            },
          });

          // Taskbar
          Taskbar();
        },
      });
    },
  });
}
