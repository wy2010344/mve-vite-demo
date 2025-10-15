import {
  addEffect,
  alawaysFalse,
  batchOptimistic,
  createSignal,
  emptyFun,
  emptySet,
  GetValue,
  memo,
  removeWhere,
  storeRef,
  StoreRef,
} from 'wy-helper';
import { ColumnDef, Task } from '../type';
import { renderStateHolder } from 'mve-core';
import { mve, pluginEdgeScroll } from 'mve-dom-helper';
import pointerColumn from './column';
import { DragData, taskContext } from './context';
import { hookTrackSignal, renderIf, renderOne } from 'mve-helper';
import CardBase from '../cardBase';
import { animate } from 'motion';
import { animateSignal } from 'wy-dom-helper';
import { fdom } from 'mve-dom';
export default function ({
  tasks: _tasks,
  columns,
}: {
  tasks: StoreRef<Task[]>;
  columns: ColumnDef[];
}) {
  const tasks = batchOptimistic(_tasks);
  const dragData = createSignal<DragData | undefined>(undefined);
  const dragTask = memo(() => {
    const d = dragData.get();
    if (d) {
      return tasks.get().find(x => x.id == d.id);
    }
  });
  const { dragX, dragY, backHolder, targetHolder, activeColumn } =
    taskContext.provide({
      tasks,
      dragData,
      dragTask,
      dragX: animateSignal(0),
      dragY: animateSignal(0),
      columns: new Map(),
      targetHolder: storeRef(undefined),
      backHolder: storeRef(undefined),
      activeColumn: createSignal(undefined),
    });

  fdom.div({
    plugin: pluginEdgeScroll({
      shouldMeasure: dragData.get,
      direction: 'x',
    }),
    className:
      'flex gap-6 overflow-x-auto overflow-y-hidden pb-6 flex-1 relative',
    children() {
      columns.map(c => {
        renderStateHolder(() => {
          mve.renderChild(pointerColumn(c));
        });
      });

      function clearAll() {
        dragData.set(undefined);
        targetHolder.set(undefined);
        backHolder.set(undefined);
        activeColumn.set(undefined);
      }
      renderOne(dragData.get, d => {
        if (d) {
          hookTrackSignal(d.type.get, function (type) {
            if (type == 'cancel') {
              addEffect(() => {
                const back = backHolder.get();
                if (back) {
                  const r = back.getBoundingClientRect();
                  Promise.all([
                    dragX.animateTo(r.x + d.x),
                    dragY.animateTo(r.y + d.y),
                  ]).then(() => {
                    clearAll();
                  });
                }
              });
            } else if (type == 'move') {
              addEffect(() => {
                const target = targetHolder.get();
                if (target) {
                  const r = target.element.getBoundingClientRect();
                  Promise.all([
                    dragX.animateTo(r.x + d.x),
                    dragY.animateTo(r.y + d.y),
                  ]).then(() => {
                    //确实移动完成了,但需要异步处理后台
                    //应该应用乐观更新,如果成功则提交,如果失败则返回

                    const dtask = dragTask()!;
                    const beforeId = target.getBeforeId();
                    const out = tasks.set(function (ts) {
                      ts = [...ts];
                      const row = { ...dtask, type: target.type };
                      removeWhere(ts, v => v.id == d.id);
                      if (beforeId) {
                        for (let i = 0; i < ts.length; i++) {
                          const t = ts[i];
                          if (t.id == beforeId) {
                            ts.splice(i, 0, row);
                            break;
                          }
                        }
                      } else {
                        ts.push(row);
                      }
                      return ts;
                    });
                    clearAll();
                    setTimeout(() => {
                      //假设成功了
                      out.commit();
                    }, 10 * 1000);
                  });
                }
              });
            }
          });
          renderIf(dragTask, function () {
            mve.renderChild(
              <CardBase
                selected={alawaysFalse}
                onDelete={emptyFun}
                getTask={dragTask as GetValue<Task>}
                className="pointer-events-none opacity-90 fixed"
                s_zIndex={1000}
                s_width={`${d.width}px`}
                s_height={`${d.height}px`}
                s_top={() => `${dragY.get() - d.y}px`}
                s_left={() => `${dragX.get() - d.x}px`}
                s_transformOrigin={`${d.x}px ${d.y}px`}
                s_rotate={() =>
                  dragData.get()?.type.get() ? '0deg' : '-15deg'
                }
              />
            );
          });
        }
      });
    },
  });
}
