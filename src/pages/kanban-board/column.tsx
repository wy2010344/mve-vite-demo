import { mve } from "mve-dom-helper";
import { createSignal, GetValue, memo } from "wy-helper";
import {
  ColumnContext,
  PriorityType,
  priorityTypes,
  Task,
  TaskContext,
  TaskType,
} from "./type";
import { LuPlus } from "mve-icons/lu";
import { ArrayRender, HookRender, If } from "./xmlRender";
import { renderSizeSvg } from "../../mve-icon";
import task from "./task";
import Indicator from "./indicator";
import { renderPortal } from "mve-dom";
import { faker } from "@faker-js/faker";

function priorityValue(n: PriorityType) {
  if (n == "high") {
    return 1;
  }
  if (n == "medium") {
    return 2;
  }
  return 3;
}
export default function ({
  title,
  type,
}: // getTasks,
{
  title: string;
  type: TaskType;
  // getTasks: GetValue<Task[]>;
}) {
  const { dragId, tasks } = TaskContext.consume();
  const getTasks = memo(function () {
    return tasks.get().filter((x) => x.type == type);
    // .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  });

  const activeIndicator = createSignal<string | undefined>(undefined);
  ColumnContext.provide({
    type,
    getActive: activeIndicator.get,
  });
  function handleNearestIndicator(clientY: number) {
    const indicators = Array.from(
      document.querySelectorAll(
        `[data-column="${type}"]`
      ) as unknown as HTMLElement[]
    );
    const DISTANCE_OFFSET = 100; //假设为卡片的高度
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = clientY - (box.top + DISTANCE_OFFSET / 2);
        if (offset < 0 && offset > closest.offset) {
          return {
            offset,
            element: child,
          };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators.at(-1),
      }
    );
    const newId = el.element?.dataset.before;
    const oldId = activeIndicator.get();
    if (oldId != newId) {
      activeIndicator.set(newId);
    }
    return newId;
  }
  return (
    <div className="daisy-card bg-base-200 w-80 h-fit">
      <div className="daisy-card-body p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="daisy-card-title text-sm font-medium">{title}</h3>
            <div className="daisy-badge daisy-badge-neutral daisy-badge-sm">
              {() => getTasks().length}
            </div>
          </div>
          <button
            className="daisy-btn daisy-btn-ghost daisy-btn-sm daisy-btn-circle"
            onClick={() => {
              tasks.set(
                tasks.get().concat({
                  type,
                  id: Date.now() + "",
                  title: faker.book.title(),
                  description: faker.book.series(),
                  priority:
                    priorityTypes[
                      faker.number.int({
                        min: 0,
                        max: 2,
                      })
                    ],
                  assignee: faker.book.author(),
                  dueDate: "2024-01-15",
                })
              );
            }}
          >
            <HookRender
              render={() => {
                LuPlus(renderSizeSvg, "24px");
              }}
            />
          </button>
        </div>

        <div
          className="space-y-3 min-h-[200px]"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = "move";
            handleNearestIndicator(e.clientY);
          }}
          onDragLeave={(e) => {
            activeIndicator.set(undefined);
          }}
          onDrop={(e) => {
            const beforeId = handleNearestIndicator(e.clientY);
            const drag = dragId.get();
            if (beforeId != drag) {
              const task = tasks.get().find((v) => v.id == drag)!;
              const dragTask =
                task.type == type
                  ? task
                  : {
                      ...task,
                      type,
                    };
              const filteredTasks = tasks.get().filter((v) => v.id != drag);
              if (beforeId == "") {
                filteredTasks.push(dragTask);
              } else {
                const insertAtIndex = filteredTasks.findIndex(
                  (e) => e.id == beforeId
                );
                filteredTasks.splice(insertAtIndex, 0, dragTask);
              }
              tasks.set(filteredTasks);
            }
            activeIndicator.set(undefined);
          }}
        >
          <ArrayRender
            getArray={getTasks}
            getKey={(v) => v.id}
            render={function (getValue, getIndex, key) {
              task({
                getTask: getValue,
                onDelete(id) {
                  tasks.set(tasks.get().filter((x) => x.id != key));
                },
                onDragStart(e) {
                  dragId.set(key);
                },
              });
            }}
          />
          <Indicator />
          <If
            condition={() => getTasks().length}
            whenTrue={() => {
              mve.renderChild(
                <div className="text-center text-base-content/50 text-sm py-8">
                  拖拽任务到这里或点击 + 添加新任务
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
