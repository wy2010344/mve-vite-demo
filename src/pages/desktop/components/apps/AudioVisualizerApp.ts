import { dom, fdom } from 'mve-dom';
import { createSignal, addEffect } from 'wy-helper';
import { panel } from '../WindowManager';

const VISUALIZER_TYPES = ['bars', 'wave', 'circular', 'particles'];

export const AudioVisualizerApp = panel(function (info) {
  return {
    title: '音频可视化',
    icon: '🎵',
    width: 800,
    height: 600,
    children() {
      const isPlaying = createSignal(false);
      const visualizerType = createSignal<string>('bars');
      const sensitivity = createSignal(1.5);
      const colorScheme = createSignal('rainbow');

      let canvas: HTMLCanvasElement;
      let ctx: CanvasRenderingContext2D;
      let animationId: number;
      let audioContext: AudioContext;
      let analyser: AnalyserNode;
      let dataArray: Uint8Array;
      let oscillator: OscillatorNode;

      function initAudio() {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        // 创建一个测试音调
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        oscillator.connect(analyser);
        analyser.connect(audioContext.destination);
      }

      function getColor(index: number, total: number, value: number) {
        const schemes: Record<string, () => string> = {
          rainbow: () =>
            `hsl(${(index / total) * 360}, 100%, ${50 + value / 5}%)`,
          fire: () => `hsl(${60 - value / 4}, 100%, ${50 + value / 5}%)`,
          ocean: () => `hsl(${200 + value / 10}, 100%, ${50 + value / 5}%)`,
          neon: () => `hsl(${(index / total) * 360}, 100%, 50%)`,
        };
        return schemes[colorScheme.get()]?.() || schemes.rainbow();
      }

      function drawBars() {
        if (!ctx || !canvas || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / dataArray.length;

        dataArray.forEach((value, i) => {
          const height = (value / 255) * canvas.height * sensitivity.get();
          const x = i * barWidth;
          const y = canvas.height - height;

          ctx.fillStyle = getColor(i, dataArray.length, value);
          ctx.fillRect(x, y, barWidth - 2, height);
        });
      }

      function drawWave() {
        if (!ctx || !canvas || !analyser) return;

        analyser.getByteTimeDomainData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 3;
        ctx.strokeStyle = getColor(0, 1, 128);
        ctx.beginPath();

        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        dataArray.forEach((value, i) => {
          const v = (value / 128.0) * sensitivity.get();
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        });

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      function drawCircular() {
        if (!ctx || !canvas || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.5;

        dataArray.forEach((value, i) => {
          const angle = (i / dataArray.length) * Math.PI * 2;
          const length = (value / 255) * radius * sensitivity.get();

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + length);
          const y2 = centerY + Math.sin(angle) * (radius + length);

          ctx.strokeStyle = getColor(i, dataArray.length, value);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      }

      function drawParticles() {
        if (!ctx || !canvas || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        dataArray.forEach((value, i) => {
          if (value > 50) {
            const angle = (i / dataArray.length) * Math.PI * 2;
            const distance =
              (value / 255) * Math.min(centerX, centerY) * sensitivity.get();

            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = (value / 255) * 10;

            ctx.fillStyle = getColor(i, dataArray.length, value);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      function animate() {
        const drawFunctions: Record<string, () => void> = {
          bars: drawBars,
          wave: drawWave,
          circular: drawCircular,
          particles: drawParticles,
        };

        const drawFn = drawFunctions[visualizerType.get()] || drawBars;
        drawFn();

        animationId = requestAnimationFrame(animate);
      }

      function togglePlay() {
        if (isPlaying.get()) {
          oscillator?.stop();
          if (animationId) cancelAnimationFrame(animationId);
          isPlaying.set(false);
        } else {
          if (!audioContext) initAudio();
          oscillator = audioContext.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.value = 440 + Math.random() * 440;
          oscillator.connect(analyser);
          oscillator.start();
          animate();
          isPlaying.set(true);
        }
      }

      addEffect(() => {
        if (canvas) {
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          ctx = canvas.getContext('2d')!;
        }

        return () => {
          if (animationId) cancelAnimationFrame(animationId);
          if (oscillator) oscillator.stop();
          if (audioContext) audioContext.close();
        };
      });

      return fdom.div({
        className: 'w-full h-full flex flex-col bg-black',
        children() {
          // 控制面板
          fdom.div({
            className:
              'h-20 bg-gray-900 border-b border-gray-800 flex items-center px-6 gap-6',
            children() {
              // 播放按钮
              fdom.button({
                className:
                  'w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center text-2xl',
                onClick: togglePlay,
                childrenType: 'text',
                children() {
                  return isPlaying.get() ? '⏸' : '▶';
                },
              });

              // 可视化类型
              fdom.div({
                className: 'flex gap-2',
                children() {
                  VISUALIZER_TYPES.forEach(type => {
                    fdom.button({
                      className: 'px-4 py-2 rounded text-sm capitalize',
                      s_backgroundColor() {
                        return visualizerType.get() === type
                          ? '#6366f1'
                          : '#374151';
                      },
                      s_color: '#fff',
                      onClick() {
                        visualizerType.set(type);
                      },
                      childrenType: 'text',
                      children: type,
                    });
                  });
                },
              });

              // 灵敏度
              fdom.div({
                className: 'flex items-center gap-2',
                children() {
                  fdom.span({
                    className: 'text-white text-sm',
                    childrenType: 'text',
                    children: '灵敏度:',
                  });
                  fdom.input({
                    type: 'range',
                    min: '0.5',
                    max: '3',
                    step: '0.1',
                    value() {
                      return `${sensitivity.get()}`;
                    },
                    onInput(e) {
                      sensitivity.set(
                        parseFloat((e.target as HTMLInputElement).value)
                      );
                    },
                    className: 'w-32',
                  });
                },
              });

              // 配色方案
              fdom.select({
                className: 'px-3 py-2 bg-gray-800 text-white rounded',
                value() {
                  return colorScheme.get();
                },
                onInput(e: any) {
                  colorScheme.set((e.target as HTMLSelectElement).value);
                },
                children() {
                  ['rainbow', 'fire', 'ocean', 'neon'].forEach(scheme => {
                    fdom.option({
                      value: scheme,
                      childrenType: 'text',
                      children:
                        scheme.charAt(0).toUpperCase() + scheme.slice(1),
                    });
                  });
                },
              });
            },
          });

          // Canvas 可视化区域
          canvas = dom
            .canvas({
              className: 'flex-1',
            })
            .render();

          // 提示文字
          fdom.div({
            className:
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none',
            s_opacity() {
              return isPlaying.get() ? 0 : 1;
            },
            s_transition: 'opacity 0.5s',
            childrenType: 'text',
            children: '点击播放按钮开始音频可视化',
          });
        },
      });
    },
  };
});
