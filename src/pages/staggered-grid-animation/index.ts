import { animate, AnimationPlaybackControls } from 'motion';
import { fdom } from 'mve-dom';
import { hookTrackSignal } from 'mve-helper';
import { createSignal } from 'wy-helper';

export default function () {
  const gridSize = 10;

  const originX = createSignal(0);
  const originY = createSignal(0);
  fdom.div({
    className:
      'grid grid-cols-10 grid-rows-10 w-full max-w-[50vw]  aspect-square gap-2 sm:gap-3',
    children() {
      const max = gridSize ** 2;
      for (let i = 0; i < max; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        function getDistance() {
          return Math.sqrt(
            (row - originX.get()) ** 2 + (col - originY.get()) ** 2
          );
        }

        function isOrigin() {
          return row == originX.get() && col == originY.get();
        }

        const div = fdom.div({
          className: 'bg-neutral-200 rounded-sm ',
          s_background() {
            return isOrigin() ? 'orange' : '';
          },
          onClick() {
            originX.set(row);
            originY.set(col);
          },
        });

        let c: AnimationPlaybackControls;
        hookTrackSignal(function () {
          if (!isOrigin()) {
            if (c) {
              c.stop();
            }
            c = animate(
              div,
              {
                opacity: [0, 1],
                scale: [0, 1],
              },
              {
                delay: getDistance() / 30,
              }
            );
          }
        });
      }
    },
  });
}
