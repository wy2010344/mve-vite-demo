import { PointerDirMoveUp } from "wy-dom-helper"
import { AbsAnimateFrameValue, addEffect, AnimateFrameEvent, batchSignalEnd, cacheVelocity, EmptyFun, FrictionalFactory, getSpringBaseAnimationConfig, GetValue, MomentumIScroll } from "wy-helper"

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
      bs: MomentumIScroll,

      callback: (direction: 1 | -1, velocity: number) => void
    ): PointerDirMoveUp {
      //左右滑动
      const velocityX = cacheVelocity()
      velocityX.append(initE.timeStamp, initE.pageX)
      let lastPageX = initE.pageX
      function didMove(e: PointerEvent, ignore?: boolean) {
        // console.log("didMove---", e)
        //需要正数
        scrollX.changeTo(lastPageX - e.pageX + scrollX.get())
        if (ignore) {
          return
        }
        velocityX.append(e.timeStamp, e.pageX)
        lastPageX = e.pageX
      }
      return {
        onPointerMove: didMove,
        onPointerUp(e) {
          didMove(e, true)
          const velocity = -velocityX.get()
          // const dis = bc.getFromVelocity(velocity)
          // const targetDis = dis.maxDistance + scrollX.get()
          // console.log("targetDis", velocity, dis.maxDistance, scrollX.get(), getWidth() / 2)
          const dis = bs.getWithSpeedIdeal(velocity)
          const targetDis = dis.distance + scrollX.get()
          const absTargetDis = Math.abs(targetDis)
          if (absTargetDis < getWidth() / 2) {
            //恢复原状
            scrollX.changeTo(
              0,
              // (deltax) => {
              //   return fc.getFromDistance(deltax).animationConfig()
              // },
              getSpringBaseAnimationConfig({
                initialVelocity: velocity,
                displacementThreshold: 1
              }),
              event)
          } else {
            const direction = targetDis > 0 ? 1 : -1
            globalDirectionVelocity = velocity
            callback(direction, velocity)
            batchSignalEnd()
          }
        }
      }
    },
    changePage(direction: number) {
      addEffect(() => {
        const diffWidth = direction * getWidth()
        scrollX.changeTo(
          diffWidth,
          // deltax => {
          //   return fc.getFromDistance(deltax).animationConfig()
          // },
          getSpringBaseAnimationConfig({
            initialVelocity: globalDirectionVelocity,
            displacementThreshold: 1
          }),
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