import { fdom } from "mve-dom";
import { addEffect, batchSignalEnd, createSignal, defaultSpringBaseAnimationConfig, memo, MomentumIScroll, numberIntFillWithN0, simpleEqualsEqual, tw, YearMonthDayVirtualView, YearMonthVirtualView, WeekVirtualView, StoreRef, GetValue, dateFromYearMonthDay } from "wy-helper";
import { hookTrackSignal, memoArray, renderArray } from "mve-helper";
import { cns, pointerMoveDir, signalAnimateFrame } from "wy-dom-helper";
import hookTrackLayout from "./hookTrackLayout";
import { movePage } from "./movePage";
import { firstDayOfWeekIndex, WEEKTIMES } from "./firstDayOfWeek";
import renderHeader, { selectShadowCell } from "./renderCalendar";
import renderCalendar from "./renderCalendar";
import { topContext } from "./context";

const bs = MomentumIScroll.get()
export default function (
  date: StoreRef<YearMonthDayVirtualView>,
  getFullWidth: GetValue<number>
) {
  const showCalendar = createSignal(false)
  const { calendarScrollY } = topContext.consume()
  hookTrackLayout(date.get, selectShadowCell)
  //打开日历的高度
  hookTrackSignal(showCalendar.get, function (show) {
    if (show) {
      //展开
      addEffect(() => {
        calendarScrollY.changeTo(0, defaultSpringBaseAnimationConfig, {
          from: TRANSY_OPEN_CALENDAR()
        })
      })
    }
  })

  hookTrackSignal(() => {
    return calendarScrollY.get()
  }, function (scrollY) {
    if (showCalendar.get() && scrollY > TRANSY_OPEN_CALENDAR()) {
      addEffect(() => {
        if (showCalendar.get()) {
          showCalendar.set(false)
          /**
           * @todo 需要触发边界回弹
           */
          // currentScrollY().slientDiff(TRANSY_OPEN_CALENDAR() - currentScrollY().get())
          batchSignalEnd()
        }
      })
    }
  })
  const yearMonth = memo<YearMonthVirtualView>((m) => {
    const d = date.get()
    return new YearMonthVirtualView(d.year, d.month, firstDayOfWeekIndex.get())
  })
  const week = memo(() => {
    const d = date.get()
    return WeekVirtualView.from(d.year, d.month, d.day, firstDayOfWeekIndex.get())
  })

  function TRANSY_OPEN_CALENDAR() {
    return 6 * getFullWidth() / 7
  }
  //顶部固定区域
  fdom.div({
    className: "relative",
    children() {
      //星期与天都需要滚动
      const scrollX = signalAnimateFrame(0)
      hookTrackSignal(memo<YearMonthVirtualView>(oldMonth => {
        const ym = yearMonth()
        if (oldMonth && showCalendar.get()) {
          const direction = Math.sign(ym.toNumber() - oldMonth.toNumber())
          if (direction) {
            mp.changePage(direction)
          }
        }
        return ym
      }))

      hookTrackSignal(memo<WeekVirtualView>(oldWeek => {
        const w = week()
        if (oldWeek && !showCalendar.get()) {
          const direction = Math.sign(w.cells[0].toNumber() - oldWeek.cells[0].toNumber())
          if (direction) {
            mp.changePage(direction)
          }
        }
        return w
      }))


      const mp = movePage(scrollX, getContainerWidth)
      function getContainerWidth() {
        return container.clientWidth
      }
      const container = fdom.div({
        className: 'overflow-hidden bg-primary touch-none',
        onPointerDown: pointerMoveDir(function (e, dir) {
          if (dir == 'x') {
            return mp.pointerDown(e, bs, (direction) => {
              if (showCalendar.get()) {
                //切换月份
                const c = direction < 0 ? yearMonth().lastMonth() : yearMonth().nextMonth()
                if (date.get().day > c.days) {
                  date.set(YearMonthDayVirtualView.from(c.year, c.month, c.days))
                } else {
                  date.set(YearMonthDayVirtualView.from(c.year, c.month, date.get().day))
                }
              } else {
                //切换周

                const m = dateFromYearMonthDay(date.get())
                m.setTime(m.getTime() + direction * WEEKTIMES)
                if (direction) {
                  date.set(YearMonthDayVirtualView.fromDate(m))
                }
              }
            })
          } else {
            if (showCalendar.get()) {
              //是展示日历的


            }
          }
        }),
        children() {
          //滚动区域
          fdom.div({
            className: 'relative',
            s_transform() {
              return `translateX(${-scrollX.get()}px)`
            },
            children() {
              renderArray(memoArray(() => {
                const ym = yearMonth()
                return [ym.lastMonth(), ym, ym.nextMonth()]
              }, simpleEqualsEqual), function (yearMonth, getIndex) {
                renderCalendar(
                  yearMonth,
                  getIndex,
                  calendarScrollY,
                  showCalendar.get,
                  date,
                  getFullWidth)
              })
            }
          })
        }
      })
      //这个是固定的
      fdom.div({
        className: 'w-full h-11 flex justify-between items-center [padding-inline:18px] bg-primary z-10',
        children() {
          fdom.h1({
            className() {
              return cns(
                'text-2xl text-primary-content font-bold',
                calendarScrollY.getAnimateConfig() ? tw`cursor-not-allowed` : tw`cursor-pointer`
              )
            },
            childrenType: 'text',
            children() {
              const d = date.get()
              return `${numberIntFillWithN0(d.month, 2)}-${numberIntFillWithN0(d.day, 2)}`
            },
            onClick() {
              if (calendarScrollY.getAnimateConfig()) {
                return
              }
              if (showCalendar.get()) {
                //为了使越界触发
                calendarScrollY.animateTo(TRANSY_OPEN_CALENDAR() + 1)
              } else {
                showCalendar.set(true)
              }
            }
          })

          fdom.div({
            className: 'text-primary-content',
            children() {
              fdom.span({
                className: 'mr-[0.125em] text-2xl',
                childrenType: 'text',
                children: '¥'
              })
              fdom.span({
                className: 'text-2xl',
                childrenType: 'text',
                children: '23'
              })
              fdom.sup({
                className: 'opacity-50 text-[0.75em] -top-[0.75em]',
                childrenType: 'text',
                children: '.00'
              })
            }
          })
        }
      })
    }
  })

}