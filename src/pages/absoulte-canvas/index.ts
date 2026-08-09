import { arrayCountCreateWith, createSignal, superCall } from 'wy-helper';
import {
  drawRect,
  renderCanvas,
  renderNode,
  renderRect,
} from 'mve-dom-helper/canvasRender';
import { hookDestroy, renderArrayKey, renderIf } from 'mve-helper';
import { subscribeRequestAnimationFrame } from 'wy-dom-helper';
import { fdom } from 'mve-dom';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

{
  const font = new FontFace(
    'Noto Sans SC',
    'url(/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2)'
  );
  await font.load();
  (document.fonts as any).add(font);
}

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
  const canvasEl = fdom.canvas({
    s_width: `${CANVAS_WIDTH}px`,
    s_height: `${CANVAS_HEIGHT}px`,
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
  });
  renderCanvas(canvasEl, {
    children() {
      // 初始化粒子
      renderRect({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        draw(ctx) {
          // 清除画布 + 背景渐变
          ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
          gradient.addColorStop(0, '#0f0f23');
          gradient.addColorStop(0.5, '#1a1a2e');
          gradient.addColorStop(1, '#16213e');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          superCall(this, 'draw', ctx);
        },
        children() {
          // 渲染连接线
          renderNode({
            x: 0,
            y: 0,
            draw(ctx) {
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
              renderNode({
                x: () => getParticle().x - getParticle().size,
                y: () => getParticle().y - getParticle().size,
                draw(ctx) {
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
            renderNode({
              x: () => mouseX.get() - 30,
              y: () => mouseY.get() - 30,
              draw(ctx) {
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
          renderRect({
            x: 20,
            y: 20,
            width: 240,
            height: 118,
            draw(ctx) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              drawRect.call(this, ctx);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.lineWidth = 1;
              ctx.strokeRect(
                0.5,
                0.5,
                this.outerWidth() - 1,
                this.outerHeight() - 1
              );
              ctx.textAlign = 'left';
              ctx.textBaseline = 'top';
              ctx.font = '700 16px "Noto Sans SC", sans-serif';
              ctx.fillStyle = '#ffffff';
              ctx.fillText('🌟 粒子星空控制台', 10, 10);
              ctx.font = '12px "Noto Sans SC", sans-serif';
              ctx.fillStyle = 'rgb(78, 205, 196)';
              ctx.fillText(`粒子数量: ${particles.get().length}`, 10, 34);
              ctx.fillStyle = 'rgb(69, 183, 209)';
              ctx.fillText(
                `连接数量: ${calculateConnections().length}`,
                10,
                52
              );
              ctx.font = '11px "Noto Sans SC", sans-serif';
              ctx.fillStyle = 'rgb(254, 202, 87)';
              ctx.fillText('💡 移动鼠标吸引粒子', 10, 74);
              ctx.fillStyle = 'rgb(255, 159, 243)';
              ctx.fillText('🎆 点击创建爆炸效果', 10, 92);
            },
          });

          // 性能指示器
          renderRect({
            x: 780,
            y: 20,
            width: 200,
            height: 60,
            draw(ctx) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              drawRect.call(this, ctx);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.lineWidth = 1;
              ctx.strokeRect(
                0.5,
                0.5,
                this.outerWidth() - 1,
                this.outerHeight() - 1
              );
              ctx.textAlign = 'left';
              ctx.textBaseline = 'top';
              ctx.font = '700 14px "Noto Sans SC", sans-serif';
              ctx.fillStyle = '#ffffff';
              ctx.fillText('⚡ 性能监控', 10, 10);
              ctx.font = '12px "Noto Sans SC", sans-serif';
              ctx.fillStyle = 'rgb(38, 222, 129)';
              ctx.fillText('FPS: ~60', 10, 34);
            },
          });

          hookDestroy(
            subscribeRequestAnimationFrame(function () {
              updateParticles(CANVAS_WIDTH, CANVAS_HEIGHT);
            })
          );
        },
      });
    },
  });
}
