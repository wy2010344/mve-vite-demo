import { dom, fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const COLORS = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#f9ca24',
  '#6c5ce7',
  '#a29bfe',
];

export const ParticleApp = panel(function (info) {
  return {
    title: '粒子画板',
    icon: '✨',
    width: 800,
    height: 600,
    children() {
      const particles = createSignal<Particle[]>([]);
      const isDrawing = createSignal(false);
      const particleCount = createSignal(0);
      const gravity = createSignal(0.5);
      const spawnRate = createSignal(5);
      let canvas: HTMLCanvasElement;
      let ctx: CanvasRenderingContext2D;
      let animationId: number;

      function createParticle(x: number, y: number): Particle {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          life: 1,
          maxLife: Math.random() * 60 + 60,
          size: Math.random() * 4 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      }

      function updateParticles() {
        const current = particles.get();
        const updated = current
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity.get(),
            vx: p.vx * 0.99,
            life: p.life - 1 / p.maxLife,
          }))
          .filter(p => p.life > 0 && p.y < canvas.height + 50);

        particles.set(updated);
        particleCount.set(updated.length);
      }

      function drawParticles() {
        if (!ctx || !canvas) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.get().forEach(p => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // 添加发光效果
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        ctx.globalAlpha = 1;
      }

      function animate() {
        updateParticles();
        drawParticles();
        animationId = requestAnimationFrame(animate);
      }

      addEffect(() => {
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          ctx = canvas.getContext('2d')!;
          animate();
        }

        return () => {
          if (animationId) cancelAnimationFrame(animationId);
        };
      });

      return fdom.div({
        className: 'w-full h-full flex flex-col bg-gray-900',
        children() {
          // 控制面板
          fdom.div({
            className:
              'h-16 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-6',
            children() {
              fdom.div({
                className: 'text-white text-sm',
                children() {
                  fdom.span({
                    className: 'text-gray-400',
                    childrenType: 'text',
                    children: '粒子数: ',
                  });
                  fdom.span({
                    className: 'font-bold text-green-400',
                    childrenType: 'text',
                    children() {
                      return `${particleCount.get()}`;
                    },
                  });
                },
              });

              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.label({
                    className: 'text-white text-sm',
                    childrenType: 'text',
                    children: '重力:',
                  });
                  fdom.input({
                    type: 'range',
                    min: '0',
                    max: '2',
                    step: '0.1',
                    value() {
                      return `${gravity.get()}`;
                    },
                    onInput(e) {
                      gravity.set(
                        parseFloat((e.target as HTMLInputElement).value)
                      );
                    },
                    className: 'w-32',
                  });
                  fdom.span({
                    className: 'text-white text-xs w-8',
                    childrenType: 'text',
                    children() {
                      return gravity.get().toFixed(1);
                    },
                  });
                },
              });

              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.label({
                    className: 'text-white text-sm',
                    childrenType: 'text',
                    children: '生成速率:',
                  });
                  fdom.input({
                    type: 'range',
                    min: '1',
                    max: '20',
                    step: '1',
                    value() {
                      return `${spawnRate.get()}`;
                    },
                    onInput(e) {
                      spawnRate.set(
                        parseInt((e.target as HTMLInputElement).value)
                      );
                    },
                    className: 'w-32',
                  });
                  fdom.span({
                    className: 'text-white text-xs w-8',
                    childrenType: 'text',
                    children() {
                      return `${spawnRate.get()}`;
                    },
                  });
                },
              });

              fdom.button({
                className:
                  'px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm',
                childrenType: 'text',
                children: '清空',
                onClick() {
                  particles.set([]);
                },
              });
            },
          });

          // Canvas 画布
          canvas = dom
            .canvas({
              className: 'flex-1 cursor-crosshair',
              onPointerDown(e) {
                isDrawing.set(true);
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                for (let i = 0; i < spawnRate.get(); i++) {
                  particles.set([...particles.get(), createParticle(x, y)]);
                }
              },
              onPointerMove(e) {
                if (!isDrawing.get()) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                for (let i = 0; i < spawnRate.get(); i++) {
                  particles.set([...particles.get(), createParticle(x, y)]);
                }
              },
              onPointerUp() {
                isDrawing.set(false);
              },
              onPointerLeave() {
                isDrawing.set(false);
              },
            })
            .render();

          // 提示文字
          fdom.div({
            className:
              'absolute top-20 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none',
            s_opacity() {
              return particleCount.get() === 0 ? 1 : 0;
            },
            s_transition: 'opacity 0.5s',
            childrenType: 'text',
            children: '点击或拖拽鼠标创建粒子效果',
          });
        },
      });
    },
  };
});
