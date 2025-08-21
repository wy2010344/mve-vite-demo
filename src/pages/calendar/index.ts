import { fdom, mdom } from "mve-dom";
import { hookTrackSignal, renderArray, renderArrayKey, renderIf } from "mve-helper";
import { LunarDay, SolarDay } from "tyme4ts";
import { cns, animateSignal, pointerMove } from "wy-dom-helper";
import { createSignal, dateFromYearMonthDay, DAYMILLSECONDS, YearMonthDayVirtualView, dragSnapWithList, extrapolationClamp, getInterpolate, GetValue, getWeekOfMonth, memo, simpleEqualsEqual, tw, WeekVirtualView, yearMonthDayEqual, YearMonthVirtualView, getWeekOfYear, YearMonthDay, addEffect, simpleEqualsNotEqual, memoFun, Compare, PointKey, } from "wy-helper";
import explain from "../../explain";
import { renderMobileView } from "../../onlyMobile";
import fixRightTop from "../../fixRightTop";
import themeDropdown from "../../themeDropdown";
import demoList from "../daily-record/demoList";
import { faker } from "@faker-js/faker";
import { createSimpleMovePage, movePage, OnScroll } from 'mve-dom-helper'
import {
  hookTrackLayout,
  chooseFirstDayOfWeek,
  firstDayOfWeekIndex,
  WEEKTIMES,
  WEEKS
} from 'daisy-mobile-helper'
import { renderForEach } from "mve-core";


const selectShadowCell = 'select-cell'

export default function () {
  explain(() => {

  })
  renderMobileView(function ({
    width: getFullWidth,
  }, mock) {

    if (mock) {
      fixRightTop(function () {
        chooseFirstDayOfWeek()
        themeDropdown()
      })
    }
    const date = createSignal(YearMonthDayVirtualView.fromDate(new Date()), simpleEqualsNotEqual)
    const yearMonth = memo<YearMonthVirtualView>((m) => {
      const d = date.get()
      return new YearMonthVirtualView(d.year, d.month, firstDayOfWeekIndex.get())
    })
    const week = memo(() => {
      const d = date.get()
      return WeekVirtualView.from(d.year, d.month, d.day, firstDayOfWeekIndex.get())
    })
    //debug
    const w = window as any
    w.__date = date

    const scrollY: OnScroll = new OnScroll('y', {
      maxScroll() {
        return maxScrollY.get()
      },
      targetSnap: dragSnapWithList([
        {
          beforeForce: 1,
          size: perSize() * 5,
          afterForce: 1
        }
      ])
    })
    const maxScrollY = scrollY.measureMaxScroll()
    function perSize() {
      return getFullWidth() / 7
    }
    const showWeek = memo(() => scrollY.get() >= 5 * perSize());
    const interpolateY = memoFun(() => {
      const perHeight = perSize()
      const moveHeight = perHeight * 5
      const weekOfMonth = getWeekOfMonth(dateFromYearMonthDay(date.get()), firstDayOfWeekIndex.get()) - 1
      return getInterpolate({
        0: 0,
        [moveHeight]: -perHeight * weekOfMonth
      }, extrapolationClamp)
    })

    const bodyScrollX = createSimpleMovePage({
      direction: 'x',
      getValue: date.get,
      // getSize: getContainerWidth,
      compare(d, lastDate) {
        const lastTime = dateFromYearMonthDay(lastDate).valueOf()
        const thisTime = dateFromYearMonthDay(d).valueOf()
        const diff = thisTime - lastTime
        let direction = 0
        if (diff >= DAYMILLSECONDS) {
          direction = 1
        } else if (diff <= -DAYMILLSECONDS) {
          direction = -1
        }
        return direction
      },
      callback(direction) {
        const m = dateFromYearMonthDay(date.get())
        m.setTime(m.getTime() + direction * DAYMILLSECONDS)
        date.set(YearMonthDayVirtualView.fromDate(m))
      },
    })


    let lastDate = date.get()
    hookTrackSignal(() => bodyScrollX.onAnimation(), function (c) {
      if (!c) {
        if (!lastDate.equals(date.get())) {
          addEffect(() => {
            if (showWeek()) {
              /** 
               * config: {
                  zta: 0.7,
                  omega0: 20,
                }
               */
              scrollY.animateTo(perSize() * 5)
            } else {
              scrollY.animateTo(0)
            }
          })
        }
        lastDate = date.get()
      }
    })
    function getContainerWidth() {
      return container.clientWidth
    }
    const scrollX = movePage({
      getSize() {
        return container.clientWidth
      }
    })
    hookTrackLayout(date.get, selectShadowCell)

    const interpolateH = memoFun(() => {
      const moveHeight = perSize() * 5
      return getInterpolate({
        0: perSize() * 7,
        [moveHeight]: perSize() * 2
      }, extrapolationClamp)
    })

    const container = fdom.div({
      s_height: '100%',
      s_overflow: 'hidden',
      s_userSelect: 'none',
      onTouchMove(e) {
        e.preventDefault()
      },
      onWheel: scrollY.wheelEventListener,
      onPointerDown: scrollY.pointerEventListner,
      children(container: HTMLElement) {
        scrollX.hookCompare(week, function (a, b) {
          if (showWeek()) {
            return a.cells[0].toNumber() - b.cells[0].toNumber()
          }
          return 0
        })
        scrollX.hookCompare(yearMonth, function (a, b) {
          if (showWeek()) {
            return 0
          }
          return a.toNumber() - b.toNumber()
        })
        const content = fdom.div({
          s_transform() {
            return `translateY(${-scrollY.get()}px)`
          },
          className: 'flex flex-col',
          // 至少要折叠到星期
          s_minHeight() {
            return `calc(100% + ${getFullWidth()}px * 5 / 7)`
          },
          children() {
            //header
            fdom.div({
              className: "bg-base-100 relative z-10",
              s_display: 'flex',
              s_alignItems: 'stretch',
              s_transform() {
                const ty = Math.max(scrollY.get(), 0)
                return `translateY(${ty}px)`
              },
              children() {
                fdom.h1({
                  className: 'text-display-large',
                  childrenType: "text",
                  children() {
                    return date.get().month
                  }
                })
                fdom.div({
                  className: 'flex flex-col items-start justify-center',
                  children() {
                    fdom.div({
                      className: 'text-title-large',
                      childrenType: "text",
                      children() {
                        return date.get().year
                      }
                    })
                    fdom.div({
                      className: 'text-title-medium',
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
            fdom.div({
              s_zIndex: 1,
              s_position: 'relative',
              s_height() {
                //容器本身的高度
                return perSize() * 7 + 'px'
              },
              children() {

                fdom.div({
                  className: "bg-base-300",
                  s_overflow: 'hidden',
                  s_height() {
                    const y = scrollY.get()
                    return interpolateH(y) + 'px'
                  },
                  s_transform() {
                    const ty = Math.max(scrollY.get(), 0)
                    return `translateY(${ty}px)`
                  },
                  onPointerDown(e) {
                    pointerMove(scrollX.getMoveEvent(e, 'x', {
                      callback(direction, velocity) {
                        if (showWeek()) {
                          //星期
                          const m = dateFromYearMonthDay(date.get())
                          m.setTime(m.getTime() + direction * WEEKTIMES)
                          if (direction) {
                            date.set(YearMonthDayVirtualView.fromDate(m))
                          }
                        } else {
                          //月份
                          const c = direction < 0 ? yearMonth().lastMonth() : yearMonth().nextMonth();
                          if (date.get().day > c.days) {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, c.days));
                          } else {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, date.get().day));
                          }
                        }
                      },
                    }))
                  },
                  children() {
                    fdom.div({
                      s_position: 'relative',
                      s_transform() {
                        return `translateX(${-scrollX.get()}px)`
                      },
                      children() {
                        renderIf(showWeek, function () {

                          renderArrayKey(() => {
                            const w = week()
                            return [w.beforeWeek(), w, w.nextWeek()] as const
                          }, v => v.cells[0].toNumber(), function (w, i) {
                            renderWeek(w(), i)
                          })
                        }, function () {
                          renderArrayKey(() => {
                            const ym = yearMonth()
                            return [ym.lastMonth(), ym, ym.nextMonth()] as const
                          }, v => v.toNumber(), function (m, i) {
                            renderCalendarView(m(), i)
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
            fdom.div({
              className: ' flex-1',
              data_a: '99',
              plugins: [
                bodyScrollX.plugin
              ],
              children() {
                fdom.div({
                  className: 'relative',
                  s_transform() {
                    return `translateX(${-bodyScrollX.get()}px)`
                  },
                  children() {
                    renderArrayKey(() => {
                      const d = date.get()
                      return [d.beforeDay(), d, d.nextDay()]
                    }, v => v.toNumber(), function (w, getIndex) {
                      mdom.div({
                        attrs(v) {
                          const i = getIndex()
                          if (i != 1) {
                            v.s_position = 'absolute'
                            v.s_inset = 0
                            v.s_transform = `translateX(${(i - 1) * 100}%)`
                          }
                        },
                        children() {
                          demoList(faker.number.int({
                            max: 17,
                            min: 15
                          }))
                        }
                      })
                    })
                  }
                })
              }
            })
          }
        })
        maxScrollY.hookInit(container, content)
      }
    })
    function renderCalendarView(
      yearMonth: YearMonthVirtualView,
      getIndex: GetValue<number>
    ) {
      function selectCurrent() {
        const d = date.get()
        const ym = yearMonth
        return d.year == ym.year && d.month == ym.month
      }
      return mdom.div({
        attrs(v) {
          const i = getIndex()
          if (i == 1) {
            const y = scrollY.get()
            v.s_transform = ` translateY(${interpolateY(y)}px)`
          } else {
            v.s_position = 'absolute'
            v.s_inset = 0
            v.s_transform = `translateX(${(i - 1) * 100}%)`
          }
        },
        children() {
          renderWeekHeader(() => {
            const y = scrollY.get()
            const ty = - interpolateY(y)
            return `translateY(${ty}px)`
          })
          fdom.div({
            children() {

              for (let y = 0; y < 6; y++) {
                fdom.div({
                  className: 'flex items-center justify-center relative',
                  children() {

                    for (let x = 0; x < 7; x++) {
                      const fullday = yearMonth.fullDayOf(x, y)
                      let c = yearMonth
                      if (fullday.type == 'last') {
                        c = yearMonth.lastMonth()
                      } else if (fullday.type == 'next') {
                        c = yearMonth.nextMonth()
                      }

                      renderFirstDayWeek(x, {
                        year: c.year,
                        month: c.month,
                        day: fullday.day
                      })

                      const sd = SolarDay.fromYmd(c.year, c.month, fullday.day)
                      const lunarDay = sd.getLunarDay()
                      const selected = memo(() => {
                        return fullday.type == 'this' && selectCurrent() && date.get().day == fullday.day
                      })

                      renderCell({
                        day: fullday.day,
                        onClick() {
                          date.set(
                            YearMonthDayVirtualView.from(c.year, c.month, fullday.day)
                          )
                        },
                        lunarDay,
                        selected,
                        hide() {
                          if (showWeek()) {
                            return false
                          }
                          return fullday.type != 'this'
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
    }

    function renderWeekHeader(transform?: GetValue<string>) {
      //星期
      fdom.div({
        className: "bg-base-300 relative z-10",
        s_display: 'flex',
        s_alignItems: 'center',
        s_justifyContent: 'space-between',
        s_transform: transform,
        children() {
          for (let i = 0; i < 7; i++) {
            fdom.div({
              className: 'flex-1 aspect-square flex items-center justify-center',
              childrenType: "text",
              children() {
                return WEEKS[yearMonth().weekDay(i)]
              }
            })
          }
        }
      })
    }
    function renderWeek(
      week: WeekVirtualView,
      getIndex: GetValue<number>
    ) {
      mdom.div({
        attrs(v) {
          v.className = 'self-start'
          const i = getIndex()
          if (i != 1) {
            v.s_position = 'absolute'
            v.s_inset = 0
            v.s_transform = `translateX(${(getIndex() - 1) * 100}%)`
          }
        },
        children() {
          renderWeekHeader()
          fdom.div({
            className: 'flex items-center justify-center relative',
            children() {
              for (let x = 0; x < 7; x++) {
                const md = week.cells[x]
                renderFirstDayWeek(x, md)

                const sd = SolarDay.fromYmd(md.year, md.month, md.day)
                const lunarDay = sd.getLunarDay()
                renderCell({
                  hide() {
                    return false;
                  },
                  day: md.day,
                  lunarDay,
                  selected() {
                    return yearMonthDayEqual(md, date.get())
                  },
                  onClick() {
                    date.set(md)
                  },
                })
              }
            }
          })
        }
      })
    }
  })
}

function renderFirstDayWeek(x: number, ym: YearMonthDay) {
  if (x == 0) {
    fdom.div({
      className: 'absolute left-0 text-label-small',
      childrenType: 'text',
      children() {
        return getWeekOfYear(dateFromYearMonthDay(ym), firstDayOfWeekIndex.get())
      }
    })
  }
}

function renderCell({
  day,
  lunarDay,
  hide,
  selected,
  onClick
}: {
  day: number
  hide: GetValue<boolean>
  lunarDay: LunarDay,
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
        children: lunarDay.getName()
      })
    }
  })
}


