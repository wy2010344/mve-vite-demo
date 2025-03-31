import { addEffect, arrayCountCreateWith, createSignal, DAYMILLSECONDS, FrictionalFactory, circleFindNearst, memo, tw, eventGetPageX, circleFormat, EmptyFun } from "wy-helper";
import { renderMobileView } from "../onlyMobile";
import { faker } from "@faker-js/faker";
import { min } from "d3";
import { EachTime, hookAddResult, renderForEach } from "mve-core";
import { fdom } from "mve-dom";
import { animateSignal, cns, pointerMoveDir } from "wy-dom-helper";
import { hookDestroy, hookTrackSignal, renderArray, renderArrayKey } from "mve-helper";
import { hookExitAnimate, movePage, renderInputBool } from "mve-dom-helper";
import { ImPlus } from "mve-icons/im";
import { IoMdClose } from "mve-icons/io";
import { history } from "../history";
import { createPop, createTimeoutPop } from "../pop";
import { animate } from "motion";



const data = arrayCountCreateWith(7, function (i) {
  return {
    id: i,
    color: faker.color.rgb(),
    title: faker.book.author(),
    children: arrayCountCreateWith(faker.number.int({
      min: 12,
      max: 17
    }), function (i) {
      const checked = faker.number.int() % 2 ? true : false
      const createTime = faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: Date.now()
      })
      return {
        id: i,
        display: faker.lorem.sentence(),
        createTime,
        editTime: new Date(createTime.valueOf() + faker.number.int()),
        finishTime: checked ? new Date(createTime.valueOf() + faker.number.int({
          min: DAYMILLSECONDS
        })) : undefined
      }
    })
  }
})

type Model = typeof data[0]
const bs = FrictionalFactory.get()
export default function () {
  renderMobileView(function () {

    const model = createSignal(data)
    const selectIndex = createSignal(0)

    fdom.div({
      className: 'h-full flex flex-col items-stretch',
      children() {

        fdom.div({
          className: 'h-50',
          children() {

            fdom.button({
              className: 'daisy-btn daisy-btn-ghost daisy-btn-circle',
              onClick() {
                history.push(`/taskist/total`)
              },
              children() {
                IoMdClose()
              }
            })
          }
        })

        function renderList(renderView: (key: number, et: EachTime<Model>) => void) {
          renderForEach<Model, number, void>(function (callback) {
            let index = selectIndex.get()
            const mlist = model.get()
            const maxIndex = mlist.length - 1
            const beforeIndex = index == 0 ? maxIndex : index - 1
            const afterIndex = index == maxIndex ? 1 : index + 1
            callback(beforeIndex, mlist[beforeIndex], renderView)
            callback(index, mlist[index], renderView)
            callback(afterIndex, mlist[afterIndex], renderView)
          })
        }
        const scrollX = animateSignal(0)
        const mp = movePage(scrollX, () => container.clientWidth)

        hookTrackSignal(memo<number>(oldIndex => {
          const index = selectIndex.get()
          if (typeof oldIndex == 'number') {
            const dif = circleFindNearst(index - oldIndex, model.get().length)
            const d = Math.sign(dif)
            if (d) {
              mp.changePage(d)
            }
          }
          return index
        }))
        const container = fdom.div({
          className: 'relative flex-1 min-h-0',
          onPointerDown: pointerMoveDir(function (e, dir) {
            if (dir == 'x') {
              return mp.pointerDown(e, {
                getPage: eventGetPageX,
                callback(direction, velocity) {
                  const max = model.get().length
                  selectIndex.set(circleFormat(selectIndex.get() + direction, max))
                },
              })
            }
          }),
          children() {
            fdom.div({
              className: 'h-full',
              s_transform() {
                return `translateX(${-scrollX.get()}px)`
              },
              children() {
                renderList(function (key, et) {

                  fdom.div({
                    className() {
                      const i = et.getIndex() - 1
                      return cns(
                        `w-full h-full overflow-y-auto`,
                        i && 'absolute inset 0',
                        i < 0 && tw`-translate-x-full top-0`,
                        i > 0 && tw`translate-x-full top-0`
                      )
                    },
                    children() {
                      fdom.table({
                        className: 'w-full',
                        children() {
                          fdom.thead({
                            className: 'sticky top-0 bg-base-100',
                            children() {

                              fdom.tr({
                                children() {
                                  fdom.td({

                                  })
                                  fdom.td({
                                    className: 'pt-4 pb-4 border-b-1 border-b-base-300',
                                    children() {
                                      fdom.h1({
                                        className: 'text-4xl font-bold',
                                        childrenType: "text",
                                        children() {
                                          return et.getValue().title + "--" + et.getValue().id
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                            }
                          })
                          fdom.tbody({
                            children() {
                              renderArrayKey(() => et.getValue().children, v => v.id, function (item) {

                                fdom.tr({
                                  children() {
                                    fdom.td({
                                      className: 'align-top pl-8 pr-2 pt-4 pb-4',
                                      children() {
                                        renderInputBool(
                                          () => Boolean(item().finishTime),
                                          bool => {

                                          },
                                          fdom.input({
                                            type: "checkbox"
                                          }))
                                      }
                                    })
                                    fdom.td({
                                      className: 'align-top pt-4 pb-4',
                                      children() {
                                        fdom.div({
                                          className: 'font-bold',
                                          childrenType: 'text',
                                          children() {
                                            return item().display
                                          }
                                        })
                                      }
                                    })
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
              }
            })
          }
        })

        fdom.div({
          className: ' w-full pl-8 pr-8 pb-10 flex justify-between items-end',
          children() {
            fdom.div({
              className: 'w-100 flex items-end gap-2',
              s_transform() {
                return `translateX(${-scrollX.get() * 8 / container.clientWidth}px)`
              },
              children(content: HTMLDivElement) {
                renderList(function (key, et) {
                  fdom.div({
                    className() {
                      return cns(
                        `w-2 transition-all`,
                        et.getIndex() == 1 ? tw`h-14` : tw`h-10`,
                      )
                    },
                    s_background() {
                      return et.getValue().color
                    }
                  })
                })
              }
            })
            const btn = fdom.button({
              className: 'daisy-btn daisy-btn-square',
              children() {
                ImPlus()
              }
            })

            hookExitAnimate(btn, div => {
              return animate(div, {
                opacity: 0
              })
            })
          }
        })
      }
    })
  })
}