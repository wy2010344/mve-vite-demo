import { subscribeEventListener } from 'wy-dom-helper'
import { EmptyFun, PointKey, StoreRef } from 'wy-helper';

export type BeginMove = (initE: PointerEvent, secondE: PointerEvent, direction: PointKey) => void
export default function pointerMoveDir(
  beginMove: BeginMove,
  eq: PointKey = 'y'
) {
  return function (e: PointerEvent) {
    const initE = e;
    const destroyJudgeMove = subscribeEventListener(document, 'pointermove', e => {
      destroyJudgeMove();
      destroyUp()
      const absY = Math.abs(e.pageY - initE.pageY)
      const absX = Math.abs(e.pageX - initE.pageX)
      if (absX == absY) {
        beginMove(initE, e, eq)
      } else {
        if (absX > absY) {
          //左右移动
          beginMove(initE, e, 'x')
        } else {
          //上下移动
          beginMove(initE, e, 'y')
        }
      }
    })
    //避免点击后没有移动.
    const destroyUp = subscribeEventListener(document, 'pointerup', e => {
      destroyJudgeMove()
      destroyUp()
    })
  }
}

export function pointerMoveDirWithLock(
  lock: StoreRef<PointKey | undefined>,
  beginMove: BeginMove,
  eq: PointKey = 'y'
) {
  return pointerMoveDir(function (initE, secondE, dir) {
    if (lock.get() && lock.get() != dir) {
      return
    }
    lock.set(dir)
    beginMove(initE, secondE, dir)
  }, eq)
}