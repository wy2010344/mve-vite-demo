import { dom, fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

interface DrawPoint {
  x: number;
  y: number;
}

interface DrawPath {
  points: DrawPoint[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
}

const COLORS = [
  '#000000',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];
const TOOLS = [
  { id: 'pen', icon: '✏️', name: '画笔' },
  { id: 'eraser', icon: '🧹', name: '橡皮' },
  { id: 'clear', icon: '🗑️', name: '清空' },
];

export const WhiteboardApp = panel(function (info) {
  return {
    title: '协作白板',
    icon: '🎨',
    width: 900,
    height: 650,
    children() {
      const paths = createSignal<DrawPath[]>([]);
      const currentPath = createSignal<DrawPoint[]>([]);
      const isDrawing = createSignal(false);
      const selectedColor = createSignal('#000000');
      const brushSize = createSignal(3);
      const selectedTool = createSignal<'pen' | 'eraser'>('pen');

      // 模拟协作者
      const collaborators = createSignal<Collaborator[]>([
        { id: '1', name: 'Alice', color: '#ff6b6b', cursor: null },
        { id: '2', name: 'Bob', color: '#4ecdc4', cursor: null },
      ]);

      let canvas: HTMLCanvasElement;
      let ctx: CanvasRenderingContext2D;

      function startDrawing(x: number, y: number) {
        isDrawing.set(true);
        currentPath.set([{ x, y }]);
      }

      function draw(x: number, y: number) {
        if (!isDrawing.get()) return;
        currentPath.set([...currentPath.get(), { x, y }]);
        drawCanvas();
      }

      function stopDrawing() {
        if (!isDrawing.get()) return;

        if (currentPath.get().length > 0) {
          paths.set([
            ...paths.get(),
            {
              points: currentPath.get(),
              color:
                selectedTool.get() === 'eraser'
                  ? '#ffffff'
                  : selectedColor.get(),
              width:
                selectedTool.get() === 'eraser'
                  ? brushSize.get() * 3
                  : brushSize.get(),
              tool: selectedTool.get(),
            },
          ]);
        }

        currentPath.set([]);
        isDrawing.set(false);
        drawCanvas();
      }

      function drawCanvas() {
        if (!ctx || !canvas) return;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制所有路径
        [
          ...paths.get(),
          {
            points: currentPath.get(),
            color:
              selectedTool.get() === 'eraser' ? '#ffffff' : selectedColor.get(),
            width:
              selectedTool.get() === 'eraser'
                ? brushSize.get() * 3
                : brushSize.get(),
            tool: selectedTool.get(),
          },
        ]
          .filter(path => path.points.length > 0)
          .forEach(path => {
            ctx.strokeStyle = path.color;
            ctx.lineWidth = path.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            path.points.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          });

        // 绘制协作者光标
        collaborators.get().forEach(collab => {
          if (collab.cursor) {
            ctx.fillStyle = collab.color;
            ctx.beginPath();
            ctx.arc(collab.cursor.x, collab.cursor.y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = collab.color;
            ctx.font = '12px sans-serif';
            ctx.fillText(
              collab.name,
              collab.cursor.x + 10,
              collab.cursor.y - 10
            );
          }
        });
      }

      // 模拟协作者移动
      addEffect(() => {
        if (!canvas) return;

        const interval = setInterval(() => {
          const updated = collaborators.get().map(collab => ({
            ...collab,
            cursor:
              Math.random() > 0.3
                ? {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                  }
                : null,
          }));
          collaborators.set(updated);
          drawCanvas();
        }, 2000);

        return () => clearInterval(interval);
      });

      addEffect(() => {
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          ctx = canvas.getContext('2d')!;
          drawCanvas();
        }
      });

      return fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-100',
        children() {
          // 工具栏
          fdom.div({
            className:
              'h-16 bg-white border-b border-gray-300 flex items-center px-4 gap-6',
            children() {
              // 工具选择
              fdom.div({
                className: 'flex gap-2',
                children() {
                  TOOLS.forEach(tool => {
                    fdom.button({
                      className:
                        'px-3 py-2 rounded hover:bg-gray-100 transition-colors',
                      s_backgroundColor() {
                        return selectedTool.get() === tool.id ? '#e5e7eb' : '';
                      },
                      onClick() {
                        if (tool.id === 'clear') {
                          paths.set([]);
                          drawCanvas();
                        } else {
                          selectedTool.set(tool.id as 'pen' | 'eraser');
                        }
                      },
                      children() {
                        fdom.div({
                          className: 'text-2xl',
                          childrenType: 'text',
                          children: tool.icon,
                        });
                        fdom.div({
                          className: 'text-xs text-gray-600',
                          childrenType: 'text',
                          children: tool.name,
                        });
                      },
                    });
                  });
                },
              });

              fdom.div({
                className: 'w-px h-8 bg-gray-300',
              });

              // 颜色选择
              fdom.div({
                className: 'flex gap-2',
                children() {
                  COLORS.forEach(color => {
                    fdom.button({
                      className:
                        'w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform',
                      s_backgroundColor: color,
                      s_borderColor() {
                        return selectedColor.get() === color ? '#000' : '#ccc';
                      },
                      onClick() {
                        selectedColor.set(color);
                        selectedTool.set('pen');
                      },
                    });
                  });
                },
              });

              fdom.div({
                className: 'w-px h-8 bg-gray-300',
              });

              // 画笔大小
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.span({
                    className: 'text-sm text-gray-600',
                    childrenType: 'text',
                    children: '粗细:',
                  });
                  fdom.input({
                    type: 'range',
                    min: '1',
                    max: '20',
                    value() {
                      return `${brushSize.get()}`;
                    },
                    onInput(e) {
                      brushSize.set(
                        parseInt((e.target as HTMLInputElement).value)
                      );
                    },
                    className: 'w-32',
                  });
                  fdom.div({
                    className: 'w-8 h-8 rounded-full bg-gray-800',
                    s_width() {
                      return `${brushSize.get() * 2}px`;
                    },
                    s_height() {
                      return `${brushSize.get() * 2}px`;
                    },
                  });
                },
              });

              fdom.div({ className: 'flex-1' });

              // 协作者列表
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.span({
                    className: 'text-sm text-gray-600',
                    childrenType: 'text',
                    children: '在线:',
                  });
                  collaborators.get().forEach(collab => {
                    fdom.div({
                      className: 'flex items-center gap-1',
                      children() {
                        fdom.div({
                          className: 'w-3 h-3 rounded-full',
                          s_backgroundColor: collab.color,
                        });
                        fdom.span({
                          className: 'text-xs text-gray-600',
                          childrenType: 'text',
                          children: collab.name,
                        });
                      },
                    });
                  });
                },
              });
            },
          });

          // Canvas 画布
          canvas = dom
            .canvas({
              className: 'flex-1 cursor-crosshair',
              onPointerDown(e) {
                const rect = canvas.getBoundingClientRect();
                startDrawing(e.clientX - rect.left, e.clientY - rect.top);
              },
              onPointerMove(e) {
                const rect = canvas.getBoundingClientRect();
                draw(e.clientX - rect.left, e.clientY - rect.top);
              },
              onPointerUp: stopDrawing,
              onPointerLeave: stopDrawing,
            })
            .render();
        },
      });
    },
  };
});
