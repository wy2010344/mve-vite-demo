import { MoveEnd } from "wy-dom-helper"
import { addEffect, AnimateSignal, batchSignalEnd, eventGetPageX, FrictionalFactory, GetValue, ScrollFromPage, spring, WeightMeasure } from "wy-helper"


export function circleFindNearst(diff: number, max: number) {
  if (diff < -max / 2) {
    return max + diff
  } else if (diff > max / 2) {
    return diff - max
  }
  return diff
}

/**
 * 
 * @param n 0~max-1,加上一个值
 * @param max 总数量 
 * @returns 0~max-1
 */
export function circleFormat(n: number, max: number) {
  n = n % max
  if (n < 0) {
    return max + n
  }
  return n
}


export function getPageSnap(velocity: number) {
  //使用弹性
  return spring({
    initialVelocity: velocity,
    config: {
      zta: 0.5
    }
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
  scrollX: AnimateSignal,
  getWidth: GetValue<number>,
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
        scrollDelta(delta) {
          scrollX.changeDiff(delta)
        },
        onFinish(velocity) {
          const dis = bs.getFromVelocity(velocity)
          const targetDis = dis.distance + scrollX.get()
          const absTargetDis = Math.abs(targetDis)
          if (absTargetDis < getWidth() / 2) {
            //恢复原状
            scrollX.changeTo(
              0,
              //效果不太好,有速度就变化
              getPageSnap(velocity),
            )
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
          getPageSnap(globalDirectionVelocity),
        )
        globalDirectionVelocity = 0
        scrollX.silentDiff(-diffWidth)
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
export function transSticky(trans: AnimateSignal, maxScrllHeight = 0) {
  let ty = Math.max(trans.get(), 0)
  if (maxScrllHeight) {
    ty = Math.min(ty, maxScrllHeight)
  }
  return ty
}