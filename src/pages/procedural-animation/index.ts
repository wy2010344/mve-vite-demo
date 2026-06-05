import { createSignal, addEffect } from 'wy-helper';
import { fdom } from 'mve-dom';

// 简单的噪声函数，模拟 Processing 的 noise() 函数
function noise(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f);
  return Math.sin(x * 1.57079632679) * 0.5 + 0.5;
}

export default function ProceduralAnimation() {
  // 鱼的状态
  const position = createSignal({ x: 100, y: 200 });
  const angle = createSignal(0);
  const phase = createSignal(0);
  const speed = createSignal(2);
  const canvasWidth = createSignal(800);
  const canvasHeight = createSignal(400);
  const noiseOffset = createSignal(Math.random() * 1000);

  // 动画循环
  const animate = () => {
    const currentPhase = phase.get() + 0.1;
    phase.set(currentPhase);

    const currentPos = position.get();
    const currentAngle = angle.get();
    const currentSpeed = speed.get();
    const currentNoiseOffset = noiseOffset.get();

    // 使用噪声函数生成更自然的转向
    const noiseValue = noise(currentNoiseOffset);
    const turnAmount = (noiseValue - 0.5) * 0.1;
    const newAngle = currentAngle + turnAmount;
    angle.set(newAngle);

    // 更新位置
    const newX = currentPos.x + Math.cos(newAngle) * currentSpeed;
    const newY = currentPos.y + Math.sin(newAngle) * currentSpeed;

    // 边界检查和转向
    if (newX < 50) {
      position.set({ x: 50, y: newY });
      angle.set(Math.PI - newAngle);
    } else if (newX > canvasWidth.get() - 50) {
      position.set({ x: canvasWidth.get() - 50, y: newY });
      angle.set(Math.PI - newAngle);
    } else if (newY < 50) {
      position.set({ x: newX, y: 50 });
      angle.set(-newAngle);
    } else if (newY > canvasHeight.get() - 50) {
      position.set({ x: newX, y: canvasHeight.get() - 50 });
      angle.set(-newAngle);
    } else {
      position.set({ x: newX, y: newY });
    }

    // 更新噪声偏移
    noiseOffset.set(currentNoiseOffset + 0.01);

    requestAnimationFrame(animate);
  };

  // 启动动画
  addEffect(() => {
    requestAnimationFrame(animate);
  });

  // 绘制鱼的函数
  const drawFish = (ctx: CanvasRenderingContext2D) => {
    const pos = position.get();
    const ang = angle.get();
    const ph = phase.get();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(ang);

    // 绘制鱼身体
    const bodyLength = 40;
    const bodyHeight = 20;

    // 身体跟随尾巴摆动
    const bodyPhase = Math.sin(ph * 2) * 0.05;
    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyLength, bodyHeight, bodyPhase, 0, Math.PI * 2);
    ctx.fill();

    // 绘制胸鳍
    const finPhase = Math.sin(ph * 3) * 0.5;
    ctx.fillStyle = '#2980b9';

    // 左侧胸鳍
    ctx.beginPath();
    ctx.moveTo(-bodyLength * 0.7, 0);
    ctx.lineTo(-bodyLength, -bodyHeight * 0.8 + finPhase * 5);
    ctx.lineTo(-bodyLength, bodyHeight * 0.8 - finPhase * 5);
    ctx.closePath();
    ctx.fill();

    // 右侧胸鳍
    ctx.beginPath();
    ctx.moveTo(bodyLength * 0.2, -bodyHeight * 0.3);
    ctx.lineTo(bodyLength * 0.4, -bodyHeight * 0.8);
    ctx.lineTo(bodyLength * 0.6, -bodyHeight * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bodyLength * 0.2, bodyHeight * 0.3);
    ctx.lineTo(bodyLength * 0.4, bodyHeight * 0.8);
    ctx.lineTo(bodyLength * 0.6, bodyHeight * 0.3);
    ctx.closePath();
    ctx.fill();

    // 绘制尾巴
    const tailPhase = Math.sin(ph * 2) * 0.5;
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(bodyLength, 0);
    ctx.lineTo(bodyLength + 20, -bodyHeight + tailPhase * 10);
    ctx.lineTo(bodyLength + 20, bodyHeight - tailPhase * 10);
    ctx.closePath();
    ctx.fill();

    // 绘制眼睛
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-bodyLength * 0.5, -bodyHeight * 0.25, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-bodyLength * 0.45, -bodyHeight * 0.25, 2, 0, Math.PI * 2);
    ctx.fill();

    // 绘制嘴巴
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-bodyLength * 0.7, -bodyHeight * 0.1);
    ctx.lineTo(-bodyLength * 0.8, 0);
    ctx.lineTo(-bodyLength * 0.7, bodyHeight * 0.1);
    ctx.stroke();

    ctx.restore();
  };

  return fdom.div({
    className: 'w-full h-screen flex justify-center items-center bg-sky-50',
    children() {
      const canvas = fdom.canvas({
        width: canvasWidth.get(),
        height: canvasHeight.get(),
        className: 'border border-gray-300 bg-sky-100',
      });

      addEffect(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 绘制循环
        const draw = () => {
          ctx.clearRect(0, 0, canvasWidth.get(), canvasHeight.get());
          drawFish(ctx);
          requestAnimationFrame(draw);
        };

        requestAnimationFrame(draw);
      });
    },
  });
}
