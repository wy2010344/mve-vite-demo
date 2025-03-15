import { renderIf } from "mve-helper";
import { fdom, mdom } from "mve-dom";
import { dateFromYearMonthDay, extrapolationClamp, getInterpolate, GetValue, getWeekOfMonth, memo, memoFun, SignalAnimateFrameValue, StoreRef, YearMonthDayVirtualView, YearMonthVirtualView } from "wy-helper";
import { cns } from "wy-dom-helper";
import { SolarDay } from "tyme4ts";
import { firstDayOfWeekIndex, WEEKS } from "./firstDayOfWeek";
export const selectShadowCell = 'select-cell'
export default function (
  yearMonth: YearMonthVirtualView,
  getIndex: GetValue<number>,
  calendarScrollY: SignalAnimateFrameValue,
  showCalendar: GetValue<boolean>,
  date: StoreRef<YearMonthDayVirtualView>,
  fullWidth: GetValue<number>
) {

  function perSize() {
    return fullWidth() / 7
  }


  function selectCurrent() {
    const d = date.get()
    const ym = yearMonth
    return d.year == ym.year && d.month == ym.month
  }
  mdom.div({
    attrs(v) {
      const i = getIndex()
      if (i == 1) {

      } else {
        v.s_position = 'absolute'
        v.s_inset = 0
        v.s_transform = `translateX(${(i - 1) * 100}%)`
      }
    },
    children() {
      //周这个需要snap
      fdom.div({
        className: 'flex bg-primary z-10 relative',
        // s_transform() {
        //   let minScrollHeight = 0
        //   // if (content && container) {
        //   //   minScrollHeight = container.clientHeight - content.offsetHeight
        //   // }
        //   return `translateY(${transSticky(currentScrollY(), minScrollHeight)}px)`
        // },
        children() {
          for (let i = 0; i < 7; i++) {
            fdom.div({
              className: 'flex-1 aspect-square flex items-center justify-center text-primary-content',
              childrenType: "text",
              children() {
                return WEEKS[yearMonth.weekDay(i)]
              }
            })
          }
        }
      })
      renderIf(showCalendar, function () {
        const interpolateY = memoFun(() => {
          const perHeight = perSize()
          const moveHeight = perHeight * 5
          const weekOfMonth = getWeekOfMonth(dateFromYearMonthDay(date.get()), firstDayOfWeekIndex.get()) - 1
          return getInterpolate({
            0: 0,
            [moveHeight]: perHeight * weekOfMonth
          }, extrapolationClamp)
        })
        const interpolateH = memoFun(() => {
          const moveHeight = perSize() * 6
          return getInterpolate({
            0: perSize() * 6,
            [moveHeight]: 0
          }, extrapolationClamp)
        })
        fdom.div({
          className: 'overflow-hidden bg-neutral relative',
          s_height() {
            const y = calendarScrollY.get()
            return interpolateH(y) + 'px'
          },
          children() {

            fdom.div({
              s_height() {
                return perSize() * 6 + 'px'
              },
              s_transform() {
                const ty = Math.max(calendarScrollY.get(), 0)
                return `translateY(${-interpolateY(ty)}px)`
              },
              children() {
                for (let y = 0; y < 6; y++) {
                  fdom.div({
                    className: 'flex items-center justify-center',
                    children() {
                      for (let x = 0; x < 7; x++) {
                        const fd = yearMonth.fullDayOf(x, y)
                        let c = yearMonth
                        if (fd.type == 'last') {
                          c = yearMonth.lastMonth()
                        } else if (fd.type == 'next') {
                          c = yearMonth.nextMonth()
                        }
                        const sd = SolarDay.fromYmd(c.year, c.month, fd.day)
                        const lunarDay = sd.getLunarDay()
                        const selected = memo(() => {
                          return fd.type == 'this' && selectCurrent() && date.get().day == fd.day
                        })
                        fdom.div({
                          className() {
                            return cns(
                              `flex-1 aspect-square cursor-pointer
                        flex flex-col items-center justify-center gap-1 `,
                              fd.type != 'this' && 'opacity-30'
                            )
                          },
                          onClick() {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, fd.day))
                          },
                          children() {
                            fdom.div({
                              className: 'flex items-center justify-center relative aspect-square p-1',
                              children() {
                                renderIf(selected, () => {
                                  fdom.div({
                                    id: selectShadowCell,
                                    className() {
                                      return cns(
                                        `absolute inset-0 ring-1 rounded-full ring-accent`
                                      )
                                    }
                                  })
                                })
                                fdom.span({
                                  className: 'relative text-primary-content text-label-large',
                                  childrenType: 'text',
                                  children: fd.day
                                })
                              }
                            })
                            fdom.div({
                              className: 'text-label-small text-primary-content',
                              childrenType: "text",
                              children: lunarDay.getName()
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      })
    }
  })
}