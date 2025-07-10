import { BatchOptimistic, GetValue, StoreRef } from "wy-helper";
import { priorityTypes, Task, TaskType } from "./type";
import { faker } from "@faker-js/faker";
import { HookRender, If } from "./xmlRender";
import { LuPlus } from "mve-icons/lu";
import { renderSizeSvg } from "~/mve-icon";
import { mve } from "mve-dom-helper";
import { React } from "wy-dom-helper";
import { FPDomAttributes } from "mve-dom";

export default function ({
  title,
  tasks,
  type,
  getTasks,
  children,
  ...props
}: {
  type: TaskType;
  tasks: StoreRef<Task[]>;
  title: string;
  children: mve.ChildrenElement;
  getTasks: GetValue<Task[]>;
} & FPDomAttributes<"div">) {
  //   const { dragId, tasks } = TaskContext.consume();
  //  const getTasks = memo(function () {
  //     return tasks.get().filter((x) => x.type == type);
  //     // .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  //   });
  return (
    <div className="daisy-card bg-base-200 w-80 shrink-0 h-full">
      <div className="daisy-card-body p-4 flex flex-col h-full ">
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
          className="space-y-3 min-h-[200px] flex-1 overflow-y-auto -mx-4 px-4 relative"
          {...props}
        >
          {children}
          <If
            condition={() => !getTasks().length}
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
