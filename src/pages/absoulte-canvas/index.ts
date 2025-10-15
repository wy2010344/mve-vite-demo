import { createSignal, arrayCountCreateWith, simpleFlex } from 'wy-helper';
import {
  renderCanvas,
  hookDraw,
  hookDrawRect,
  hookDrawText,
  hookFill,
  hookStroke,
} from 'mve-dom-helper/canvasRender';
import { hookDestroy, renderArrayKey, renderIf } from 'mve-helper';
import { subscribeRequestAnimationFrame } from 'wy-dom-helper';
import { fdom } from 'mve-dom';

// 粒子类型定义
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

// 连接线类型
interface Connection {
  from: Particle;
  to: Particle;
  distance: number;
  opacity: number;
}

export default function () {
  // 状态管理
  const mouseX = createSignal(0);
  const mouseY = createSignal(0);
  const isMouseInside = createSignal(false);
  const animationSpeed = createSignal(1);
  const particleCount = createSignal(80);
  const connectionDistance = createSignal(120);

  // 颜色主题
  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
    '#26de81',
    '#fd79a8',
    '#fdcb6e',
    '#6c5ce7',
  ];

  // 创建粒子
  function createParticle(
    id: number,
    containerWidth: number,
    containerHeight: number
  ): Particle {
    return {
      id,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    };
  }

  // 初始化粒子
  function initParticles(containerWidth: number, containerHeight: number) {
    return arrayCountCreateWith(particleCount.get(), i =>
      createParticle(i, containerWidth, containerHeight)
    );
  }

  const particles = createSignal<Particle[]>(initParticles(1000, 700));
  // 更新粒子
  function updateParticles(containerWidth: number, containerHeight: number) {
    const currentParticles = particles.get();
    const speed = animationSpeed.get();
    const mouseInfluence = isMouseInside.get();
    const mx = mouseX.get();
    const my = mouseY.get();
    // console.log('m',mx,my,mouseInfluence,speed)
    const updatedParticles = currentParticles.map(particle => {
      const newParticle = { ...particle };

      // 鼠标吸引力
      if (mouseInfluence) {
        const dx = mx - newParticle.x;
        const dy = my - newParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = ((150 - distance) / 150) * 0.02;
          newParticle.vx += (dx / distance) * force;
          newParticle.vy += (dy / distance) * force;
        }
      }

      // 更新位置
      newParticle.x += newParticle.vx * speed;
      newParticle.y += newParticle.vy * speed;

      // 边界处理 - 穿越效果
      if (newParticle.x < 0) newParticle.x = containerWidth;
      if (newParticle.x > containerWidth) newParticle.x = 0;
      if (newParticle.y < 0) newParticle.y = containerHeight;
      if (newParticle.y > containerHeight) newParticle.y = 0;

      // 生命周期
      newParticle.life += 1;
      if (newParticle.life > newParticle.maxLife) {
        // 重生
        return createParticle(newParticle.id, containerWidth, containerHeight);
      }

      // 透明度变化
      const lifeRatio = newParticle.life / newParticle.maxLife;
      newParticle.opacity = Math.sin(lifeRatio * Math.PI) * 0.8 + 0.2;

      return newParticle;
    });

    particles.set(updatedParticles);
  }

  // 计算连接线
  function calculateConnections(): Connection[] {
    const currentParticles = particles.get();
    const maxDistance = connectionDistance.get();
    const connections: Connection[] = [];

    for (let i = 0; i < currentParticles.length; i++) {
      for (let j = i + 1; j < currentParticles.length; j++) {
        const p1 = currentParticles[i];
        const p2 = currentParticles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          connections.push({
            from: p1,
            to: p2,
            distance,
            opacity: (1 - distance / maxDistance) * 0.3,
          });
        }
      }
    }

    return connections;
  }

  // 动画循环
  renderCanvas(
    fdom.canvas({
      s_width: `${1000}px`,
      s_height: `${700}px`,
      className: 'border border-gray-300 rounded-lg shadow-lg',
      data_canvasContainer: true,
      onMouseMove: e => {
        mouseX.set(e.offsetX);
        mouseY.set(e.offsetY);
      },
      onMouseEnter: () => isMouseInside.set(true),
      onMouseLeave: () => isMouseInside.set(false),
      onClick: e => {
        console.log('click', e);
        // 点击时在鼠标位置创建爆炸效果
        const newParticles = arrayCountCreateWith(10, i => ({
          id: Date.now() + i,
          x: e.offsetX,
          y: e.offsetY,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
          life: 0,
          maxLife: 60,
        }));

        particles.set([...particles.get(), ...newParticles]);
      },
    }),
    ({ canvas }) => {
      // 初始化粒子

      // 背景渐变
      hookDraw({
        x: 0,
        y: 0,
        draw({ ctx }) {
          const gradient = ctx.createLinearGradient(0, 0, 0, 700);
          gradient.addColorStop(0, '#0f0f23');
          gradient.addColorStop(0.5, '#1a1a2e');
          gradient.addColorStop(1, '#16213e');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1000, 700);
        },
      });

      // 渲染连接线
      hookDraw({
        x: 0,
        y: 0,
        draw({ ctx }) {
          const connections = calculateConnections();

          connections.forEach(connection => {
            ctx.beginPath();
            ctx.moveTo(connection.from.x, connection.from.y);
            ctx.lineTo(connection.to.x, connection.to.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${connection.opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        },
      });

      // 渲染粒子
      renderArrayKey(
        particles.get,
        v => v.id,
        function (getParticle) {
          hookDraw({
            x: () => getParticle().x - getParticle().size,
            y: () => getParticle().y - getParticle().size,
            draw({ ctx }) {
              const particle = getParticle();
              // 粒子光晕
              const gradient = ctx.createRadialGradient(
                particle.size,
                particle.size,
                0,
                particle.size,
                particle.size,
                particle.size * 3
              );
              gradient.addColorStop(
                0,
                particle.color +
                  Math.floor(particle.opacity * 255)
                    .toString(16)
                    .padStart(2, '0')
              );
              gradient.addColorStop(0.5, `${particle.color}20`);
              gradient.addColorStop(1, 'transparent');

              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, particle.size * 6, particle.size * 6);

              // 粒子核心
              ctx.beginPath();
              ctx.arc(
                particle.size,
                particle.size,
                particle.size,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = particle.color;
              ctx.globalAlpha = particle.opacity;
              ctx.fill();
              ctx.globalAlpha = 1;
            },
          });
        }
      );

      // 鼠标位置指示器
      renderIf(isMouseInside.get, function () {
        hookDraw({
          x: () => mouseX.get() - 30,
          y: () => mouseY.get() - 30,
          draw({ ctx }) {
            ctx.beginPath();
            ctx.arc(30, 30, 25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          },
        });
      });

      // 控制面板
      hookDrawRect({
        x: 20,
        y: 20,
        layout(v) {
          return simpleFlex({
            direction: 'y',
            alignItems: 'start',
          });
        },
        draw() {
          hookFill('rgba(0, 0, 0, 0.7)');
          hookStroke(1, 'rgba(255, 255, 255, 0.3)');
        },
        children() {
          // 标题
          hookDrawText({
            config: {
              text: '🌟 粒子星空控制台',
              fontSize: '16px',
              fontWeight: 'bold',
            },
            draw(e) {
              e.draw({
                style: 'white',
              });
            },
          });

          // 粒子数量显示
          hookDrawText({
            config() {
              return {
                text: `粒子数量: ${particles.get().length}`,
                fontSize: '12px',
              };
            },
            draw(e) {
              e.draw({
                style: '#4ecdc4',
              });
            },
          });

          // 连接数量显示
          hookDrawText({
            config() {
              return {
                text: `连接数量: ${calculateConnections().length}`,
                fontSize: '12px',
              };
            },
            draw(e) {
              e.draw({
                style: '#45b7d1',
              });
            },
          });

          // 操作提示
          hookDrawText({
            config: {
              text: '💡 移动鼠标吸引粒子',
              fontSize: '11px',
            },
            draw(e) {
              e.draw({
                style: '#feca57',
              });
            },
          });

          hookDrawText({
            config: {
              text: '🎆 点击创建爆炸效果',
              fontSize: '11px',
            },
            draw(e) {
              e.draw({
                style: '#ff9ff3',
              });
            },
          });
        },
      });

      // 性能指示器
      hookDrawRect({
        x: 800,
        y: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        layout(v) {
          return simpleFlex({
            direction: 'x',
            gap: 10,
            alignItems: 'center',
          });
        },
        draw() {
          hookFill('rgba(0, 0, 0, 0.7)');
          hookStroke(1, 'rgba(255, 255, 255, 0.3)');
        },
        children() {
          hookDrawText({
            config: {
              text: '⚡ 性能监控',
              fontSize: '14px',
              fontWeight: 'bold',
            },
            draw(e) {
              // ctx.textBaseline='bottom'
              hookStroke(1, 'blue');
              e.draw();
            },
          });

          hookDrawText({
            config: {
              text: `FPS: ~60`,
              fontSize: '12px',
              // textBaseline: 'hanging',
            },
            draw({ ctx, draw }) {
              ctx.textBaseline = 'top';
              hookStroke(1, 'blue');
              draw({
                style: '#26de81',
              });
            },
          });
        },
      });

      hookDestroy(
        subscribeRequestAnimationFrame(function () {
          updateParticles(canvas.width, canvas.height);
        })
      );
    },
    {
      beforeDraw(ctx) {
        // 清除画布
        ctx.clearRect(0, 0, 1000, 700);
      },
    }
  );
}
