import { dom, fdom } from 'mve-dom';
import { hookTrackSignal, renderArray } from 'mve-helper';
import { animateSignal, pointerMove } from 'wy-dom-helper';
import { addEffect, createSignal } from 'wy-helper';
import explain from '../../explain';
import markdown from '../../markdown';
const baseCards = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
];
/**
 * https://codesandbox.io/embed/j0y0vpz59
 */
export default function () {
  const cards = createSignal(baseCards);

  hookTrackSignal(cards.get, function (cs) {
    if (cs.length) {
      return;
    }
    addEffect(() => {
      cards.set(baseCards);
    });
  });
  renderArray(cards.get, function (card, getIndex) {
    const x = animateSignal(0);
    const y = animateSignal(-1000);
    const baseRot = animateSignal(0);
    const scale = animateSignal(1.5);
    const i = getIndex();
    addEffect(() => {
      setTimeout(() => {
        y.animateTo(0);
        scale.animateTo(1);
        baseRot.animateTo(Math.random() * 40 - 20);
      }, i * 100);
    });

    function rot() {
      return baseRot.get() + x.get() / 100;
    }
    function removeCard() {
      cards.set(cards.get().filter(x => x != card));
    }
    fdom.div({
      className: 'absolute inset-0 flex justify-center items-center',
      s_transform() {
        return `translate3d(${x.get()}px,${y.get()}px,0)`;
      },
      onPointerDown(e) {
        let lastE: PointerEvent = e;
        pointerMove({
          onMove(e) {
            const deltaX = e.pageX - lastE.pageX;
            // const deltaY = e.pageY - lastE.pageY
            lastE = e;
            x.set(x.get() + deltaX);
            scale.set(1.1);
            // y.set(y.get() + deltaY)
          },
          onEnd(e) {
            if (x.get() > 200) {
              x.animateTo(window.innerWidth + 200).then(removeCard);
            } else if (x.get() < -200) {
              x.animateTo(-window.innerWidth - 200).then(removeCard);
            } else {
              x.animateTo(0);
            }
            scale.animateTo(1);
          },
        });
      },
      children() {
        fdom.div({
          className: `bg-white w-[45vh] max-w-[300px] h-[85vh] max-h-[570px]
          rounded-[10px]`,
          s_backgroundSize: 'auto 85%',
          s_backgroundRepeat: 'no-repeat',
          s_backgroundPosition: 'center center',
          s_boxShadow: `0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)`,
          s_willChange: 'transform',
          s_backgroundImage: `url(${card})`,
          s_transform() {
            return `perspective(1500px) rotateX(30deg) rotateY(${rot() / 10}deg) rotateZ(${rot()}deg) scale(${scale.get()})`;
          },
        });
      },
    });
  });

  explain(function () {
    markdown`
参考: (https://codesandbox.io/embed/j0y0vpz59)
    `;
  });
}
