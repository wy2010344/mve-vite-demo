import { addEffect } from 'wy-helper';
import './index.css';
import { createWindow, renderWindows } from './window';
import { advancedThemeDemo } from './advanced-theme-demo';
import { fdom } from 'mve-dom';
export default function () {
  addEffect(() => {
    createWindow(advancedThemeDemo.panel);
  });
  fdom.div({
    className: 'absolute inset-0 flex-1 min-h-0',
    children: renderWindows,
  });
}
