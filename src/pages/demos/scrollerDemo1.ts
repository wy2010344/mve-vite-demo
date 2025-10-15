import { fdom, renderText } from 'mve-dom';
import { renderContentEditableTrans } from 'mve-dom-helper';
import { renderArray } from 'mve-helper';
import { animateSignal, cns, cssMap, pointerMoveDir } from 'wy-dom-helper';
import { contentEditableText } from 'wy-dom-helper/contentEditable';
import {
  AnimateSignal,
  arrayCountCreateWith,
  ClampingScrollFactory,
  createSignal,
  defaultSpringAnimationConfig,
  destinationWithMargin,
  eventGetPageY,
  FrictionalFactory,
  numberStoreTranfrom,
  overScrollSlow,
  quote,
  scrollEdgeIteration,
  scrollForEdge,
  ScrollFromPage,
  scrollInfinityIteration,
  spring,
  tw,
} from 'wy-helper';

//保持有限的位移
// const fr = FrictionalFactory.get(0.004)//0.0006
const fr2 = FrictionalFactory.get(0.08);

const fr = ClampingScrollFactory.get();
const fb2 = ClampingScrollFactory.get(100);
/**
 * 原生一次滚动200 * 44 左右
 */
export default function () {
  const maxCount = createSignal(1000);
  const version = createSignal(0);
  function scrollType() {
    const i = version.get() % 2;
    if (i == 0) {
      return '原生';
    } else {
      return '惯性';
    }
  }
  const initV = createSignal(0);
  fdom.div({
    className: cs.title,
    children() {
      renderText`iScroll`;
      fdom.button({
        childrenType: 'text',
        onClick() {
          container.scrollTop = 0;
          scrollY.set(0);
          version.set(version.get() + 1);
        },
        children() {
          return scrollType();
        },
      });
      renderContentEditableTrans(
        numberStoreTranfrom,
        maxCount.get,
        v => {
          if (v < 0) {
            return;
          }
          maxCount.set(Math.round(v));
        },
        fdom.span({
          contentEditable: contentEditableText,
          className: 'min-w-1',
        })
      );
      fdom.span({
        childrenType: 'text',
        children: '--',
      });
      fdom.span({
        childrenType: 'text',
        children() {
          return initV.get().toFixed(2);
        },
      });
    },
  });

  const scrollY = animateSignal(0);
  let content: HTMLElement;
  const container = fdom.div({
    className() {
      return cns(
        cs.container,
        scrollType() == '原生'
          ? tw`overflow-auto`
          : tw`touch-none overflow-hidden`
      );
    },
    onPointerDown(e) {
      scrollY.stop();
      pointerMoveDir(e, {
        onMove(e, dir) {
          if (scrollType() == '原生') {
            return;
          }

          function onFinish(velocity: number) {
            initV.set(velocity);
            console.log('v1', velocity);
            //使用惯性
            // return destinationWithMargin({
            //   scroll: scrollY,
            //   frictional: fr.getFromVelocity(velocity),
            //   // multiple: 2,
            //   // containerSize: container.clientHeight,
            //   contentSize: content.offsetHeight,
            //   edgeConfig(velocity) {
            //     console.log("v", velocity)
            //     return fb2.getFromVelocity(velocity).animationConfig()
            //     return scrollInfinityIteration(velocity, {
            //       nextVelocity(v) {
            //         return v * 0.93
            //       }
            //     })
            //     // return fr2.getFromVelocity(velocity).animationConfig('in')
            //   },
            //   edgeBackConfig: defaultSpringAnimationConfig,
            // })

            scrollEdgeIteration(scrollY, {
              velocity,
              containerSize: container.clientHeight,
              contentSize: content.offsetHeight,
              // nextVelocity(n) {
              //   return n * 0.9978
              // },
              // edgeNextVelocity(n) {
              //   return n * 0.93
              // }
            }).then(value => {
              if (value) {
                scrollY.changeTo(
                  value.target,
                  spring({
                    initialVelocity: value.velocity,
                  })
                );
              }
            });
          }
          return ScrollFromPage.from(e, {
            getPage: eventGetPageY,
            scrollDelta(delta, velocity, inMove) {
              // const y = scrollY.get()
              scrollForEdge(
                scrollY,
                delta,
                container.clientHeight,
                content.offsetHeight
              );
              if (inMove) {
                return;
              }
              onFinish(velocity);
            },
          });
        },
        onCancel(e) {
          console.log('stop', e);
          scrollY.stop();
        },
      });
    },
    children() {
      content = fdom.div({
        className: cs.content,
        s_transform() {
          return `translateY(${-scrollY.get()}px)`;
        },
        children() {
          renderArray(
            () => arrayCountCreateWith(maxCount.get(), quote),
            (row, getIndex) => {
              fdom.div({
                className: cs.row,
                childrenType: 'text',
                children() {
                  return `${row}---${getIndex()}`;
                },
              });
            }
          );
        },
      });
    },
  });

  fdom.div({
    className: cs.footer,
  });
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
    `,
});
