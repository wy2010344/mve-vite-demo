import { MoveEnd } from "wy-dom-helper"
import { AbsAnimateFrameValue, addEffect, AnimateFrameEvent, batchSignalEnd, cacheVelocity, EmptyFun, eventGetPageX, FrictionalFactory, getSpringBaseAnimationConfig, GetValue, ScrollFromPage, WeightMeasure } from "wy-helper"



/**
 * 使用0.01可以在300ms内完成
 */
const fc = FrictionalFactory.get(0.01)
export function getPageSnap(velocity: number) {
  //使用弹性
  return getSpringBaseAnimationConfig({
    initialVelocity: velocity
  })
  //使用重力惯性
  // return function (delta: number) {
  //   return new WeightMeasure(delta, 0,).animationEaseOutConfig()
  // }

  // return function (delta: number) {
  //   return fc.getFromDistance(delta).animationConfig()
  // }
}

export function movePage(
  scrollX: AbsAnimateFrameValue,
  // fc: FrictionalFactory,
  getWidth: GetValue<number>,
  event?: AnimateFrameEvent,
) {
  //翻页时的全局速度
  let globalDirectionVelocity = 0
  return {
    pointerDown(
      initE: PointerEvent,
      bs: FrictionalFactory,
      callback: (direction: 1 | -1, velocity: number) => void
    ): MoveEnd<PointerEvent> {

      return ScrollFromPage.from(initE, {
        getPage: eventGetPageX,
        scrollDelta(delta, velocity) {
          scrollX.changeDiff(delta)
        },
        onFinish(velocity) {
          // const dis = bc.getFromVelocity(velocity)
          // const targetDis = dis.maxDistance + scrollX.get()
          // console.log("targetDis", velocity, dis.maxDistance, scrollX.get(), getWidth() / 2)
          const dis = bs.getFromVelocity(velocity)
          const targetDis = dis.distance + scrollX.get()
          const absTargetDis = Math.abs(targetDis)
          if (absTargetDis < getWidth() / 2) {
            //恢复原状
            scrollX.changeTo(
              0,
              // (deltax) => {
              //   return fc.getFromDistance(deltax).animationConfig()
              // },
              //效果不太好,有速度就变化
              getPageSnap(velocity),
              // getSpringBaseAnimationConfig({
              //   initialVelocity: velocity
              // }),
              event)
          } else {
            const direction = targetDis > 0 ? 1 : -1
            globalDirectionVelocity = velocity
            callback(direction, velocity)
            batchSignalEnd()
          }
        }
      })
    },
    changePage(direction: number) {
      addEffect(() => {
        const diffWidth = direction * getWidth()
        scrollX.changeTo(
          diffWidth,
          // deltax => {
          //   return fc.getFromDistance(deltax).animationConfig()
          // },
          // getSpringBaseAnimationConfig({
          //   initialVelocity: globalDirectionVelocity
          // }),
          getPageSnap(globalDirectionVelocity),
          event)
        globalDirectionVelocity = 0
        scrollX.slientDiff(-diffWidth)
        batchSignalEnd()
      })
    }
  }
}

/**
 * 在内容区内粘浮,超出内容区滚动
 * @param trans 
 * @param maxScrllHeight 最大滚动距离
 * @returns 
 */
export function transSticky(trans: AbsAnimateFrameValue, maxScrllHeight = 0) {
  let ty = Math.max(trans.get(), 0)
  if (maxScrllHeight) {
    ty = Math.min(ty, maxScrllHeight)
  }
  return ty
}