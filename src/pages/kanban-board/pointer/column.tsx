import { addEffect, createSignal, memo, mergeSet, StoreRef } from 'wy-helper'
import ColumnBase from '../columnBase'
import { Task, TaskType } from '../type'
import { ArrayRender, If } from '../xmlRender'
import { DragData, taskContext } from './context'
import CardBase from '../cardBase'
import { mve, pluginEdgeScroll } from 'mve-dom-helper'
import { hookDestroy, hookTrackSignal, renderIf } from 'mve-helper'
import contacts from '~/pages/contacts'
import { fdom } from 'mve-dom'
import { animate } from 'motion'
import { pluginLayoutIndex } from 'daisy-mobile-helper'
import { pointerMove } from 'wy-dom-helper'

export default function ({ title, type }: { title: string; type: TaskType }) {
  const {
    tasks,
    dragData,
    dragX,
    dragY,
    columns,
    activeColumn,
    backHolder,
    targetHolder,
    dragTask,
  } = taskContext.consume()

  function markActiveColumn(
    e: PointerEvent,
    {
      whenIntoTarget,
      whenIntoDraft,
      whenNotDist,
    }: {
      whenIntoTarget(key: string): void
      whenIntoDraft?(): void
      whenNotDist?(): void
    }
  ) {
    let findColumn = e.target as HTMLElement | null
    while (findColumn) {
      for (let [key, column] of columns) {
        if (column == findColumn) {
          whenIntoTarget(key)
          return
        }
      }
      findColumn = findColumn.parentElement
    }
    whenNotDist?.()
  }
  const getTasks = memo(function () {
    return tasks.get().filter((x) => {
      if (x.type != type) {
        return false
      }
      const d = dragData.get()
      if (d && d.type.get() != 'cancel' && x.id == d.id) {
        return false
      }
      return true
    })
    // .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  })

  const map = new Map<string, HTMLDivElement>()
  const scrollTop = createSignal(0)
  let container: HTMLElement
  const index = memo(() => {
    const dragD = dragData.get()
    if (!dragD) {
      return -1
    }
    if (activeColumn.get() != type) {
      return -1
    }
    const dy = dragY.get()
    const crect = container.getBoundingClientRect()
    const st = scrollTop.get()
    if (dy < crect.top) {
      return -1
    }
    if (dy > crect.bottom) {
      return -1
    }
    const tasks = getTasks()
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const div = map.get(task.id)
      if (!div) {
        throw ''
      }
      const top = div.offsetTop + crect.top - st
      if (dy < top + div.clientHeight / 2) {
        return i
      }
    }
    return tasks.length
  })

  const getTasksWithPreview = memo(() => {
    const i = index()
    if (i < 0) {
      return getTasks()
    }
    const dr = dragTask()
    if (!dr) {
      return getTasks()
    }
    const ts = [...getTasks()]
    ts.splice(i, 0, {
      ...dr,
      type,
    })
    return ts
  })
  return (
    <ColumnBase
      type={type}
      title={title}
      tasks={tasks.original}
      getTasks={getTasks}
      plugin={mergeSet(
        (div) => {
          div.addEventListener('scroll', (e) => {
            scrollTop.set(div.scrollTop)
          })
        },
        pluginEdgeScroll({
          shouldMeasure() {
            return index() > -1
          },
          direction: 'y',
          multi: 3,
        }),
        (e) => {
          container = e
          columns.set(type, e)
          hookDestroy(() => {
            columns.delete(type)
          })
        }
      )}
    >
      <ArrayRender
        getArray={getTasksWithPreview}
        getKey={(v) => v.id}
        render={(getTask, getIndex, key) => {
          // renderIf(() => getIndex() == index(), renderPlaceHolder);
          mve.renderChild(
            <CardBase
              plugin={mergeSet<HTMLDivElement>(
                pluginLayoutIndex(getIndex, 'y'),
                (e) => {
                  map.set(key, e)
                  hookDestroy(() => {
                    map.delete(key)
                  })

                  hookTrackSignal(
                    () => {
                      return (
                        key == dragData.get()?.id && activeColumn.get() == type
                      )
                    },
                    function (bool) {
                      if (bool) {
                        targetHolder.set({
                          type,
                          element: e,
                          getBeforeId() {
                            return getTasks()[index()]?.id
                          },
                        })
                      }
                    }
                  )
                  if (dragData.get()?.type.get() == 'cancel') {
                    backHolder.set(e)
                  }
                }
              )}
              selected={() => dragData.get()?.id == key}
              onDelete={() => {
                tasks.original.set(
                  tasks.original.get().filter((x) => x.id != key)
                )
              }}
              className={() => {
                return dragData.get()?.id == key ? 'opacity-0' : ''
              }}
              getTask={getTask}
              onPointerDown={(e) => {
                if (dragData.get()) {
                  return
                }
                const div = e.currentTarget
                const p = div.getBoundingClientRect()
                dragX.set(e.pageX) //rect.left - cRect.left + c?.scrollLeft!);
                dragY.set(e.pageY)

                const d: DragData = {
                  width: p.width,
                  height: p.height,
                  x: e.pageX - p.x,
                  y: e.pageY - p.y,
                  id: key,
                  type: createSignal(undefined),
                }
                dragData.set(d)

                let lastE = e as unknown as PointerEvent
                document.body.style.userSelect = 'none'

                pointerMove({
                  onMove(moveE) {
                    markActiveColumn(moveE, {
                      whenIntoTarget(key) {
                        activeColumn.set(key)
                      },
                    })
                    const diffX = moveE.pageX - lastE.pageX
                    const diffY = moveE.pageY - lastE.pageY
                    dragX.set(dragX.get() + diffX)
                    dragY.set(dragY.get() + diffY)
                    lastE = moveE
                  },
                  onEnd(e) {
                    document.body.style.userSelect = ''
                    markActiveColumn(e, {
                      whenIntoTarget(key) {
                        activeColumn.set(key)
                        d.type.set('move')
                      },
                      whenNotDist() {
                        activeColumn.set(undefined)
                        d.type.set('cancel')
                      },
                    })
                  },
                })
              }}
            />
          )
        }}
      />
      {/* <If
        condition={() => index() == getTasks().length}
        whenTrue={renderPlaceHolder}
      /> */}
    </ColumnBase>
  )
}
