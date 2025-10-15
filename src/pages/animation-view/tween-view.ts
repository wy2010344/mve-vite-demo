import { createSignal, easeFns, EaseType, memoFun, Quote } from 'wy-helper';
import { fdom, renderText } from 'mve-dom';
import drawCanvasCurve from './draw-canvas-curve';
import { NumberRange, renderNumberRange } from '../../renderRange';
import { renderControl, renderEase } from './util';

function renderTweenView(easeFn: Quote<number>) {
  drawCanvasCurve({
    getDotList(height) {
      const per = 1 / height;
      const list: number[] = [];
      for (let i = 0; i <= height; i++) {
        list.push(easeFn(i * per) * height);
      }
      return list;
    },
  });
}

export function easePoly() {
  const ease = createSignal<EaseType>('in');
  const polyNumber = new NumberRange(2, {
    min: 1,
    max: 10,
    step: 9,
  });
  renderTweenView(
    memoFun(() => {
      const fn = easeFns.poly(polyNumber.value.get());
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );

  renderControl('Poly动画', () => {
    renderNumberRange('poly', polyNumber);
    renderEase(ease);
    fdom.div({
      childrenType: 'text',
      children() {
        const i = polyNumber.value.get();
        const name = names[i - 2];
        if (name) {
          return `别名:${name}`;
        }
        return '';
      },
    });
  });
}
const names = ['quad', 'cubic', 'quart', 'quint'];
export function easeSine() {
  const ease = createSignal<EaseType>('in');

  renderTweenView(
    memoFun(() => {
      const fn = easeFns.sine;
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );
  renderControl('正弦曲线', () => {
    renderText`别名:sine`;

    renderEase(ease);
  });
}
export function easeCirc() {
  const ease = createSignal<EaseType>('in');

  renderTweenView(
    memoFun(() => {
      const fn = easeFns.circ;
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );
  renderControl('圆形曲线', () => {
    renderText`别名:circ`;

    renderEase(ease);
  });
}

export function easeExpo() {
  const ease = createSignal<EaseType>('in');

  renderTweenView(
    memoFun(() => {
      const fn = easeFns.expo;
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );
  renderControl('指数曲线', () => {
    renderText`别名:expo`;

    renderEase(ease);
  });
}

export function easeBonuceOut() {
  const ease = createSignal<EaseType>('in');
  renderTweenView(
    memoFun(() => {
      const fn = easeFns.bounceOut;
      const e = ease.get();
      if (e == 'out') {
        return fn;
      }
      if (e == 'in-out') {
        return easeFns.outIn(fn);
      }
      return easeFns.out(fn);
    })
  );
  renderControl('弹跳曲线', () => {
    renderText`别名:bonuceOut`;
    renderEase(ease);
  });
}

export function easeBack() {
  const ease = createSignal<EaseType>('in');

  const s = new NumberRange(1.70158, {
    min: 0.001,
    max: 10,
  });
  renderTweenView(
    memoFun(() => {
      const fn = easeFns.back(s.value.get());
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );
  renderControl('反弹曲线', () => {
    renderText`别名:back`;
    renderNumberRange('s', s);
    renderEase(ease);
  });
}

export function easeElastic() {
  const ease = createSignal<EaseType>('in');
  const a = new NumberRange(1, {
    min: 0.001,
    max: 10,
  });
  const p = new NumberRange(0.3, {
    min: 0.001,
    max: 10,
  });
  renderTweenView(
    memoFun(() => {
      const fn = easeFns.getElastic(a.value.get(), p.value.get());
      const e = ease.get();
      if (e == 'out') {
        return easeFns.out(fn);
      }
      if (e == 'in-out') {
        return easeFns.inOut(fn);
      }
      return fn;
    })
  );
  renderControl('弹性曲线', () => {
    renderText`别名:elastic`;
    renderNumberRange('a', a);
    renderNumberRange('p', p);
    renderEase(ease);
  });
}
