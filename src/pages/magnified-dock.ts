import { dom, fdom } from "mve-dom"
import { animateSignal, requestBatchAnimationFrame } from "wy-dom-helper";
import { batchSignalEnd, createSignal, cubicBezier, extrapolationClamp, getInterpolate, getZtaAndOmega0From, memo, spring, tween } from "wy-helper";
import explain from "../explain";
import markdown from "../markdown";
import { hookAnimateSignal } from "mve-dom-helper";
const APPS = [
  'Safari',
  'Mail',
  'Messages',
  'Photos',
  'Notes',
  'Calendar',
  'Reminders',
  'Music',
];

const sp = spring({
  config: getZtaAndOmega0From(170, 12, 0.1)
})
const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};
const DISTANCE = 110; // pixels before mouse affects an icon
const SCALE = 2.25; // max scale factor of an icon
const NUDGE = 40; // pixels icons are moved away from mouse

const gp = getInterpolate({
  0: 0,
  40: -40
}, extrapolationClamp)
const scaleMap = getInterpolate({
  [- DISTANCE]: 1,
  0: SCALE,
  [DISTANCE]: 1
}, extrapolationClamp)
/**
 * https://buildui.com/recipes/magnified-dock
 */
export default () => {
  explain(function () {

    markdown`
参考[https://buildui.com/recipes/magnified-dock](https://buildui.com/recipes/magnified-dock)
    `
  })
  const mouseLeft = createSignal(-Infinity)
  const mouseRight = createSignal(-Infinity)


  const left = hookAnimateSignal(() => {
    return gp(mouseLeft.get())
  })
  const right = hookAnimateSignal(() => {
    return gp(mouseRight.get())
  })
  fdom.div({
    className: 'sm:hidden flex',
    childrenType: 'text',
    children: `宽度大于640px的桌面环境展示最佳`
  })
  dom.div({
    className: "mx-auto hidden h-16 items-end gap-3 px-2 pb-3 sm:flex relative",
    onMouseMove(e) {
      const { left, right } = e.currentTarget.getBoundingClientRect();
      const offsetLeft = e.clientX - left;
      const offsetRight = right - e.clientX;
      mouseLeft.set(offsetLeft);
      mouseRight.set(offsetRight);
      batchSignalEnd()
    },
    onMouseLeave(e) {
      mouseLeft.set(-Infinity);
      mouseRight.set(-Infinity);
      batchSignalEnd()
    }
  }).render(() => {
    dom.div({
      className: "absolute rounded-2xl inset-y-0 bg-gray-700 border border-gray-600 -z-10",
      style: {
        left() {
          return left() + "px"
        },
        right() {
          return right() + "px"
        }
      }
    }).render()
    APPS.forEach(app => {

      let inited = false
      const distance = memo(() => {
        if (inited) {
          return mouseLeft.get() - btn.offsetLeft - btn.offsetWidth / 2;
        } else {
          return mouseLeft.get()
        }
      })

      const scaleBase = memo(() => {
        return scaleMap(distance())
      })
      const scale = hookAnimateSignal(scaleBase)
      const x = hookAnimateSignal(() => {
        const d = distance();
        if (d === -Infinity) {
          return 0;
        } else if (d < -DISTANCE || d > DISTANCE) {
          return Math.sign(d) * -1 * NUDGE;
        } else {
          return (-d / DISTANCE) * NUDGE * scaleBase();
        }
      }, {
        config: sp
      })

      const y = animateSignal(0)
      const btn = dom.button({
        className: "aspect-square block w-10 rounded-full bg-white shadow origin-bottom relative group/abc",
        style: {
          // scale,
          transform() {
            return `translate(${x()}px,${y.get()}px) scale(${scale()})`
          }
        },
        async onClick() {
          async function fun() {
            await y.changeTo(-40, tween(0.7 / 2 * 1000, cubicBezier(0, 0, 0.2, 1)))
            await y.changeTo(0, tween(0.7 / 2 * 1000, cubicBezier(0.8, 0, 1, 1)))
          }
          await fun()
          await fun()
          await fun()
        }
      }).render(() => {
        dom.div({
          className: `invisible group-hover/abc:visible  absolute bottom-[calc(100%+5px)] left-[50%] translate-x-[-50%]`,
        }).render(() => {
          dom.div({
            className: 'w-2 h-2 bg-gray-700 absolute -bottom-1 left-[50%] translate-x-[-50%] rotate-45'
          }).render()
          dom.div({
            className: `relative bg-gray-700 shadow shadow-black border border-gray-600 px-2 py-1.5 text-sm rounded text-white font-medium `,
          }).render(() => {
            dom.span().renderTextContent(app)
          })
        })
      })
      inited = true
    })
  })
}