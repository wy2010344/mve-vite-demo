import { fdom, mdom } from "mve-dom";
import { hookTrackSignal, memoArray, renderArray, renderIf } from "mve-helper";
import { LunarDay, SolarDay } from "tyme4ts";
import { cns, pointerMoveDir, animateSignal } from "wy-dom-helper";
import { createSignal, dateFromYearMonthDay, DAYMILLSECONDS, YearMonthDayVirtualView, dragSnapWithList, extrapolationClamp, getInterpolate, GetValue, getWeekOfMonth, memo, simpleEqualsEqual, tw, WeekVirtualView, yearMonthDayEqual, YearMonthVirtualView, getWeekOfYear, YearMonthDay, addEffect, simpleEqualsNotEqual, memoFun, ScrollFromPage, eventGetPageY, overScrollSlow, FrictionalFactory, spring, defaultSpringAnimationConfig, } from "wy-helper";
import explain from "../explain";
import { renderMobileView } from "../onlyMobile";
import hookTrackLayout from "../daily-record/hookTrackLayout";
import { movePage } from "../daily-record/movePage";
import firstDayOfWeek, { firstDayOfWeekIndex, WEEKS, WEEKTIMES } from "../daily-record/firstDayOfWeek";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";
import demoList from "../daily-record/demoList";
import { faker } from "@faker-js/faker";
import { fchmod } from "fs";



const selectShadowCell = 'select-cell'

export default function () {
  explain(() => {

  })
  renderMobileView(function ({
    width: getFullWidth,
  }, mock) {

    if (mock) {
      fixRightTop(function () {
        firstDayOfWeek()
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

    const scrollY = animateSignal(0)
    let content: HTMLElement
    const bs = FrictionalFactory.get()
    const bs2 = FrictionalFactory.get(0.05)
    function perSize() {
      return getFullWidth() / 7
    }
    const showWeek = memo(() => scrollY.get() >= 5 * perSize());
    const calendarScrollX = animateSignal(0)

    const interpolateY = memoFun(() => {
      const perHeight = perSize()
      const moveHeight = perHeight * 5
      const weekOfMonth = getWeekOfMonth(dateFromYearMonthDay(date.get()), firstDayOfWeekIndex.get()) - 1
      return getInterpolate({
        0: 0,
        [moveHeight]: -perHeight * weekOfMonth
      }, extrapolationClamp)
    })

    const bodyScrollX = animateSignal(0)


    let lastDate = date.get()
    hookTrackSignal(() => bodyScrollX.onAnimation(), function (c) {
      if (!c) {
        if (!lastDate.equals(date.get())) {
          addEffect(() => {
            if (showWeek()) {
              scrollY.changeTo(perSize() * 5, spring({
                config: {
                  zta: 0.7,
                  omega0: 20,
                }
              }))
            } else {
              scrollY.changeTo(0, spring({
                config: {
                  zta: 0.7,
                  omega0: 20,
                }
              }))
            }
            // setTimeout(() => {
            // }, 200)
          })
        }
        lastDate = date.get()
      }
    })
    hookTrackSignal(memo<YearMonthVirtualView>(oldMonth => {
      const ym = yearMonth()
      if (oldMonth && !showWeek()) {
        const direction = Math.sign(ym.toNumber() - oldMonth.toNumber())
        if (direction) {
          mp.changePage(direction)
        }
      }
      return ym
    }))
    hookTrackSignal(memo<WeekVirtualView>(oldWeek => {
      const w = week()
      if (oldWeek && showWeek()) {
        const direction = Math.sign(w.cells[0].toNumber() - oldWeek.cells[0].toNumber())
        if (direction) {
          mp.changePage(direction)
        }
      }
      return w
    }))

    function getContainerWidth() {
      return container.clientWidth
    }
    const mp = movePage(calendarScrollX, getContainerWidth)
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
      onPointerDown: pointerMoveDir(function (e, dir) {
        if (dir == 'y') {
          //上下滑动
          return ScrollFromPage.from(e, {
            getPage: eventGetPageY,
            scrollDelta(delta) {
              const y = scrollY.get()
              scrollY.set(
                y +
                overScrollSlow(y, delta, container.clientHeight, content.offsetHeight)
              )
            },
            onFinish(velocity) {
              const snap = dragSnapWithList([
                {
                  beforeForce: 0.005,
                  size: perSize() * 5,
                  afterForce: 0.005
                }
              ])
              bs.destinationWithMarginIscroll({
                scroll: scrollY,
                velocity,
                containerSize: container.clientHeight,
                contentSize: content.offsetHeight,
                targetSnap: snap,
                edgeBackConfig: defaultSpringAnimationConfig,
                edgeConfig(velocity) {
                  return bs2.getFromVelocity(velocity).animationConfig('in')
                },
              })
            }
          })
        }
      }),
      children() {
        content = fdom.div({
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
                  onPointerDown: pointerMoveDir(function (e, dir) {
                    if (dir == 'x') {
                      return mp.pointerDown(e, bs, (direction) => {
                        if (showWeek()) {
                          //星期
                          const m = dateFromYearMonthDay(date.get())
                          m.setTime(m.getTime() + direction * WEEKTIMES)
                          if (direction) {
                            date.set(YearMonthDayVirtualView.fromDate(m))
                          }
                        } else {
                          //月份
                          const c = direction < 0 ? yearMonth().lastMonth() : yearMonth().nextMonth()
                          if (date.get().day > c.days) {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, c.days))
                          } else {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, date.get().day))
                          }
                        }
                      })
                    }
                  }),
                  children() {
                    fdom.div({
                      s_position: 'relative',
                      s_transform() {
                        return `translateX(${-calendarScrollX.get()}px)`
                      },
                      children() {
                        renderIf(showWeek, function () {

                          renderArray(memoArray(() => {
                            const w = week()
                            return [w.beforeWeek(), w, w.nextWeek()]
                          }, simpleEqualsEqual), function (w, i) {
                            renderWeek(w, i)
                          })
                        }, function () {
                          renderArray(memoArray(() => {
                            const ym = yearMonth()
                            return [ym.lastMonth(), ym, ym.nextMonth()]
                          }, simpleEqualsEqual), function (m, i) {
                            renderCalendarView(m, i)
                          })
                        })
                      }
                    })
                  }
                })
              }
            })


            hookTrackSignal(memo<YearMonthDayVirtualView>((lastDate) => {
              const d = date.get()
              if (lastDate) {
                const lastTime = dateFromYearMonthDay(lastDate).valueOf()
                const thisTime = dateFromYearMonthDay(d).valueOf()
                const diff = thisTime - lastTime
                let direction = 0
                if (diff >= DAYMILLSECONDS) {
                  direction = 1
                } else if (diff <= -DAYMILLSECONDS) {
                  direction = -1
                }
                if (direction) {
                  mp2.changePage(direction)
                }
              }
              return d
            }))
            const mp2 = movePage(bodyScrollX, getContainerWidth)
            fdom.div({
              className: ' flex-1',
              onPointerDown: pointerMoveDir(function (e, dir) {
                if (dir == 'x') {
                  return mp2.pointerDown(e, bs, direction => {
                    const m = dateFromYearMonthDay(date.get())
                    m.setTime(m.getTime() + direction * DAYMILLSECONDS)
                    if (direction) {
                      date.set(YearMonthDayVirtualView.fromDate(m))
                    }
                  })
                }
              }),
              children() {
                fdom.div({
                  className: 'relative',
                  s_transform() {
                    return `translateX(${-bodyScrollX.get()}px)`
                  },
                  children() {
                    renderArray(memoArray(() => {
                      const d = date.get()
                      return [d.beforeDay(), d, d.nextDay()]
                    }, simpleEqualsEqual), function (w, getIndex) {
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


