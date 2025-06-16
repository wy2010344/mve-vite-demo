import { GetValue } from "wy-helper";
import { Task, TaskContext } from "./type";
import { HookRender, If } from "./xmlRender";
import { LuCalendar, LuUser, LuX } from "mve-icons/lu";
import { renderSizeSvg } from "../../mve-icon";
import { mve } from "mve-dom-helper";
import Indicator from "./indicator";
import { cns } from "wy-dom-helper";
const priorityColors = {
  low: "daisy-badge-success",
  medium: "daisy-badge-warning",
  high: "daisy-badge-error",
};

const priorityText = {
  low: "低",
  medium: "中",
  high: "高",
};

export default function ({
  getTask,
  onDelete,
  onDragStart,
}: {
  getTask: GetValue<Task>;
  onDelete: (id: string) => void;
  onDragStart: (e: DragEvent) => void;
}) {
  const { dragId } = TaskContext.consume();
  mve.renderChild(
    <>
      <Indicator getBeforeId={() => getTask().id} />
      <div
        className={function () {
          return cns(
            "daisy-card bg-base-100 shadow-md hover:shadow-lg cursor-move transition-shadow group",
            dragId.get() == getTask().id && "bg-gray-400"
          );
        }}
        draggable
        onDragStart={onDragStart}
        onDragEnd={(e) => {
          dragId.set(undefined);
        }}
      >
        <div className="daisy-card-body p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="daisy-card-title text-sm leading-tight">
              {() => getTask().title}
            </h4>
            <button
              className="daisy-btn daisy-btn-ghost daisy-btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(getTask().id)}
            >
              <HookRender
                render={() => {
                  LuX(renderSizeSvg, "12px");
                }}
              />
            </button>
          </div>

          <If
            condition={() => getTask().description}
            whenTrue={() => {
              mve.renderChild(
                <p className="text-xs text-base-content/70 mb-3 line-clamp-2">
                  {() => getTask().description}
                </p>
              );
            }}
          />

          <div className="flex items-center justify-between">
            <div
              className={() =>
                `daisy-badge daisy-badge-sm ${
                  priorityColors[getTask().priority]
                }`
              }
            >
              {() => priorityText[getTask().priority]}
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <If
                condition={() => getTask().assignee}
                whenTrue={() => {
                  mve.renderChild(
                    <div className="flex items-center gap-1">
                      <HookRender
                        render={() => {
                          LuUser(renderSizeSvg, "12px");
                        }}
                      />
                      <span>{() => getTask().assignee}</span>
                    </div>
                  );
                }}
              />
              <If
                condition={() => getTask().dueDate}
                whenTrue={() => {
                  mve.renderChild(
                    <div className="flex items-center gap-1">
                      <HookRender
                        render={() => {
                          LuCalendar(renderSizeSvg, "12px");
                        }}
                      />
                      <span>{() => getTask().dueDate}</span>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
