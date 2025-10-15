import { faker } from '@faker-js/faker';
import { fdom, renderTextContent } from 'mve-dom';
import {
  addEffect,
  arrayCountCreateWith,
  bigSpinDeviceToEnd,
  bigSpinStepTo,
  createBigSpin,
  createSignal,
  memo,
} from 'wy-helper';

import centerEmpty from './center-empty.png';
import opButton from './op-button.png';
import centerArrow from './center-arrow.png';
import { hookTrackSignal, renderArray } from 'mve-helper';
import { animateSignal, subscribeRequestAnimationFrame } from 'wy-dom-helper';
export default function () {
  const prizeCount = createSignal(6);

  const prizes = memo(() =>
    arrayCountCreateWith(prizeCount.get(), i => {
      return {
        id: i,
        color: faker.color.rgb(),
        amount: faker.number.int(),
        symbol: faker.animal.cat(),
        img: faker.image.avatar(),
      };
    })
  );

  const bgColor = memo(() => {
    const prizeExts = toNewList(prizes(), v => 1);
    return toConicColor(prizeExts, v => v.color);
  });

  type WinPrizeModel = {
    index: number;
  };
  const startRadian = createSignal(0);
  const winPrize = createSignal<WinPrizeModel | undefined>(undefined);
  const perAngel = memo(() => CI / prizes().length);
  function setWinPrize(xv: WinPrizeModel) {
    winPrize.set(xv);
    const distance = (prizes.length - xv.index) * perAngel() - perAngel() / 2;
    setDistance(
      distance +
        //额外多转的
        10 * CI
    );
  }
  function showPrize() {
    const win = winPrize.get();
    if (win) {
      alert(`中奖为${prizes()[win.index].amount}`);
    }
  }

  function draw() {
    if (!beginDraw()) {
      return;
    }
    startRadian.set(0);
    setTimeout(() => {
      const demoIndex = Math.floor(Math.random() * prizes.length);
      setWinPrize({
        index: demoIndex,
      });
    }, 2000);
  }

  const { beginDraw, drawValue, onDrawEffect, setDistance } = createBigSpin({
    beginConfig: bigSpinStepTo(200, 1), // springBaseAnimationConfigNoEnd(200),
    endConfig: bigSpinDeviceToEnd(1), // deviceToEnd(1), //
    value: startRadian,
    cycle: CI,
    onFinish: showPrize,
  });

  hookTrackSignal(drawValue, function (draw) {
    if (draw) {
      const call = onDrawEffect();
      const cancel = subscribeRequestAnimationFrame(function (time: number) {
        call(time, cancel);
      });
      return cancel;
    }
  });

  fdom.div({
    className: 'relative',
    children() {
      fdom.div({
        className: 'absolute right-0 top-0',
        children() {
          const input = fdom.input({
            type: 'range',
            min: 2,
            max: 9,
            value: prizeCount.get,
            step: 1,
            onInput(e) {
              prizeCount.set(Number(input.value));
            },
          });
        },
      });
      fdom.img({
        className: 'mx-auto',
        src: centerEmpty,
        alt: 'center-empty',
      });
      fdom.div({
        className:
          'absolute w-[525px] h-[525px] left-[50%] translate-x-[-50%] top-[70px]',
        children() {
          fdom.div({
            className: 'absolute inset-0 rounded-[50%]',
            s_rotate() {
              return `${startRadian.get() + 180}deg`;
            },
            s_background: bgColor,
            children() {
              renderArray(prizes, function (prize, i) {
                fdom.div({
                  className: `prize absolute top-0  h-[50%] 
    rotate-[var(--angel)] origin-[50%_bottom]
    left-[50%] translate-x-[-50%]`,
                  css_angel() {
                    return `${i() * perAngel() + perAngel() / 2}deg`;
                  },
                  children() {
                    fdom.div({
                      children() {
                        renderTextContent(prize.amount);
                      },
                    });
                    fdom.div({
                      children() {
                        renderTextContent(prize.symbol);
                      },
                    });
                  },
                });
              });
            },
          });

          let lastTemp = 0;
          const rotateArrow = animateSignal(0);
          hookTrackSignal(startRadian.get, latest => {
            const dv = latest % perAngel();
            if (dv > lastTemp && dv < perAngel() / 2) {
              addEffect(() => {
                rotateArrow.set(dv);
              });
            } else {
              addEffect(() => {
                if (dv > rotateArrow.get()) {
                  rotateArrow.set(dv);
                }
                rotateArrow.animateTo(0);
              });
            }
            lastTemp = dv;
          });
          fdom.div({
            className: `arrow absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%]`,
            s_rotate() {
              return `${rotateArrow.get()}deg`;
            },
            children() {
              fdom.img({
                src: centerArrow,
              });
            },
          });
        },
      });
      fdom.button({
        className: 'block mx-auto group relative',
        onClick: draw,
        disabled: drawValue,
        children() {
          fdom.img({
            src: opButton,
            className: `transition-all group-active:scale-y-50 origin-bottom`,
          });
          fdom.div({
            className: `absolute inset-0 flex items-start pt-[30px] justify-center text-white text-4xl
        transition-all group-active:scale-y-50 origin-bottom`,
            childrenType: 'text',
            children: 'Click',
          });
        },
      });
    },
  });
}

const CI = 360;
function toNewList<T>(list: T[], getValue: (n: T) => number) {
  const all = list.reduce((d, row) => {
    return d + getValue(row);
  }, 0);
  const newList = list.reduce<
    {
      data: T;
      percent: number;
      beforePercent: number;
    }[]
  >((acc, row) => {
    const aper = acc.reduce((x, r) => {
      return x + r.percent;
    }, 0);
    acc.push({
      data: row,
      percent: getValue(row) / all,
      beforePercent: aper,
    });
    return acc;
  }, []);
  return newList;
}
type NewRow<T> = {
  data: T;
  percent: number;
  beforePercent: number;
};
function toConicColor<T>(newList: NewRow<T>[], getColor: (n: T) => string) {
  const list: string[] = [];
  newList.forEach(row => {
    list.push(
      `${getColor(row.data)} ${row.beforePercent * CI}deg ${
        (row.beforePercent + row.percent) * CI
      }deg`
    );
  });
  const s = `conic-gradient(${list.join(', ')})`;
  return s;
}
