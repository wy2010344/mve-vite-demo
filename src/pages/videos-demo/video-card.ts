import { fdom } from 'mve-dom';
import { Video } from './mockData';
import { createSignal } from 'wy-helper';
import { cns } from 'wy-dom-helper';

export default function (video: Video) {
  const hovered = createSignal(false);

  const img = createSignal(true);
  fdom.div({
    className() {
      return `group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${
        hovered.get() ? 'transform scale-105' : ''
      }`;
    },
    onMouseEnter() {
      hovered.set(true);
    },
    onMouseLeave() {
      hovered.set(false);
    },
    children() {
      //缩略图容器
      fdom.div({
        className: 'relative aspect-video bg-gray-100 overflow-hidden',
        children() {
          fdom.img({
            src: video.thumbnail,
            className:
              'w-full h-full object-cover transition-transform duration-300 group-hover:scale-110',
          });
        },
      });
    },
  });
}
