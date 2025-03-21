import { fdom } from "mve-dom";
import { renderArray } from "mve-helper";
import { animateSignal, cssMap, pointerMoveDir, } from "wy-dom-helper";
import { arrayCountCreateWith, defaultSpringAnimationConfig, eventGetPageY, FrictionalFactory, overScrollSlow, quote, scrollEdgeIteration, ScrollFromPage, scrollInfinityIteration, spring } from "wy-helper";

const fr = FrictionalFactory.get()//0.0006
const fr2 = FrictionalFactory.get(0.08)
export default function () {

  fdom.div({
    className: cs.title,
    childrenType: "text",
    children: "iScroll"
  })

  const scrollY = animateSignal(0)
  let content: HTMLElement
  const bs = FrictionalFactory.get()
  const container = fdom.div({
    className: cs.container,
    onTouchMove(e) {
      e.preventDefault()
    },
    onPointerDown: pointerMoveDir(function (e, dir) {
      return ScrollFromPage.from(e, {
        getPage: eventGetPageY,
        scrollDelta(delta, velocity) {
          const y = scrollY.get()
          scrollY.set(
            y +
            overScrollSlow(y, delta, container.clientHeight, content.offsetHeight)
          )
        },
        onFinish(velocity) {

          //使用惯性
          // return fr.destinationWithMarginIscroll({
          //   scroll: scrollY,
          //   velocity,
          //   containerSize: container.clientHeight,
          //   contentSize: content.offsetHeight,
          //   edgeConfig(velocity) {
          //     return scrollInfinityIteration(velocity, {
          //       nextVelocity(n) {
          //         return n * 0.95
          //       },
          //     })
          //     // return fr2.getFromVelocity(velocity).animationConfig('in')
          //   },
          //   edgeBackConfig: defaultSpringAnimationConfig,
          // })

          let backTarget = 0, backVelocity = 0, then = false
          //使用纯迭代
          scrollY.change(scrollEdgeIteration({
            velocity,
            containerSize: container.clientHeight,
            contentSize: content.offsetHeight,
            onBack(target, velocity) {
              then = true
              backTarget = target
              backVelocity = velocity
            },
          })).then((value) => {
            console.log('🆚', value)
            if (value && then) {
              scrollY.changeTo(backTarget, spring({
                initialVelocity: backVelocity
              }))
            }
          })
        }
      })
    }),
    children() {
      content = fdom.div({
        className: cs.content,
        s_transform() {
          return `translateY(${-scrollY.get()}px)`
        },
        children() {
          renderArray(() => arrayCountCreateWith(100, quote), (row, getIndex) => {
            fdom.div({
              className: cs.row,
              childrenType: "text",
              children() {
                return `${row}---${getIndex()}`
              }
            })
          })
        }
      })
    }
  })

  fdom.div({
    className: cs.footer
  })
}

const cs = cssMap({
  title: `
	position: absolute;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 45px;
	line-height: 45px;
	background: #CD235C;
	padding: 0;
	color: #eee;
	font-size: 20px;
	text-align: center;
	font-weight: bold;
  `,
  container: `
    position: absolute;
		z-index: 1;
		top: 45px;
		bottom: 48px;
		left: 0;
		width: 100%;
		background: #ccc;
		overflow: hidden;
    `,
  content: `
      	position: absolute;
				z-index: 1;
				-webkit-tap-highlight-color: rgba(0,0,0,0);
				width: 100%;
				transform: translateZ(0);
				user-select: none;
				text-size-adjust: none;`,
  row: `       	
  padding: 0 10px;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #ccc;
	border-top: 1px solid #fff;
	background-color: #fafafa;
	font-size: 14px;
  `,
  footer: `
    position: absolute;
		z-index: 2;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 48px;
		background: #444;
		padding: 0;
		border-top: 1px solid #444;
    `
})