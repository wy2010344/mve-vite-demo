import { fdom, FDomAttributes, renderText, renderTextContent } from "mve-dom";
import { hookTrackSignal, renderIf, renderOne } from "mve-helper";
import { LunarDay, SolarDay } from "tyme4ts";
import { cns, signalAnimateFrame, subscribeEventListener } from "wy-dom-helper";
import { addEffect, batchSignalEnd, cacheVelocity, createSignal, dateFromYearMonthDay, DAYMILLSECONDS, destinationWithMarginTrans, easeFns, emptyFun, extrapolationClamp, getInterpolate, getSpringBaseAnimationConfig, getTweenAnimationConfig, GetValue, getWeekOfMonth, memo, MomentumIScroll, MonthFullDay, PagePoint, run, SignalAnimateFrameValue, startScroll, StoreRef, tw, ValueOrGet, WeekVirtualView, yearMonthDayEqual, YearMonthVirtualView } from "wy-helper";
import explain from "../explain";
import { onlyMobile } from "../onlyMobile";
import { animate } from "motion";
import { pointerMoveDirWithLock } from "wy-dom-helper";



const WEEKS = ["一", "二", "三", "四", "五", "六", "日"]
const WEEKTIMES = 7 * DAYMILLSECONDS
function createYM() {
  const d = new Date()
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate()
  }
}
export default function () {
  explain(() => {

  })
  const isMobile = onlyMobile()
  renderOne(isMobile, function (showType) {
    console.log("showType", showType)
    if (showType == 'mobile') {
      fdom.div({
        className: 'w-full h-full',
        children() {
          calendar(window.innerWidth, true)
        }
      })

    } else if (showType == 'contain-mobile' || showType == 'also-mobile') {
      fdom.div({
        className: 'daisy-mockup-phone',
        children() {
          fdom.div({
            className: 'daisy-mockup-phone-camera'
          })
          fdom.div({
            className: 'daisy-mockup-phone-display bg-base-100 daisy-card flex flex-col items-stretch',
            children() {
              fdom.div({
                className: 'h-10'
              })
              fdom.div({
                className: 'flex-1 min-h-0',
                children() {

                  calendar(390)
                }
              })
            }
          })
        }
      })
    } else {

    }
  })

}

const selectShadowCell = 'select-cell'
function calendar(fullWidth: number, fullScreen?: boolean) {
  const date = createSignal(createYM())
  const yearMonth = memo(() => {
    const d = date.get()
    return new YearMonthVirtualView(d.year, d.month, 0)
  })
  const week = memo(() => {
    const d = date.get()
    return WeekVirtualView.from(d.year, d.month, d.day, 0)
  })
  const transY = signalAnimateFrame(0)
  let content: HTMLElement
  const bs = MomentumIScroll.get()
  function perSize() {
    return fullWidth / 7
  }
  const showWeek = memo(() => transY.get() <= -5 * perSize());
  const transX = signalAnimateFrame(0)
  /**
   * 
   * @param direction 1向左,-1向右
   * @param velocity 
   */
  function updateDirection(direction: number, velocity = 0) {
    if (direction) {
      const diffWidth = direction * container.clientWidth
      transX.changeTo(
        -diffWidth,
        getSpringBaseAnimationConfig({
          initialVelocity: velocity
        }),
        {
          onFinish: onScrollEnd
        })
      transX.slientDiff(diffWidth)
    } else {
      transX.changeTo(
        0,
        getSpringBaseAnimationConfig({
          initialVelocity: velocity
        }),
        {
          onFinish: onScrollEnd
        })
    }
  }
  function updateDirectionScroll(direction: number) {
    if (showWeek()) {
      const m = dateFromYearMonthDay(date.get())
      if (direction < 0) {
        m.setTime(m.getTime() - WEEKTIMES)
      } else if (direction > 0) {
        m.setTime(m.getTime() + WEEKTIMES)
      }
      if (direction) {
        date.set({
          year: m.getFullYear(),
          month: m.getMonth() + 1,
          day: m.getDate()
        })
      }
    } else {
      if (direction < 0) {
        toggleCalendar(yearMonth().lastMonth())
      } else if (direction > 0) {
        toggleCalendar(yearMonth().nextMonth())
      }
    }
  }
  function toggleCalendar(c: YearMonthVirtualView) {
    if (date.get().day > c.days) {
      date.set({
        year: c.year,
        month: c.month,
        day: c.days
      })
    } else {
      date.set({
        year: c.year,
        month: c.month,
        day: date.get().day
      })
    }
  }
  function setCalenderData(fd: MonthFullDay) {
    let c: YearMonthVirtualView = yearMonth()
    let dir = 0
    if (fd.type == 'last') {
      c = yearMonth().lastMonth()
      dir = -1
    } else if (fd.type == 'next') {
      c = yearMonth().nextMonth()
      dir = 1
    }
    date.set({
      year: c.year,
      month: c.month,
      day: fd.day
    })
    if (!showWeek()) {
      onScroll.set('x')
      updateDirection(dir, 0)
    }
  }

  const onScroll = createSignal<'x' | 'y' | undefined>(undefined)
  function onScrollEnd() {
    onScroll.set(undefined)
  }

  hookTrackSignal(date.get, () => {
    const beforeCell = document.getElementById(selectShadowCell)
    if (beforeCell) {
      const box = beforeCell.getBoundingClientRect()
      addEffect(() => {
        const currentCell = document.getElementById(selectShadowCell)
        if (currentCell) {
          const box2 = currentCell.getBoundingClientRect()
          animate(currentCell, {
            x: [box.left - box2.left, 0],
            y: [box.top - box2.top, 0]
          })
        }
      }, 3)
    }
  })
  const container = fdom.div({
    s_height: '100%',
    s_overflow: 'hidden',
    s_userSelect: 'none',
    onTouchMove(e) {
      e.preventDefault()
    },
    onPointerDown: pointerMoveDirWithLock(onScroll, function (initE, e, dir) {
      if (dir == 'x') {
        //左右滑动
        const velocityX = cacheVelocity()
        velocityX.append(initE.timeStamp, initE.pageX)
        let lastPageX = initE.pageX
        function didMove(e: PointerEvent) {
          velocityX.append(e.timeStamp, e.pageX)
          transX.changeTo(e.pageX - lastPageX + transX.get())
          lastPageX = e.pageX
        }
        didMove(e)
        const destroyMove = subscribeEventListener(document, 'pointermove', didMove)
        const destroyEnd = subscribeEventListener(document, 'pointerup', e => {
          // velocityX.append(e.timeStamp, e.pageX)
          transX.changeTo(e.pageX - lastPageX + transX.get())
          const dis = bs.getWithSpeedIdeal(velocityX.get())
          const targetDis = dis.distance + transX.get()
          const absTargetDis = Math.abs(targetDis)
          if (absTargetDis < container.clientWidth / 2) {
            //恢复原状
            updateDirection(0, velocityX.get())
          } else {
            const direction = targetDis < 0 ? 1 : -1
            updateDirectionScroll(direction)
            updateDirection(direction, velocityX.get())
            batchSignalEnd()
          }
          destroyMove()
          destroyEnd()
        })
      } else {
        //上下滑动
        const m = startScroll(initE.pageY, {
          containerSize() {
            return container.clientHeight
          },
          contentSize() {
            return content.offsetHeight
          },
          getCurrentValue() {
            return transY.get()
          },
          changeTo(value) {
            transY.changeTo(value)
          },
          finish(v) {
            const out = bs.destinationWithMargin(v)
            destinationWithMarginTrans(out, transY, {
              targetSnap(n) {
                if (n < -perSize() * 3) {
                  return Math.min(-perSize() * 5, out.target)
                }
                return 0
              },
              event: {
                onFinish: onScrollEnd
              }
            })
          }
        })
        m.move(e.pageY)
        const destroyMove = subscribeEventListener(document, 'pointermove', e => {
          m.move(e.pageY)
        })
        const destroyEnd = subscribeEventListener(document, 'pointerup', e => {
          m.end(e.pageY)
          destroyMove()
          destroyEnd()
        })
      }
    })
    ,
    children() {
      content = fdom.div({
        s_transform() {
          return `translateY(${transY.get()}px)`
        },
        // 至少要折叠到星期
        s_minHeight: `calc(100% + ${fullScreen ? '500vw' : fullWidth * 5 + 'px'} / 7)`,
        children() {
          //header
          fdom.div({
            s_display: 'flex',
            s_alignItems: 'stretch',
            s_transform() {
              const ty = Math.min(transY.get(), 0)
              return `translateY(${-ty}px)`
            },
            children() {
              fdom.h1({
                childrenType: "text",
                s_fontSize: '48px',
                s_lineHeight: '48px',
                children() {
                  return date.get().month
                }
              })
              fdom.div({
                children() {
                  fdom.div({
                    childrenType: "text",
                    children() {
                      return date.get().year
                    }
                  })
                  fdom.div({
                    childrenType: "text",
                    children() {
                      return `月 ${date.get().day}日`
                    }
                  })
                }
              })
              // fdom.div({
              //   childrenType: "text",
              //   children() {
              //     return showWeek() ? '周' : '月'
              //   }
              // })
            }
          })

          //星期
          fdom.div({
            s_display: 'flex',
            s_alignItems: 'center',
            s_justifyContent: 'space-between',
            s_transform() {
              const ty = Math.min(transY.get(), 0)
              return `translateY(${-ty}px)`
            },
            children() {
              for (let i = 0; i < 7; i++) {
                fdom.div({
                  s_flex: 1,
                  s_aspectRatio: 1,
                  s_display: 'flex',
                  s_alignItems: 'center',
                  s_justifyContent: 'center',
                  childrenType: "text",
                  children() {
                    return WEEKS[yearMonth().weekDay(i)]
                  }
                })
              }
            }
          })

          const interpolateH = run(() => {
            const moveHeight = perSize() * 5
            return getInterpolate({
              0: perSize() * 6,
              [-moveHeight]: perSize()
            }, extrapolationClamp)
          })
          fdom.div({
            s_overflow: 'hidden',
            s_height() {
              const y = transY.get()
              return interpolateH(y) + 'px'
            },
            s_transform() {
              const ty = Math.min(transY.get(), 0)
              return `translateY(${-ty}px)`
            },
            children() {
              fdom.div({
                s_position: 'relative',
                s_transform() {
                  return `translateX(${transX.get()}px)`
                },
                children() {
                  //前一部分
                  renderIf(showWeek, () => {
                    renderWeek(() => week().beforeWeek(), 0)
                  }, () => {
                    //显示月份
                    renderCalendarView(
                      () => yearMonth().lastMonth(),
                      0)
                  })

                  //中间部分

                  renderCalendarView(
                    yearMonth,
                    1)

                  //后面部分
                  //前一部分
                  renderIf(showWeek, () => {
                    renderWeek(() => week().nextWeek(), 2)
                  }, () => {
                    //显示月份
                    renderCalendarView(
                      () => yearMonth().nextMonth(),
                      2)
                  })
                }
              })
            }
          })
        }
      })
    }
  })

  function renderCalendarView(
    yearMonth: GetValue<YearMonthVirtualView>,
    i: number
  ) {
    function selectCurrent() {
      const d = date.get()
      const ym = yearMonth()
      return d.year == ym.year && d.month == ym.month
    }
    const arg: FDomAttributes<"div"> = {}
    if (i == 1) {
      const interpolateY = memo(() => {
        const perHeight = perSize()
        const moveHeight = perHeight * 5
        const weekOfMonth = getWeekOfMonth(dateFromYearMonthDay(date.get())) - 1
        return getInterpolate({
          0: 0,
          [-moveHeight]: -perHeight * weekOfMonth
        }, extrapolationClamp)
      })
      arg.s_transform = () => {
        const y = transY.get()
        return ` translateY(${interpolateY()(y)}px)`
      }
    } else {
      arg.s_position = 'absolute'
      arg.s_inset = 0
      arg.s_transform = `translateX(${(i - 1) * 100}%)`
    }
    arg.children = () => {
      for (let y = 0; y < 6; y++) {
        fdom.div({
          s_display: 'flex',
          s_alignItems: 'center',
          s_justifyContent: 'center',
          children() {
            for (let x = 0; x < 7; x++) {

              const fullday = memo(() => yearMonth().fullDayOf(x, y))
              const lunarDay = memo(() => {
                let c = yearMonth()
                const fd = fullday()
                if (fd.type == 'last') {
                  c = yearMonth().lastMonth()
                } else if (fd.type == 'next') {
                  c = yearMonth().nextMonth()
                }
                const sd = SolarDay.fromYmd(c.year, c.month, fd.day)
                return sd.getLunarDay()
              })
              const selected = memo(() => {
                return fullday().type == 'this' && selectCurrent() && date.get().day == fullday().day
              })

              renderCell({
                day() {
                  return fullday().day
                },
                onClick() {
                  setCalenderData(fullday())
                },
                lunarDay,
                selected,
                hide() {
                  if (showWeek()) {
                    return false
                  }
                  return fullday().type != 'this'
                }
              })
            }
          }
        })
      }
    }
    return fdom.div(arg)
  }

  function renderWeek(
    week: GetValue<WeekVirtualView>,
    i: number
  ) {

    const arg: FDomAttributes<"div"> = {
      s_display: 'flex',
      s_alignItems: 'center',
      s_justifyContent: 'space-between',
      s_alignSelf: 'flex-start'
    }
    if (i != 1) {
      arg.s_position = 'absolute'
      arg.s_inset = 0
      arg.s_transform = `translateX(${(i - 1) * 100}%)`
    }
    arg.children = () => {

      for (let x = 0; x < 7; x++) {
        const md = memo(() => week().cells[x])
        const lunarDay = memo(() => {
          const sd = SolarDay.fromYmd(md().year, md().month, md().day)
          return sd.getLunarDay()
        })
        renderCell({
          hide() {
            return false;
          },
          day() {
            return md().day
          },
          lunarDay,
          selected() {
            return yearMonthDayEqual(md(), date.get())
          },
          onClick() {

          },
        })
      }
    }
    fdom.div(arg)
  }
}



function renderCell({
  day,
  lunarDay,
  hide,
  selected,
  onClick
}: {
  day: ValueOrGet<number>
  hide: GetValue<boolean>
  lunarDay: GetValue<LunarDay>,
  selected: GetValue<boolean>
  onClick(): void
}) {
  fdom.div({
    s_flex: 1,
    s_aspectRatio: 1,
    s_display: 'flex',
    s_flexDirection: 'column',
    s_alignItems: 'center',
    s_justifyContent: 'center',
    className() {
      return hide() ? tw` opacity-30` : ''
    },
    onClick,
    children() {
      fdom.div({
        s_aspectRatio: 1,
        s_display: 'grid',
        s_placeItems: 'center',
        s_position: 'relative',
        children() {
          fdom.div({
            id() {
              return selected() ? selectShadowCell : ''
            },
            className() {
              return cns(
                tw`absolute inset-0  rounded-full z-0`,
                selected() && tw`bg-primary`
              )
            }
          })
          fdom.span({
            s_position: 'relative',
            className() {
              return cns(
                selected() ? tw`text-primary-content` : tw`text-base-content`,
                tw`transition-all`
              )
            },
            childrenType: 'text',
            children: day
          })
        }
      })

      fdom.div({
        s_fontSize: '10px',
        childrenType: 'text',
        className: 'text-neutral-500',
        children() {
          return lunarDay().getName()
        }
      })
    }
  })
}