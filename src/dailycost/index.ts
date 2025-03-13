import { fdom, mdom } from "mve-dom";
import { renderMobileView } from "../onlyMobile";
import { addEffect, batchSignalEnd, cacheVelocity, createSignal, dateFromYearMonthDay, DAYMILLSECONDS, defaultSpringBaseAnimationConfig, destinationWithMarginTrans, dragSnapWithList, extrapolationClamp, extrapolationExtend, extrapolationIdentity, getExtrapolationExtend, getInterpolate, getSpringBaseAnimationConfig, mapInterpolateRange, memo, mixNumber, MomentumIScroll, numberIntFillWithN0, run, simpleEqualsEqual, startScroll, tw, YearMonthDay, YearMonthDayVirtualView, YearMonthVirtualView } from "wy-helper";
import { hookTrackSignal, memoArray, renderArray, renderIf } from "mve-helper";
import { animateSignal } from "mve-dom-helper";
import { animate } from "motion";
import { SolarDay } from "tyme4ts";
import { cns, pointerMoveDir, signalAnimateFrame, subscribeEventListener } from "wy-dom-helper";
import hookTrackLayout from "./hookTrackLayout";
import { movePage, transSticky } from "./movePage";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";
import firstDayOfWeek, { firstDayOfWeekIndex, WEEKS } from "./firstDayOfWeek";
import demoList from "./demoList";
import { faker } from "@faker-js/faker";

const selectShadowCell = 'select-cell'

const bs = MomentumIScroll.get()
export default function () {

  renderMobileView(function (fullWidth, fullScreen) {
    if (!fullScreen) {
      fixRightTop(function () {
        firstDayOfWeek()
        themeDropdown()
      })
    }
    const date = createSignal(YearMonthDayVirtualView.fromDate(new Date()))
    const yearMonth = memo<YearMonthVirtualView>((m) => {
      const d = date.get()
      return new YearMonthVirtualView(d.year, d.month, firstDayOfWeekIndex.get())
    })
    const scrollX = signalAnimateFrame(0)

    hookTrackLayout(date.get, selectShadowCell)
    const scrollY = signalAnimateFrame(0)
    //打开日历的高度
    const TRANSY_OPEN_CALENDAR = 6 * fullWidth / 7
    const showCalendar = createSignal(false)

    hookTrackSignal(date.get, function () {
      addEffect(() => {
        scrollY.changeTo(0)
      })
    })
    hookTrackSignal(showCalendar.get, function (show) {
      if (show) {
        //展开
        addEffect(() => {
          scrollY.changeTo(0, defaultSpringBaseAnimationConfig, {
            from: TRANSY_OPEN_CALENDAR
          })
        })
      }
    })

    hookTrackSignal(() => {
      if (showCalendar.get()) {
        if (scrollY.get() > TRANSY_OPEN_CALENDAR) {
          //向下滚动
          return true
        }
        return false
      }
      return false
    }, function (close) {
      if (close) {
        addEffect(() => {
          showCalendar.set(false)
          scrollY.changeTo(0)
          batchSignalEnd()
        })
      }
    })

    function perSize() {
      return fullWidth / 7
    }
    let content: HTMLElement


    function getContainerWidth() {
      return container.clientWidth
    }
    const container = fdom.div({
      className: 'absolute inset-0 select-none bg-primary overflow-hidden',
      onTouchMove(e) {
        e.preventDefault()
      },
      onPointerDown: pointerMoveDir(function (e, dir) {
        if (dir == 'y') {
          const m = startScroll(e.pageY, {
            containerSize() {
              return container.clientHeight
            },
            contentSize() {
              return content.offsetHeight
            },
            getCurrentValue() {
              return scrollY.get()
            },
            changeTo(value) {
              scrollY.changeTo(value)
            },
            finish(v) {
              const out = bs.destinationWithMargin(v)
              if (showCalendar.get()) {
                const snap = dragSnapWithList([
                  {
                    beforeForce: 1,
                    size: perSize() * 6,
                    afterForce: 1,
                    //越界触发关闭日历
                    afterDiff: 1,
                  }
                ])
                destinationWithMarginTrans(out, scrollY, {
                  targetSnap: snap,
                })
              } else {
                destinationWithMarginTrans(out, scrollY, {
                })
              }
            },
          })
          return {
            onPointerMove(e) {
              m.move(e.pageY)
            },
            onPointerUp(e) {
              m.end(e.pageY)
            },
          }
        }
      }),
      children() {
        //home页面
        content = fdom.div({
          s_transform() {
            return `translateY(${-scrollY.get()}px)`
          },
          className: 'flex flex-col',
          s_minHeight() {
            if (showCalendar.get()) {
              return `calc(100% + ${fullScreen ? '600vw' : fullWidth * 6 + 'px'} / 7)`
            }
            return '100%'
          },
          children() {
            //这个需要snap
            fdom.div({
              className: 'flex bg-primary z-10',
              s_transform() {
                let minScrollHeight = 0
                // if (content && container) {
                //   minScrollHeight = container.clientHeight - content.offsetHeight
                // }
                return `translateY(${transSticky(scrollY, minScrollHeight)}px)`
              },
              children() {
                for (let i = 0; i < 7; i++) {
                  fdom.div({
                    className: 'flex-1 aspect-square flex items-center justify-center text-primary-content',
                    childrenType: "text",
                    children() {
                      return WEEKS[yearMonth().weekDay(i)]
                    }
                  })
                }
              }
            })


            renderIf(showCalendar.get, function () {
              fdom.div({
                s_height() {
                  return perSize() * 6 + 'px'
                },
                children() {

                  hookTrackSignal(memo<YearMonthVirtualView>(oldMonth => {
                    const ym = yearMonth()
                    if (oldMonth) {
                      const direction = Math.sign(ym.toNumber() - oldMonth.toNumber())
                      if (direction) {
                        mp.changePage(direction)
                      }
                    }
                    return ym
                  }))
                  const mp = movePage(scrollX, getContainerWidth)
                  const interpolateH = run(() => {
                    const moveHeight = perSize() * 6
                    return getInterpolate({
                      0: perSize() * 6,
                      [moveHeight]: 0
                    }, extrapolationClamp)
                  })
                  fdom.div({
                    className: 'overflow-hidden bg-primary',
                    s_transform() {
                      const ty = Math.max(scrollY.get(), 0)
                      return `translateY(${ty}px)`
                    },
                    s_height() {
                      const y = scrollY.get()
                      return interpolateH(y) + 'px'
                    },
                    onPointerDown: pointerMoveDir(function (e, dir) {
                      if (dir == 'x') {
                        return mp.pointerDown(e, bs, (direction) => {
                          const c = direction < 0 ? yearMonth().lastMonth() : yearMonth().nextMonth()
                          if (date.get().day > c.days) {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, c.days))
                          } else {
                            date.set(YearMonthDayVirtualView.from(c.year, c.month, date.get().day))
                          }
                        })
                      }
                    }),
                    children() {
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
                          })
                        }
                      })
                    }
                  })
                }
              })
            })
            fdom.div({

              s_transform() {
                if (showCalendar.get()) {
                  const y = scrollY.get()
                  if (y > TRANSY_OPEN_CALENDAR) {
                    return `translateY(${y - TRANSY_OPEN_CALENDAR}px)`
                  }
                  return `translateY(0px)`
                } else {
                  let minScrollHeight = 0
                  // if (content && container) {
                  //   minScrollHeight = container.clientHeight - content.offsetHeight
                  // }
                  return `translateY(${transSticky(scrollY, minScrollHeight)}px)`
                }
              },
              className: 'w-full h-11 flex justify-between items-center [padding-inline:18px] bg-primary z-10',
              children() {
                fdom.h1({
                  className() {
                    return cns(
                      'text-2xl text-primary-content font-bold',
                      scrollY.getAnimateConfig() ? tw`cursor-not-allowed` : tw`cursor-pointer`
                    )
                  },
                  childrenType: 'text',
                  children() {
                    const d = date.get()
                    return `${numberIntFillWithN0(d.month, 2)}-${numberIntFillWithN0(d.day, 2)}`
                  },
                  onClick() {
                    if (scrollY.getAnimateConfig()) {
                      return
                    }
                    if (showCalendar.get()) {
                      //为了使越界触发
                      scrollY.animateTo(TRANSY_OPEN_CALENDAR + 1)
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
            const bodyScrollX = signalAnimateFrame(0)
            const mp2 = movePage(bodyScrollX, getContainerWidth)
            fdom.div({
              className: 'flex-1',
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
                            min: 1,
                            max: 18
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
  })
}