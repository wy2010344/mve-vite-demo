import { fdom } from 'mve-dom';
import { createSignal } from 'wy-helper';
import { animateSignal, pointerMove } from 'wy-dom-helper';
import { panel } from '../WindowManager';
import { tween, easeFns, spring } from 'wy-helper';

/**
 * 拖拽排序 - 业务中常见的交互场景
 * 难点：
 * 1. 拖拽过程中的视觉反馈
 * 2. 实时计算插入位置
 * 3. 动画过渡
 * 4. 多列表拖拽
 * 5. 拖拽边界处理
 */

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: '设计数据库表结构',
    description: '设计用户、订单、商品表',
    status: 'todo',
    priority: 'high',
  },
  {
    id: 2,
    title: '实现用户登录功能',
    description: 'JWT + Redis',
    status: 'todo',
    priority: 'high',
  },
  {
    id: 3,
    title: '开发商品列表页',
    description: '支持筛选和排序',
    status: 'doing',
    priority: 'medium',
  },
  {
    id: 4,
    title: '优化首页加载速度',
    description: '图片懒加载、代码分割',
    status: 'doing',
    priority: 'medium',
  },
  {
    id: 5,
    title: '修复支付回调bug',
    description: '处理异步通知',
    status: 'done',
    priority: 'high',
  },
  {
    id: 6,
    title: '编写单元测试',
    description: '覆盖率达到80%',
    status: 'done',
    priority: 'low',
  },
];

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  todo: '待办',
  doing: '进行中',
  done: '已完成',
};

export const DragDropApp = panel(function (info) {
  return {
    title: '任务看板',
    icon: '📋',
    width: 1000,
    height: 700,
    children() {
      const tasks = createSignal<Task[]>(INITIAL_TASKS);
      const draggingTask = createSignal<Task | null>(null);
      const dragOverStatus = createSignal<string | null>(null);
      const dragOverIndex = createSignal<number>(-1);

      function getTasksByStatus(status: string) {
        return tasks.get().filter(t => t.status === status);
      }

      function startDrag(task: Task) {
        draggingTask.set(task);
      }

      function endDrag() {
        draggingTask.set(null);
        dragOverStatus.set(null);
        dragOverIndex.set(-1);
      }

      function moveTask(
        taskId: number,
        newStatus: string,
        insertIndex: number
      ) {
        const taskList = tasks.get();
        const taskIndex = taskList.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const task = { ...taskList[taskIndex], status: newStatus as any };
        const newTasks = taskList.filter(t => t.id !== taskId);

        // 计算插入位置
        const statusTasks = newTasks.filter(t => t.status === newStatus);
        const otherTasks = newTasks.filter(t => t.status !== newStatus);

        statusTasks.splice(insertIndex, 0, task);

        tasks.set([...statusTasks, ...otherTasks]);
      }

      fdom.div({
        className:
          'w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50',
        children() {
          // 顶部栏
          fdom.div({
            className:
              'h-16 bg-white border-b border-gray-200 flex items-center px-6',
            children() {
              fdom.h2({
                className: 'text-xl font-bold text-gray-800',
                childrenType: 'text',
                children: '项目任务看板',
              });

              fdom.div({ className: 'flex-1' });

              fdom.div({
                className: 'flex gap-4 text-sm',
                children() {
                  ['todo', 'doing', 'done'].forEach(status => {
                    const count = getTasksByStatus(status).length;
                    fdom.div({
                      className: 'flex items-center gap-2',
                      children() {
                        fdom.span({
                          className: 'text-gray-600',
                          childrenType: 'text',
                          children:
                            STATUS_LABELS[status as keyof typeof STATUS_LABELS],
                        });
                        fdom.span({
                          className:
                            'px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold',
                          childrenType: 'text',
                          children: `${count}`,
                        });
                      },
                    });
                  });
                },
              });
            },
          });

          // 看板列
          fdom.div({
            className: 'flex-1 flex gap-4 p-6 overflow-x-auto',
            children() {
              (['todo', 'doing', 'done'] as const).forEach(status => {
                renderColumn(status, {
                  tasks,
                  draggingTask,
                  dragOverStatus,
                  dragOverIndex,
                  startDrag,
                  endDrag,
                  moveTask,
                  getTasksByStatus,
                });
              });
            },
          });
        },
      });
    },
  };
});

function renderColumn(
  status: 'todo' | 'doing' | 'done',
  {
    tasks,
    draggingTask,
    dragOverStatus,
    dragOverIndex,
    startDrag,
    endDrag,
    moveTask,
    getTasksByStatus,
  }: any
) {
  const columnColors = {
    todo: 'bg-gray-100',
    doing: 'bg-blue-100',
    done: 'bg-green-100',
  };

  fdom.div({
    className: 'flex-1 min-w-[300px] flex flex-col',
    children() {
      // 列标题
      fdom.div({
        className: `${columnColors[status]} rounded-t-lg px-4 py-3 font-semibold text-gray-700`,
        children() {
          fdom.div({
            className: 'flex items-center justify-between',
            children() {
              fdom.span({
                childrenType: 'text',
                children: STATUS_LABELS[status],
              });
              fdom.span({
                className: 'text-sm',
                childrenType: 'text',
                children() {
                  return `${getTasksByStatus(status).length}`;
                },
              });
            },
          });
        },
      });

      // 任务列表
      fdom.div({
        className: 'flex-1 bg-white rounded-b-lg p-3 space-y-3 min-h-[400px]',
        s_backgroundColor() {
          return dragOverStatus.get() === status ? '#f0f9ff' : '#ffffff';
        },
        s_transition: 'background-color 0.2s',
        onDragOver(e) {
          e.preventDefault();
          dragOverStatus.set(status);
        },
        onDragLeave() {
          if (dragOverStatus.get() === status) {
            dragOverStatus.set(null);
          }
        },
        onDrop(e) {
          e.preventDefault();
          const task = draggingTask.get();
          if (task) {
            const index = dragOverIndex.get();
            moveTask(
              task.id,
              status,
              index >= 0 ? index : getTasksByStatus(status).length
            );
          }
          endDrag();
        },
        children() {
          const statusTasks = getTasksByStatus(status);

          if (statusTasks.length === 0) {
            fdom.div({
              className:
                'flex flex-col items-center justify-center h-full text-gray-400',
              children() {
                fdom.div({
                  className: 'text-4xl mb-2',
                  childrenType: 'text',
                  children: '📭',
                });
                fdom.div({
                  className: 'text-sm',
                  childrenType: 'text',
                  children: '暂无任务',
                });
              },
            });
          }

          statusTasks.forEach((task: any, index: any) => {
            renderTaskCard(task, index, {
              draggingTask,
              dragOverIndex,
              startDrag,
              endDrag,
            });
          });
        },
      });
    },
  });
}

function renderTaskCard(
  task: any,
  index: any,
  { draggingTask, dragOverIndex, startDrag, endDrag }: any
) {
  const scale = animateSignal(1);
  const isDragging = () => draggingTask.get()?.id === task.id;

  fdom.div({
    draggable: true,
    className:
      'bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow',
    s_opacity() {
      return isDragging() ? 0.5 : 1;
    },
    s_transform() {
      return `scale(${scale.get()})`;
    },
    s_transition: 'opacity 0.2s, transform 0.2s',
    onDragStart(e) {
      startDrag(task);
      scale.animateTo(1.05, tween(200, easeFns.out(easeFns.back())));
    },
    onDragEnd() {
      endDrag();
      scale.animateTo(1, spring());
    },
    onDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      dragOverIndex.set(index);
    },
    children() {
      // 优先级标签
      fdom.div({
        className: 'flex items-center justify-between mb-2',
        children() {
          fdom.span({
            className: `text-xs px-2 py-0.5 rounded ${(PRIORITY_COLORS as any)[task.priority]}`,
            childrenType: 'text',
            children: task.priority.toUpperCase(),
          });
          fdom.span({
            className: 'text-xs text-gray-400',
            childrenType: 'text',
            children: `#${task.id}`,
          });
        },
      });

      // 标题
      fdom.h3({
        className: 'font-semibold text-gray-900 mb-2',
        childrenType: 'text',
        children: task.title,
      });

      // 描述
      fdom.p({
        className: 'text-sm text-gray-700',
        childrenType: 'text',
        children: task.description,
      });
    },
  });
}
