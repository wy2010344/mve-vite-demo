import { fdom } from "mve-dom";
import { renderArray } from "mve-helper";
import { cssMap, pointerMoveDir, signalAnimateFrame } from "wy-dom-helper";
import { arrayCountCreateWith, destinationWithMarginTrans, eventGetPageY, FrictionalFactory, overScrollSlow, quote, ScrollFromPage } from "wy-helper";

export default function () {

  fdom.div({
    className: cs.title,
    childrenType: "text",
    children: "iScroll"
  })

  const transY = signalAnimateFrame(0)
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
          const y = transY.get()
          transY.changeTo(
            y +
            overScrollSlow(y, delta, container.clientHeight, content.offsetHeight)
          )
        },
        onFinish(velocity) {
          const out = bs.destinationWithMarginIscroll({
            velocity,
            current: transY.get(),
            containerSize: container.clientHeight,
            contentSize: content.offsetHeight
          })
          destinationWithMarginTrans(out, transY)
        }
      })
    }),
    children() {
      content = fdom.div({
        className: cs.content,
        s_transform() {
          return `translateY(${-transY.get()}px)`
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