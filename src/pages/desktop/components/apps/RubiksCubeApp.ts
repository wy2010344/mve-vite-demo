import { fdom } from 'mve-dom';
import { createSignal, tween, easeFns } from 'wy-helper';
import { animateSignal } from 'wy-dom-helper';
import { panel } from '../WindowManager';

type Face = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
type CubeState = Record<Face, string[][]>;

const COLORS = {
  front: '#ff0000', // 红
  back: '#ff8800', // 橙
  left: '#00ff00', // 绿
  right: '#0000ff', // 蓝
  top: '#ffffff', // 白
  bottom: '#ffff00', // 黄
};

function createSolvedCube(): CubeState {
  const cube: any = {};
  Object.keys(COLORS).forEach(face => {
    cube[face] = Array(3)
      .fill(null)
      .map(() => Array(3).fill(COLORS[face as Face]));
  });
  return cube;
}

export const RubiksCubeApp = panel(function (info) {
  return {
    title: '3D 魔方',
    icon: '🎲',
    width: 700,
    height: 600,
    children() {
      const cube = createSignal<CubeState>(createSolvedCube());
      const rotationX = animateSignal(-30);
      const rotationY = animateSignal(45);
      const moves = createSignal(0);
      const isAnimating = createSignal(false);

      let isDragging = false;
      let lastX = 0;
      let lastY = 0;

      function rotateFace(face: Face) {
        if (isAnimating.get()) return;

        isAnimating.set(true);
        moves.set(moves.get() + 1);

        // 简化版旋转逻辑
        const current = cube.get();
        const newCube = JSON.parse(JSON.stringify(current));

        // 旋转面本身
        const temp = newCube[face][0][0];
        newCube[face][0][0] = newCube[face][2][0];
        newCube[face][2][0] = newCube[face][2][2];
        newCube[face][2][2] = newCube[face][0][2];
        newCube[face][0][2] = temp;

        const temp2 = newCube[face][0][1];
        newCube[face][0][1] = newCube[face][1][0];
        newCube[face][1][0] = newCube[face][2][1];
        newCube[face][2][1] = newCube[face][1][2];
        newCube[face][1][2] = temp2;

        setTimeout(() => {
          cube.set(newCube);
          isAnimating.set(false);
        }, 300);
      }

      function shuffle() {
        if (isAnimating.get()) return;

        const faces: Face[] = [
          'front',
          'back',
          'left',
          'right',
          'top',
          'bottom',
        ];
        let count = 0;
        const shuffleCount = 20;

        const doShuffle = () => {
          if (count < shuffleCount) {
            const randomFace = faces[Math.floor(Math.random() * faces.length)];
            rotateFace(randomFace);
            count++;
            setTimeout(doShuffle, 350);
          }
        };

        moves.set(0);
        doShuffle();
      }

      function reset() {
        cube.set(createSolvedCube());
        moves.set(0);
      }

      return fdom.div({
        className:
          'w-full h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800',
        children() {
          // 控制面板
          fdom.div({
            className:
              'h-16 bg-gray-800/50 backdrop-blur border-b border-gray-700 flex items-center px-6 gap-6',
            children() {
              fdom.div({
                className: 'text-white',
                children() {
                  fdom.span({
                    className: 'text-gray-400 text-sm',
                    childrenType: 'text',
                    children: '移动次数: ',
                  });
                  fdom.span({
                    className: 'font-bold text-xl text-green-400',
                    childrenType: 'text',
                    children() {
                      return `${moves.get()}`;
                    },
                  });
                },
              });

              fdom.div({ className: 'flex-1' });

              fdom.button({
                className:
                  'px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium',
                childrenType: 'text',
                children: '🔀 打乱',
                onClick: shuffle,
              });

              fdom.button({
                className:
                  'px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white',
                childrenType: 'text',
                children: '🔄 重置',
                onClick: reset,
              });
            },
          });

          // 3D 魔方显示区
          fdom.div({
            className:
              'flex-1 flex items-center justify-center perspective-1000',
            onPointerDown(e) {
              isDragging = true;
              lastX = e.clientX;
              lastY = e.clientY;
            },
            onPointerMove(e) {
              if (!isDragging) return;
              const deltaX = e.clientX - lastX;
              const deltaY = e.clientY - lastY;

              rotationY.set(rotationY.get() + deltaX * 0.5);
              rotationX.set(
                Math.max(-90, Math.min(90, rotationX.get() + deltaY * 0.5))
              );

              lastX = e.clientX;
              lastY = e.clientY;
            },
            onPointerUp() {
              isDragging = false;
            },
            children() {
              fdom.div({
                className: 'relative',
                s_transform() {
                  return `rotateX(${rotationX.get()}deg) rotateY(${rotationY.get()}deg)`;
                },
                s_transformStyle: 'preserve-3d',
                s_transition: 'transform 0.1s',
                children() {
                  // 绘制魔方的六个面
                  const faces: { face: Face; transform: string }[] = [
                    { face: 'front', transform: 'translateZ(75px)' },
                    {
                      face: 'back',
                      transform: 'translateZ(-75px) rotateY(180deg)',
                    },
                    {
                      face: 'left',
                      transform: 'translateX(-75px) rotateY(-90deg)',
                    },
                    {
                      face: 'right',
                      transform: 'translateX(75px) rotateY(90deg)',
                    },
                    {
                      face: 'top',
                      transform: 'translateY(-75px) rotateX(90deg)',
                    },
                    {
                      face: 'bottom',
                      transform: 'translateY(75px) rotateX(-90deg)',
                    },
                  ];

                  faces.forEach(({ face, transform }) => {
                    fdom.div({
                      className:
                        'absolute w-[150px] h-[150px] grid grid-cols-3 gap-1 p-1 bg-black/80 cursor-pointer',
                      s_transform: transform,
                      s_transformStyle: 'preserve-3d',
                      onClick() {
                        rotateFace(face);
                      },
                      children() {
                        cube.get()[face].forEach(row => {
                          row.forEach(color => {
                            fdom.div({
                              className: 'rounded border-2 border-black/50',
                              s_backgroundColor: color,
                            });
                          });
                        });
                      },
                    });
                  });
                },
              });
            },
          });

          // 提示文字
          fdom.div({
            className:
              'absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center',
            children() {
              fdom.div({
                childrenType: 'text',
                children: '拖拽旋转视角 • 点击面进行旋转',
              });
            },
          });
        },
      });
    },
  };
});
