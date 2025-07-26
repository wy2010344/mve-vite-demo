import { dom, fdom, mdom, renderText, renderTextContent } from "mve-dom";
import { renderMobileView } from "../../onlyMobile";
import Lottie, { AnimationItem } from "lottie-web";

import data from "./data";
import { bgColorfromHex, circleFindNearst, circleFormat, createSignal, easeFns, easeOut, eventGetPageX, extrapolationClamp, getAbsoulteIndex, getInterpolate, getInterpolateColor, memo, memoFun, readArraySliceCircle, rgbFromBgColor, spring, tween } from "wy-helper";
import { hookDestroy, hookTrackSignal, renderArray } from "mve-helper";
import { animateSignal, pointerMove, pointerMoveDir, subscribeEventListener } from "wy-dom-helper";
import { movePage } from "mve-dom-helper";
import explain from "../../explain";
import markdown from "../../markdown";
/**
 * https://www.youtube.com/watch?v=lcqS8uSpHLI
 */
export default function () {

  renderMobileView(function ({
    width
  }) {
    const index = createSignal(0)
    function updateIndex(diff: number) {
      index.set(circleFormat(index.get() + diff, data.length))
    }
    const cacheList = memo(() => readArraySliceCircle(data, index.get() - 1, index.get() + 2))
    // const scrollX = animateSignal(0)
    const sp = spring({
      // initialVelocity: v,
      config: {
        omega0: 8
      }
    })
    const scrollX = movePage({
      getSize: width,
      getPageSnap() {
        return sp
      }
    })//tween(6000, easeFns.inOut(easeFns.circ)))

    scrollX.hookCompare(index.get, function (i, beforeIndex) {
      return circleFindNearst(i - beforeIndex, data.length)
    })

    const getVX = memo(() => {
      //是需要知道方向的
      const d = scrollX.get()
      const i = index.get()
      return getAbsoulteIndex(data.length, d > 0 ? i + 1 : i - 1)
    })
    const bgC = data.map(row => bgColorfromHex(row.backgroundColor))
    const interpolateBgColor = memoFun(() => {
      const w = width()
      const halfWidth = w / 2
      const vx = getVX()
      const i = index.get()
      return getInterpolateColor({
        0: bgC[i],
        [halfWidth - 0.001]: bgC[i],
        [halfWidth]: bgC[vx],
        [w]: bgC[vx]
      }, extrapolationClamp)
    })
    fdom.div({
      className: 'absolute inset-0',
      s_backgroundColor() {
        return rgbFromBgColor(interpolateBgColor(Math.abs(scrollX.get())))
      }
    })

    hookDestroy(subscribeEventListener(window, 'pointerdown', e => {
      pointerMove(scrollX.getMoveEvent(e, 'x', {
        callback: updateIndex
      }))
    }))

    const currentRow = memo(() => data.at(index.get()))

    const abg = data.map(row => bgColorfromHex(row.animationBg))
    const interpolateAnimationBgColor = memoFun(() => {
      const w = width()
      const halfWidth = w / 2
      const vx = getVX()
      const i = index.get()
      return getInterpolateColor({
        0: abg[i],
        [halfWidth - 0.001]: abg[i],
        [halfWidth]: abg[vx],
        [w]: abg[vx]
      }, extrapolationClamp)
    })
    fdom.div({
      className: 'absolute  left-0 right-0 bottom-[200px] flex justify-center',
      children() {


        const interpolateRotate = memoFun(() => {
          return getInterpolate({
            [-width()]: - 180,
            0: 0,
            [width()]: 180
          }, extrapolationClamp)
        })
        const interpolateScale = memoFun(() => {
          return getInterpolate({
            0: 1,
            [width() / 2]: 8,
            [width()]: 1
          }, extrapolationClamp)
        })
        fdom.div({
          className: 'absolute top-0 w-[100px] h-[100px] rounded-full',
          s_transform() {
            const x = Math.abs(scrollX.get())
            // console.log("x", scrollX.get(), x)
            return `perspective(300px) rotateY(${interpolateRotate(-scrollX.get())}deg) scale(${(interpolateScale(x))})`
          },
          s_backgroundColor() {
            return rgbFromBgColor(interpolateAnimationBgColor(Math.abs(scrollX.get())))
          }
        })
        const interpolateOpacity = getInterpolate({
          0: 1,
          40: 0
        }, extrapolationClamp)
        fdom.button({
          className: 'absolute z-1 top-0 w-[100px] h-[100px] flex items-center justify-center rounded-full bg-transparent',
          color() {
            return currentRow()?.backgroundColor
          },
          s_opacity() {
            return interpolateOpacity(Math.abs(scrollX.get()))
          },
          s_color() {
            return currentRow()?.backgroundColor
          },
          onClick() {
            updateIndex(1)
          },
          childrenType: 'html',
          children: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 7L15 12L10 17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      `
        })
      }
    })
    fdom.div({
      className: 'relative h-full',
      s_transform() {
        return `translateX(${-scrollX.get()}px)`
      },
      children() {
        renderArray(cacheList, function (row, getIndex) {
          mdom.div({
            attrs(v) {
              v.s_color = row.textColor
              v.className = 'h-full flex flex-col items-center perspective-near'
              const i = getIndex()
              if (i != 1) {
                v.s_position = 'absolute'
                v.s_inset = 0
                v.s_transform = `translateX(${(getIndex() - 1) * 100}%)`
              }
            },
            children() {
              const div = fdom.div({
                className: 'w-[200px] h-[200px]',
                s_background: row.animationBg
              })

              let nd: AnimationItem
              row.animation.then(value => {
                nd = Lottie.loadAnimation({
                  container: div,
                  renderer: "canvas",
                  animationData: { ...value }
                })
              })
              hookDestroy(() => {
                nd?.destroy()
              })

              dom.h1({
                className: 'px-[30px]'
              }).renderTextContent(row.text)
              dom.span({
                className: 'text-black'
              }).renderTextContent(row.id - 1)
              renderColor(row.backgroundColor, 'backgroundColor')
              renderColor(row.animationBg, 'animationBg')
              fdom.div({
                className: 'flex-1'
              })
            }
          })
        })
      }
    })
  })

  explain(function () {
    markdown`
参考:(https://www.youtube.com/watch?v=lcqS8uSpHLI)
    `
  })
}


function renderColor(value: string, name: string) {
  fdom.div({
    s_height: '30px',
    s_background: value,
    children() {
      renderTextContent(name)
    }
  })
}