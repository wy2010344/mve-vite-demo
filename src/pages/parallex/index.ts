import { fdom } from 'mve-dom';
import { OnScroll } from 'mve-dom-helper';
import { css } from 'wy-dom-helper';
import { createSignal } from 'wy-helper';

export default function () {
  // 鼠标位置信号
  const mouseX = createSignal(0);
  const mouseY = createSignal(0);

  fdom.div({
    className: `w-full h-full overflow-hidden relative ${s}`,
    onMouseMove(e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    children(container: HTMLElement) {
      // 创建滚动监听
      const scrollY: OnScroll = OnScroll.hookGet('y', container, {
        maxScroll() {
          return maxScrollY.get();
        },
      });
      const maxScrollY = scrollY.measureMaxScroll();

      // 视差背景层
      fdom.div({
        className: 'absolute inset-0 w-full h-full animated-gradient',
        s_transform() {
          return `translateY(${-scrollY.get() * 0.5}px)`;
        },
        s_background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`,
        s_zIndex: '-1',
      });

      // 主要内容区域
      const content = fdom.div({
        className: 'relative min-h-[300vh]',
        s_transform() {
          return `translateY(${-scrollY.get()}px)`;
        },
        children() {
          // 标题区域 - 视差效果
          fdom.div({
            className: 'h-screen flex items-center justify-center relative',
            children() {
              // 背景装饰元素
              fdom.div({
                className: 'absolute inset-0 opacity-20 parallax-layer',
                s_transform() {
                  return `translateY(${-scrollY.get() * 0.3}px)`;
                },
                children() {
                  for (let i = 0; i < 8; i++) {
                    fdom.div({
                      className: 'absolute rounded-full bg-white pulse-glow',
                      s_width: `${30 + i * 20}px`,
                      s_height: `${30 + i * 20}px`,
                      s_left: `${10 + i * 12}%`,
                      s_top: `${5 + (i % 4) * 25}%`,
                      s_transform() {
                        const rotation =
                          scrollY.get() * 0.05 * (i % 2 === 0 ? 1 : -1);
                        const mouseInfluence =
                          (mouseX.get() * 10 + mouseY.get() * 5) * (i + 1);
                        return `translateY(${
                          -scrollY.get() * (0.1 + i * 0.03)
                        }px) rotate(${rotation}deg) translateX(${mouseInfluence}px)`;
                      },
                      s_animationDelay: `${i * 0.5}s`,
                    });
                  }
                },
              });

              // 主标题
              fdom.div({
                className:
                  'text-center text-white z-10 relative parallax-layer',
                s_transform() {
                  const mouseOffsetX = mouseX.get() * 20;
                  const mouseOffsetY = mouseY.get() * 20;
                  return `translateY(${
                    -scrollY.get() * 0.2
                  }px) translateX(${mouseOffsetX}px) translateY(${mouseOffsetY}px)`;
                },
                children() {
                  fdom.h1({
                    className:
                      'text-4xl sm:text-6xl md:text-8xl font-bold mb-6 float-animation',
                    s_opacity() {
                      const opacity = Math.max(0, 1 - scrollY.get() / 300);
                      return opacity.toString();
                    },
                    s_transform() {
                      const scale = Math.max(0.8, 1 - scrollY.get() / 1000);
                      const mouseScale =
                        1 +
                        Math.abs(mouseX.get()) * 0.05 +
                        Math.abs(mouseY.get()) * 0.05;
                      return `scale(${scale * mouseScale})`;
                    },
                    s_textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    s_background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                    s_backgroundClip: 'text',
                    s_WebkitBackgroundClip: 'text',
                    s_WebkitTextFillColor: 'transparent',
                    childrenType: 'text',
                    children: 'Parallax Title',
                  });

                  fdom.p({
                    className: 'text-xl md:text-2xl opacity-90',
                    s_transform() {
                      return `translateY(${scrollY.get() * 0.1}px)`;
                    },
                    s_opacity() {
                      const opacity = Math.max(0, 1 - scrollY.get() / 400);
                      return opacity.toString();
                    },
                    s_textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    childrenType: 'text',
                    children: '使用 MVE 框架实现的视差滚动效果',
                  });

                  // 添加滚动提示
                  fdom.div({
                    className: 'mt-12 animate-bounce',
                    s_opacity() {
                      const opacity = Math.max(0, 1 - scrollY.get() / 200);
                      return opacity.toString();
                    },
                    children() {
                      fdom.div({
                        className:
                          'w-6 h-10 border-2 border-white rounded-full flex justify-center',
                        children() {
                          fdom.div({
                            className:
                              'w-1 h-3 bg-white rounded-full mt-2 animate-pulse',
                          });
                        },
                      });
                      fdom.p({
                        className: 'text-sm mt-2 opacity-70',
                        childrenType: 'text',
                        children: '向下滚动',
                      });
                    },
                  });
                },
              });
            },
          });

          // 内容区域1
          fdom.div({
            className: 'min-h-screen bg-white relative z-10',
            s_transform() {
              return `translateY(${-scrollY.get() * 0.1}px)`;
            },
            children() {
              fdom.div({
                className: 'container mx-auto px-8 py-20',
                children() {
                  fdom.h2({
                    className:
                      'text-4xl font-bold text-gray-800 mb-8 text-center',
                    childrenType: 'text',
                    children: '第一部分内容',
                  });

                  for (let i = 0; i < 3; i++) {
                    fdom.div({
                      className: 'mb-8 p-6 bg-gray-50 rounded-lg',
                      s_transform() {
                        const offset = scrollY.get() - 400;
                        return `translateY(${Math.max(
                          0,
                          offset * (0.05 + i * 0.02)
                        )}px)`;
                      },
                      children() {
                        fdom.h3({
                          className: 'text-2xl font-semibold mb-4',
                          childrenType: 'text',
                          children: `内容块 ${i + 1}`,
                        });
                        fdom.p({
                          className: 'text-gray-600 leading-relaxed',
                          childrenType: 'text',
                          children:
                            '这是一个演示视差滚动效果的内容块。随着页面滚动，不同的元素会以不同的速度移动，创造出层次感和深度感。',
                        });
                      },
                    });
                  }
                },
              });
            },
          });

          // 中间视差区域
          fdom.div({
            className: 'h-screen relative overflow-hidden',
            s_background: `linear-gradient(45deg, #f093fb 0%, #f5576c 100%)`,
            children() {
              // 背景粒子效果
              fdom.div({
                className: 'absolute inset-0',
                s_transform() {
                  return `translateY(${-scrollY.get() * 0.4}px)`;
                },
                children() {
                  // 大粒子
                  for (let i = 0; i < 12; i++) {
                    fdom.div({
                      className: 'absolute bg-white opacity-10',
                      s_width: `${50 + Math.random() * 100}px`,
                      s_height: `${50 + Math.random() * 100}px`,
                      s_borderRadius: '50%',
                      s_left: `${Math.random() * 100}%`,
                      s_top: `${Math.random() * 100}%`,
                      s_transform() {
                        const rotation =
                          scrollY.get() * 0.1 * (i % 2 === 0 ? 1 : -1);
                        const mouseEffect =
                          mouseX.get() * (10 + i * 2) + mouseY.get() * (5 + i);
                        return `translateY(${
                          -scrollY.get() * (0.2 + i * 0.02)
                        }px) rotate(${rotation}deg) translateX(${mouseEffect}px)`;
                      },
                    });
                  }

                  // 小粒子
                  for (let i = 0; i < 20; i++) {
                    fdom.div({
                      className: 'absolute bg-white opacity-20',
                      s_width: `${5 + Math.random() * 15}px`,
                      s_height: `${5 + Math.random() * 15}px`,
                      s_borderRadius: '50%',
                      s_left: `${Math.random() * 100}%`,
                      s_top: `${Math.random() * 100}%`,
                      s_transform() {
                        const speed = 0.3 + i * 0.01;
                        const mouseEffect =
                          mouseX.get() * (5 + i) + mouseY.get() * (3 + i * 0.5);
                        return `translateY(${
                          -scrollY.get() * speed
                        }px) translateX(${mouseEffect}px)`;
                      },
                    });
                  }
                },
              });

              // 中间标题
              fdom.div({
                className: 'absolute inset-0 flex items-center justify-center',
                s_transform() {
                  return `translateY(${-scrollY.get() * 0.15}px)`;
                },
                children() {
                  fdom.h2({
                    className: 'text-5xl font-bold text-white text-center',
                    s_opacity() {
                      const start = 800;
                      const end = 1200;
                      const current = scrollY.get();
                      if (current < start) return '0';
                      if (current > end) return '0';
                      const progress = (current - start) / (end - start);
                      return Math.sin(progress * Math.PI).toString();
                    },
                    childrenType: 'text',
                    children: '视差中间区域',
                  });
                },
              });
            },
          });

          // 内容区域2
          fdom.div({
            className: 'min-h-screen bg-gray-900 text-white relative z-10',
            children() {
              fdom.div({
                className: 'container mx-auto px-8 py-20',
                children() {
                  fdom.h2({
                    className: 'text-4xl font-bold mb-8 text-center',
                    s_transform() {
                      const offset = scrollY.get() - 1400;
                      return `translateY(${Math.max(0, -offset * 0.1)}px)`;
                    },
                    childrenType: 'text',
                    children: '第二部分内容',
                  });

                  // 卡片网格
                  fdom.div({
                    className:
                      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
                    children() {
                      for (let i = 0; i < 6; i++) {
                        fdom.div({
                          className: 'bg-gray-800 p-6 rounded-lg',
                          s_transform() {
                            const offset = scrollY.get() - 1600;
                            const delay = i * 50;
                            return `translateY(${Math.max(
                              0,
                              -(offset - delay) * 0.08
                            )}px)`;
                          },
                          s_opacity() {
                            const offset = scrollY.get() - 1600;
                            const delay = i * 50;
                            const opacity = Math.min(
                              1,
                              Math.max(0, (offset - delay) / 200)
                            );
                            return opacity.toString();
                          },
                          children() {
                            fdom.h3({
                              className: 'text-xl font-semibold mb-3',
                              childrenType: 'text',
                              children: `特性 ${i + 1}`,
                            });
                            fdom.p({
                              className: 'text-gray-300',
                              childrenType: 'text',
                              children:
                                '这是一个展示视差滚动效果的卡片，每个卡片都有独特的动画时机。',
                            });
                          },
                        });
                      }
                    },
                  });
                },
              });
            },
          });

          // 结尾区域
          fdom.div({
            className: 'h-screen flex items-center justify-center relative',
            s_background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
            children() {
              fdom.div({
                className: 'text-center text-white',
                s_transform() {
                  return `translateY(${-scrollY.get() * 0.05}px)`;
                },
                children() {
                  fdom.h2({
                    className: 'text-5xl font-bold mb-4',
                    s_transform() {
                      const offset = scrollY.get() - 2400;
                      return `scale(${Math.min(
                        1.2,
                        Math.max(0.8, 1 + offset * 0.0001)
                      )})`;
                    },
                    childrenType: 'text',
                    children: '感谢观看',
                  });
                  fdom.p({
                    className: 'text-xl opacity-80',
                    childrenType: 'text',
                    children: 'MVE 框架视差滚动演示完成',
                  });
                },
              });
            },
          });
        },
      });

      // 导航栏
      fdom.nav({
        className: 'absolute top-4 left-1/2 transform -translate-x-1/2 z-50',
        s_opacity() {
          return scrollY.get() > 100 ? '1' : '0';
        },
        s_transform() {
          const translateY = scrollY.get() > 100 ? '0' : '-20px';
          return `translateX(-50%) translateY(${translateY})`;
        },
        s_transition: 'all 0.3s ease',
        children() {
          fdom.div({
            className:
              'bg-black bg-opacity-20 backdrop-blur-md rounded-full px-6 py-3 flex space-x-4',
            children() {
              const sections = ['首页', '内容1', '中间', '内容2', '结尾'];
              sections.forEach((section, index) => {
                fdom.button({
                  className:
                    'text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium',
                  childrenType: 'text',
                  children: section,
                  onClick() {
                    const targetScroll = index * 800;
                    scrollY.scrollTo(targetScroll);
                  },
                });
              });
            },
          });
        },
      });

      // 滚动进度指示器
      fdom.div({
        className:
          'absolute top-0 left-0 w-full h-1 bg-black bg-opacity-20 z-40',
        children() {
          fdom.div({
            className:
              'h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100',
            s_width() {
              const maxScroll = maxScrollY.get();
              if (maxScroll === 0) return '0%';
              const progress = Math.min(100, (scrollY.get() / maxScroll) * 100);
              return `${progress}%`;
            },
          });
        },
      });

      // 初始化最大滚动距离
      maxScrollY.hookInit(container, content);
    },
  });
}

const s = css`
  /* 视差背景渐变动画 */
  @keyframes parallax-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animated-gradient {
    background-size: 200% 200%;
    animation: parallax-gradient 15s ease infinite;
  }

  /* 浮动动画 */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  /* 脉冲效果 */
  @keyframes pulse-glow {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
    }
  }

  .pulse-glow {
    animation: pulse-glow 4s ease-in-out infinite;
  }
`;
