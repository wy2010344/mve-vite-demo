import { fdom } from 'mve-dom';
import { APPS } from '../registry';

export function DesktopIcons() {
  fdom.div({
    className:
      'absolute top-0 left-0 bottom-12 w-full p-4 grid grid-cols-[repeat(auto-fill,100px)] grid-rows-[repeat(auto-fill,100px)] gap-2 content-start flex-col',
    s_gridAutoFlow: 'column',
    children() {
      APPS.forEach(app => {
        app(function (arg) {
          fdom.div({
            className:
              'flex flex-col items-center justify-center gap-1 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors group',
            onDoubleClick: arg.onClick,
            children() {
              fdom.div({
                className:
                  'w-12 h-12 flex items-center justify-center text-4xl drop-shadow-lg transition-transform group-hover:scale-110',
                children: arg.icon,
              });
              fdom.span({
                className:
                  'text-sm text-white text-center font-medium drop-shadow-md line-clamp-2 break-words w-full',
                s_textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                children: arg.title,
              });
            },
          });
        });
      });
    },
  });
}
