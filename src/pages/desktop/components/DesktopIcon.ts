import { fdom } from 'mve-dom';
import { animateSignal } from 'wy-dom-helper';
import { easeFns, spring, tween } from 'wy-helper';

export function DesktopIcon({ app }: { app: any }) {
  const scale = animateSignal(1);
  const isPressed = animateSignal(0);
  let lastClickTime = 0;

  function openWindow() {
    const newWindow = {
      id: `${app.id}-${Date.now()}`,
      appId: app.id,
      title: app.name,
      icon: app.icon,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      width: 600,
      height: 400,
      zIndex: Date.now(),
      minimized: false,
      maximized: false,
    };
  }

  fdom.div({
    className: 'flex flex-col items-center cursor-pointer select-none w-20',
    onPointerDown() {
      isPressed.animateTo(1, tween(100, easeFns.out(easeFns.quad)));
      scale.animateTo(0.9, tween(100, easeFns.out(easeFns.quad)));
    },
    onPointerUp() {
      isPressed.animateTo(0, tween(100, easeFns.out(easeFns.quad)));
      scale.animateTo(1, spring());
    },
    onPointerLeave() {
      isPressed.animateTo(0, tween(100, easeFns.out(easeFns.quad)));
      scale.animateTo(1, spring());
    },
    onClick() {
      const now = Date.now();
      if (now - lastClickTime < 300) {
        openWindow();
      }
      lastClickTime = now;
    },
    s_transform() {
      return `scale(${scale.get()})`;
    },
    children() {
      // 图标背景
      fdom.div({
        className: `${app.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg`,
        s_opacity() {
          return 0.9 - isPressed.get() * 0.2;
        },
        childrenType: 'text',
        children: app.icon,
      });

      // 图标名称
      fdom.div({
        className:
          'mt-1 text-white text-xs text-center font-medium drop-shadow-lg px-1 py-0.5 rounded',
        s_textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        s_backgroundColor: 'rgba(0,0,0,0.3)',
        childrenType: 'text',
        children: app.name,
      });
    },
  });
}
