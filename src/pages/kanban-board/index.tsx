import { createSignal, memo } from "wy-helper";
import { PriorityType, Task, TaskContext, TaskType } from "./type";
import { mve } from "mve-dom-helper";
import column from "./column";
import { renderStateHolder } from "mve-core";
import { HookRender } from "./xmlRender";

const initialTasks: Task[] = [
  {
    type: "todo",
    id: "1",
    title: "设计用户界面",
    description: "为新功能设计用户界面原型",
    priority: "high",
    assignee: "张三",
    dueDate: "2024-01-15",
  },
  {
    type: "todo",
    id: "2",
    title: "编写API文档",
    description: "完善REST API的文档说明",
    priority: "medium",
    assignee: "李四",
  },
  {
    type: "inprogress",
    id: "3",
    title: "实现用户认证",
    description: "集成OAuth 2.0认证系统",
    priority: "high",
    assignee: "王五",
    dueDate: "2024-01-20",
  },
  {
    type: "review",
    id: "4",
    title: "代码审查",
    description: "审查登录模块的代码实现",
    priority: "medium",
    assignee: "赵六",
  },
  {
    type: "done",
    id: "5",
    title: "项目初始化",
    description: "设置项目结构和基础配置",
    priority: "low",
    assignee: "张三",
  },
];

type Column = {
  type: TaskType;
  title: string;
};

export default function () {
  const tasks = createSignal(initialTasks);

  function toColumn(title: string, type: TaskType): Column {
    return {
      title,
      type,
    };
  }
  const dragId = createSignal<string | undefined>(undefined);

  const columns: Column[] = [
    toColumn("待办事项", "todo"),
    toColumn("进行中", "inprogress"),
    toColumn("待审核", "review"),
    toColumn("已完成", "done"),
  ];

  TaskContext.provide({
    dragId,
    tasks,
  });
  mve.renderChild(
    <div className="min-h-screen bg-base-300 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            项目看板
          </h1>
          <p className="text-base-content/70">
            拖拽任务卡片来更新状态，点击 + 添加新任务
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6">
          <HookRender
            render={() => {
              {
                columns.map((c) => {
                  renderStateHolder(() => {
                    mve.renderChild(column(c));
                  });
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
