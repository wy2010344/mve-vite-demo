import { fdom } from 'mve-dom'
import { hookDestroy } from 'mve-helper'
import { subscribeEventListener } from 'wy-dom-helper'
import {
  createSignal,
  emptyObject,
  StoreRef,
  ValueOrGet,
  valueOrGetToGet,
} from 'wy-helper'

// Tilt 效果配置接口
interface TiltConfig {
  maxTilt?: number // 最大倾斜角度，默认 15
  scale?: number // 悬停时的缩放，默认 1
  glareOpacity?: number // 光泽透明度，默认 0.3
  // transition?: string // 过渡动画，默认 '0.1s ease-out'
  perspective?: number // 透视距离，默认 1000
  reverse?: boolean // 是否反转倾斜方向，默认 false
  gyroscopeMultiplier?: number // 陀螺仪敏感度，默认 1
}
// 检测是否为移动设备
function isMobileDevice(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

let gyroscopePermission = false
/**
 *  window.addEventListener('deviceorientation', handleDeviceOrientation, {
      passive: true,
    })
    // glareOpacityValue.set(glareOpacity * 0.7) // 稍微降低陀螺仪模式的光泽强度

 * @returns 
 */
// 请求陀螺仪权限（iOS 13+）
async function requestGyroscopePermission() {
  if (gyroscopePermission) {
    return true
  }
  if ('DeviceOrientationEvent' in window) {
    try {
      // 检查是否需要权限请求（iOS 13+）
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission()
        gyroscopePermission = permission === 'granted'
      } else {
        // Android 或较老的 iOS 版本
        gyroscopePermission = true
      }
    } catch (error) {
      console.warn('陀螺仪权限请求失败:', error)
    }
  }
  return gyroscopePermission
}
function getTiltEffect({
  reverse: _reverse = false,
  offsetX: _mouseOffsetX = 0,
  offsetY: _mouseOffsetY = 0,
  maxTilt: _maxTilt = 15,
}: {
  /**-0.5 ~ 0.5 */
  offsetY?: ValueOrGet<number>
  offsetX?: ValueOrGet<number>
  /**是否反向 */
  reverse?: ValueOrGet<boolean>
  /**最大倾斜角度，默认 15 */
  maxTilt?: ValueOrGet<number>
}) {
  const offsetX = valueOrGetToGet(_mouseOffsetX)
  const offsetY = valueOrGetToGet(_mouseOffsetY)
  const reverse = valueOrGetToGet(_reverse)
  const maxTilt = valueOrGetToGet(_maxTilt)
  function dir() {
    return reverse() ? -1 : 1
  }
  function tiltIntensity() {
    // 基于鼠标偏移计算强度，更简单直接
    const x = offsetX()
    const y = offsetY()
    return Math.min(1, Math.sqrt(x * x + y * y) * 2) // 最大距离是 sqrt(0.5²+0.5²) ≈ 0.707
  }
  const shadowOffset = () => {
    const intensity = tiltIntensity()
    return {
      x: offsetX() * 20 * intensity, // -10px 到 +10px
      y: offsetY() * 20 * intensity, // -10px 到 +10px
      blur: 10 + intensity * 20, // 10px 到 30px
    }
  }

  return {
    dir,
    offsetX,
    offsetY,
    tiltIntensity,
    shadowOffset,
    rotateX() {
      return dir() * offsetX() * maxTilt()
    },
    rotateY() {
      return dir() * offsetY() * maxTilt()
    },
    glareX() {
      return Math.max(10, Math.min(90, 50 + offsetX() * 60)) // -0.5到0.5 映射到 20%到80%
    },
    glareY() {
      return Math.max(10, Math.min(90, 50 + offsetY() * 60)) // -0.5到0.5 映射到 20%到80%
    },
  }
}

function createOffset({
  offsetX = createSignal(0),
  offsetY = createSignal(0),
}: {
  offsetX?: StoreRef<number>
  offsetY?: StoreRef<number>
} = emptyObject) {
  const isActive = createSignal(false)
  return {
    offsetX: offsetX.get,
    offsetY: offsetY.get,
    isActive: isActive.get,
    start() {
      if (isActive.get()) {
        return
      }
      isActive.set(true)
    },
    updateWithRect(
      rect: {
        left: number
        width: number
        top: number
        height: number
      },
      clientX: number,
      clientY: number
    ) {
      if (!isActive.get()) {
        return
      }
      // 只需要设置原始偏移，所有其他效果都会自动计算
      offsetX.set((clientX - rect.left) / rect.width - 0.5)
      offsetY.set((clientY - rect.top) / rect.height - 0.5)
    },
    updateWithDevice(
      e: {
        beta: number | null
        gamma: number | null
      },
      /**陀螺仪敏感度，默认 1*/
      gyroscopeMultiplier = 1
    ) {
      if (!isActive.get()) {
        return
      }

      const beta = e.beta || 0 // 前后倾斜 (-180 到 180)
      const gamma = e.gamma || 0 // 左右倾斜 (-90 到 90)
      // 将设备方向转换为标准化偏移 (-0.5 到 0.5)
      const x = (gamma / 90) * 0.5 * gyroscopeMultiplier
      const y = (beta / 180) * 0.5 * gyroscopeMultiplier

      // 限制范围并设置状态
      offsetX.set(Math.max(-0.5, Math.min(0.5, x)))
      offsetY.set(Math.max(-0.5, Math.min(0.5, y)))
    },
    reset() {
      if (!isActive.get()) {
        return
      }
      isActive.set(false)
      offsetX.set(0)
      offsetX.set(0)
    },
  }
}

function hookPointer(
  content: HTMLElement,
  of: ReturnType<typeof createOffset>
) {
  content.addEventListener('pointerenter', of.start)
  content.addEventListener('pointermove', (e) => {
    of.updateWithRect(content.getBoundingClientRect(), e.clientX, e.clientY)
  })
  content.addEventListener('pointerup', of.reset)
  return of
}

function hookTouch(content: HTMLElement, of: ReturnType<typeof createOffset>) {
  content.addEventListener('touchstart', of.start)
  content.addEventListener('touchmove', (e) => {
    of.updateWithRect(
      content.getBoundingClientRect(),
      e.touches[0].clientX,
      e.touches[0].clientY
    )
  })
  content.addEventListener('touchend', of.reset)
  return of
}
function hookMouse(content: HTMLElement, of: ReturnType<typeof createOffset>) {
  content.addEventListener('mouseenter', of.start)
  content.addEventListener('mousemove', (e) => {
    of.updateWithRect(content.getBoundingClientRect(), e.clientX, e.clientY)
  })
  content.addEventListener('mouseleave', of.reset)
  return of
}
// 通用的 Tilt 卡片组件
function createTiltCard(config: {
  className?: string
  tiltConfig?: TiltConfig
  children: (
    tilt: ReturnType<typeof getTiltEffect>,
    of: ReturnType<typeof createOffset>,
    parent: HTMLElement
  ) => void // 传递 tilt 对象给 children
}) {
  const { className = '', tiltConfig = {}, children } = config
  const of = createOffset()
  const args = getTiltEffect({
    offsetX: of.offsetX,
    offsetY: of.offsetY,
    maxTilt: tiltConfig?.maxTilt,
    reverse: tiltConfig?.reverse,
  })
  const glareOpacity = tiltConfig?.glareOpacity ?? 0.3
  const maxScale = tiltConfig?.scale ?? 1
  const c = fdom.div({
    className: `relative cursor-pointer ${className}`,
    s_perspective: 1000 + 'px',
    s_transformStyle: 'preserve-3d',
    children(c: HTMLDivElement) {
      fdom.div({
        className: 'w-full h-full',
        s_transform() {
          return `rotateX(${args.rotateX()}deg) rotateY(${args.rotateY()}deg) scale(${
            of.isActive() ? maxScale : 1
          })`
        },
        children() {
          // 光泽效果层
          fdom.div({
            className: 'absolute inset-0 pointer-events-none rounded-inherit',
            s_background() {
              return `radial-gradient(circle at ${args.glareX()}% ${args.glareY()}%, rgba(255,255,255,0.8) 0%, transparent 50%)`
            },
            s_opacity() {
              return of.isActive() ? glareOpacity : 0
            },
            s_transition: 'opacity 0.1s ease-out',
          })
          // 用户内容 - 传递 tilt 对象
          children(args, of, c)
        },
      })
    },
  })
}

export default function () {
  fdom.div({
    className:
      'w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8 overflow-auto',
    children() {
      fdom.div({
        className: 'max-w-6xl mx-auto',
        children() {
          // 标题
          fdom.h1({
            className: 'text-4xl font-bold text-white text-center mb-8',
            childrenType: 'text',
            children: 'Tilt Hover Effects - 移动端支持版本',
          })

          // 移动端说明和权限请求
          fdom.div({
            className: 'text-center mb-8',
            children() {
              const isMobile = isMobileDevice()

              if (isMobile) {
                fdom.div({
                  className:
                    'bg-blue-900/30 backdrop-blur-sm rounded-lg p-4 mb-4',
                  children() {
                    fdom.p({
                      className: 'text-white/80 text-sm mb-3',
                      childrenType: 'text',
                      children: '📱 移动端模式：支持触摸交互和陀螺仪效果',
                    })

                    fdom.button({
                      className:
                        'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      childrenType: 'text',
                      children: '启用陀螺仪效果',
                      async onClick() {
                        try {
                          const out = await requestGyroscopePermission()
                          if (out) {
                            alert('您的设备已支持陀螺仪效果！')
                          } else {
                            alert('陀螺仪权限被拒绝')
                          }
                        } catch (error) {
                          alert('陀螺仪权限请求失败')
                        }
                      },
                    })
                  },
                })
              } else {
                fdom.p({
                  className: 'text-white/60 text-sm',
                  childrenType: 'text',
                  children: '🖱️ 桌面端模式：鼠标悬停查看效果',
                })
              }
            },
          })

          // 卡片网格 - 使用通用方法
          fdom.div({
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
            children() {
              // 标准卡片
              createSimpleCard({
                title: 'Standard Tilt',
                description: '标准的倾斜效果',
                color: 'from-blue-500 to-purple-600',
                icon: '🎯',
              })

              // 强烈倾斜效果
              createSimpleCard({
                title: 'Strong Tilt',
                description: '更强烈的倾斜效果',
                color: 'from-green-500 to-teal-600',
                icon: '⚡',
                tiltConfig: { maxTilt: 25, scale: 1.1 },
              })

              // 反向倾斜
              createSimpleCard({
                title: 'Reverse Tilt',
                description: '反向倾斜效果',
                color: 'from-pink-500 to-rose-600',
                icon: '✨',
                tiltConfig: { reverse: true },
              })

              // 无光泽效果
              createSimpleCard({
                title: 'No Glare',
                description: '无光泽的倾斜效果',
                color: 'from-orange-500 to-red-600',
                icon: '🎨',
                tiltConfig: {},
              })

              // 无缩放效果
              createSimpleCard({
                title: 'No Scale',
                description: '无缩放的倾斜效果',
                color: 'from-indigo-500 to-blue-600',
                icon: '�',
                tiltConfig: {},
              })

              // 自定义配置
              createSimpleCard({
                title: 'Custom Config',
                description: '自定义配置的效果',
                color: 'from-purple-500 to-pink-600',
                icon: '📧',
                tiltConfig: {
                  maxTilt: 20,
                  scale: 1.08,
                  glareOpacity: 0.5,
                },
              })
            },
          })

          // 大型展示卡片 - 使用通用方法
          fdom.div({
            className: 'mt-16',
            children() {
              createLargeCard()
            },
          })

          // 不同形状的卡片示例
          fdom.div({
            className: 'mt-16',
            children() {
              fdom.h2({
                className: 'text-2xl font-bold text-white text-center mb-8',
                childrenType: 'text',
                children: '不同形状和配置',
              })

              fdom.div({
                className: 'grid grid-cols-1 md:grid-cols-2 gap-8',
                children() {
                  // 圆形卡片
                  createCircleCard()

                  // 按钮样式
                  createButtonCard()
                },
              })
            },
          })

          // 移动端专用示例
          if (isMobileDevice()) {
            fdom.div({
              className: 'mt-16',
              children() {
                fdom.h2({
                  className: 'text-2xl font-bold text-white text-center mb-8',
                  childrenType: 'text',
                  children: '移动端专用配置',
                })

                fdom.div({
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-8',
                  children() {
                    // 陀螺仪敏感度测试
                    createMobileCard({
                      title: '陀螺仪标准',
                      description: '标准陀螺仪敏感度',
                      color: 'from-emerald-500 to-teal-600',
                      icon: '📱',
                      tiltConfig: { gyroscopeMultiplier: 1 },
                    })

                    createMobileCard({
                      title: '陀螺仪增强',
                      description: '增强陀螺仪敏感度',
                      color: 'from-violet-500 to-purple-600',
                      icon: '🔄',
                      tiltConfig: { gyroscopeMultiplier: 2 },
                    })

                    createMobileCard({
                      title: '仅触摸模式',
                      description: '禁用陀螺仪，仅触摸',
                      color: 'from-amber-500 to-orange-600',
                      icon: '👆',
                    })

                    createMobileCard({
                      title: '仅陀螺仪模式',
                      description: '禁用触摸，仅陀螺仪',
                      color: 'from-rose-500 to-pink-600',
                      icon: '🌀',
                    })
                  },
                })
              },
            })
          }
        },
      })
    },
  })
}

// 简单卡片 - 使用通用 Tilt 方法
function createSimpleCard(config: {
  title: string
  description: string
  color: string
  icon: string
  tiltConfig?: TiltConfig
}) {
  createTiltCard({
    className: 'group',
    tiltConfig: config.tiltConfig,
    children(tilt) {
      fdom.div({
        className: `relative w-full h-64 bg-gradient-to-br ${config.color} rounded-xl shadow-2xl overflow-hidden`,
        children() {
          // 卡片内容
          fdom.div({
            className: 'relative z-10 p-6 h-full flex flex-col justify-between',
            s_transform: 'translateZ(50px)',
            children() {
              fdom.div({
                children() {
                  fdom.div({
                    className: 'text-4xl mb-4',
                    s_transform: 'translateZ(20px)',
                    childrenType: 'text',
                    children: config.icon,
                  })

                  fdom.h3({
                    className: 'text-xl font-bold text-white mb-3',
                    s_transform: 'translateZ(30px)',
                    childrenType: 'text',
                    children: config.title,
                  })

                  fdom.p({
                    className: 'text-white/80 text-sm leading-relaxed',
                    s_transform: 'translateZ(20px)',
                    childrenType: 'text',
                    children: config.description,
                  })
                },
              })

              fdom.div({
                className: 'flex items-center justify-between mt-4',
                s_transform: 'translateZ(40px)',
                children() {
                  fdom.button({
                    className:
                      'bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors',
                    childrenType: 'text',
                    children: '了解更多',
                  })

                  fdom.div({
                    className: 'text-white/60 text-xs',
                    childrenType: 'text',
                    children: isMobileDevice()
                      ? '触摸或倾斜设备'
                      : '悬停查看效果',
                  })
                },
              })
            },
          })

          // 边框光效
          fdom.div({
            className: 'absolute inset-0 rounded-xl border border-white/10',
          })
        },
      })
    },
  })
}

// 大型卡片 - 展示计算属性的使用
function createLargeCard() {
  createTiltCard({
    tiltConfig: {
      maxTilt: 10,
      scale: 1.02,
      glareOpacity: 0.2,
      // transition: '0.15s ease-out',
      perspective: 1200,
    },
    children(tilt) {
      // 现在可以直接使用传入的 tilt 对象和其计算属性
      fdom.div({
        className:
          'relative w-full h-80 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl overflow-hidden',
        s_boxShadow() {
          // 使用计算属性创建动态阴影
          const shadow = tilt.shadowOffset()
          return `${shadow.x}px ${shadow.y}px ${shadow.blur}px rgba(0,0,0,0.3)`
        },
        children() {
          // 动态背景网格 - 基于倾斜强度调整透明度
          fdom.div({
            className: 'absolute inset-0',
            s_backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            s_backgroundSize: '20px 20px',
            s_opacity() {
              // 基于倾斜强度动态调整背景透明度
              return (0.1 + tilt.tiltIntensity() * 0.2).toString()
            },
          })

          // 内容区域
          fdom.div({
            className:
              'relative z-10 p-8 h-full flex items-center justify-between',
            s_transform: 'translateZ(60px)',
            children() {
              fdom.div({
                className: 'flex-1',
                s_transform: 'translateZ(20px)',
                children() {
                  fdom.h2({
                    className: 'text-3xl font-bold text-white mb-4',
                    childrenType: 'text',
                    children: '计算属性演示卡片',
                  })

                  fdom.p({
                    className: 'text-gray-300 text-lg leading-relaxed mb-6',
                    childrenType: 'text',
                    children:
                      '展示计算属性：动态阴影、背景透明度、倾斜强度等都基于 rotateX/Y 自动计算。',
                  })

                  // 倾斜强度指示器
                  fdom.div({
                    className: 'mb-4',
                    children() {
                      fdom.div({
                        className: 'text-sm text-gray-400 mb-2',
                        childrenType: 'text',
                        children: '倾斜强度:',
                      })

                      fdom.div({
                        className: 'w-full bg-gray-700 rounded-full h-2',
                        children() {
                          fdom.div({
                            className:
                              'bg-blue-500 h-2 rounded-full transition-all duration-100',
                            s_width() {
                              return `${tilt.tiltIntensity() * 100}%`
                            },
                          })
                        },
                      })
                    },
                  })

                  fdom.div({
                    className: 'flex space-x-4',
                    children() {
                      fdom.button({
                        className:
                          'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors',
                        s_transform: 'translateZ(10px)',
                        childrenType: 'text',
                        children: '主要操作',
                      })

                      fdom.button({
                        className:
                          'bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm',
                        s_transform: 'translateZ(10px)',
                        childrenType: 'text',
                        children: '次要操作',
                      })
                    },
                  })
                },
              })

              // 右侧装饰 - 基于倾斜强度动态缩放
              fdom.div({
                className: 'flex-shrink-0 ml-8',
                s_transform() {
                  const intensity = tilt.tiltIntensity()
                  const scale = 1 + intensity * 0.1 // 1.0 到 1.1
                  return `translateZ(40px) scale(${scale})`
                },
                children() {
                  fdom.div({
                    className:
                      'w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl',
                    childrenType: 'text',
                    children: '🚀',
                  })
                },
              })
            },
          })

          // 边框 - 基于倾斜强度动态发光
          fdom.div({
            className: 'absolute inset-0 rounded-2xl border border-white/10',
            s_boxShadow() {
              const intensity = tilt.tiltIntensity()
              return `inset 0 0 ${10 + intensity * 20}px rgba(255,255,255,${
                intensity * 0.1
              })`
            },
          })
        },
      })
    },
  })
}

// 圆形卡片示例
function createCircleCard() {
  createTiltCard({
    tiltConfig: {
      maxTilt: 20,
      scale: 1.1,
      glareOpacity: 0.4,
    },
    children(tilt) {
      fdom.div({
        className:
          'w-64 h-64 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center mx-auto',
        children() {
          fdom.div({
            className: 'text-center text-white',
            s_transform: 'translateZ(50px)',
            children() {
              fdom.div({
                className: 'text-6xl mb-4',
                childrenType: 'text',
                children: '🌟',
              })
              fdom.h3({
                className: 'text-xl font-bold',
                childrenType: 'text',
                children: '圆形卡片',
              })
              fdom.p({
                className: 'text-sm opacity-80 mt-2',
                childrenType: 'text',
                children: '强烈倾斜效果',
              })
            },
          })
        },
      })
    },
  })
}

// 按钮样式卡片
function createButtonCard() {
  fdom.div({
    className: 'flex flex-wrap gap-4 justify-center',
    children() {
      // 不同配置的按钮
      const buttons = [
        { text: '标准按钮', config: {} },
        { text: '强烈效果', config: { maxTilt: 25, scale: 1.15 } },
        { text: '反向倾斜', config: { reverse: true } },
        { text: '无光泽', config: { enableGlare: false } },
      ]

      buttons.forEach((button) => {
        createTiltCard({
          tiltConfig: button.config,
          children(tilt) {
            fdom.button({
              className:
                'px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg',
              s_transform: 'translateZ(20px)',
              childrenType: 'text',
              children: button.text,
            })
          },
        })
      })
    },
  })
}

// 移动端专用卡片
function createMobileCard(config: {
  title: string
  description: string
  color: string
  icon: string
  tiltConfig?: TiltConfig
}) {
  createTiltCard({
    className: 'group',
    tiltConfig: config.tiltConfig,
    children(tilt) {
      fdom.div({
        className: `relative w-full h-64 bg-gradient-to-br ${config.color} rounded-xl shadow-2xl overflow-hidden`,
        children() {
          // 移动端特殊指示器
          fdom.div({
            className:
              'absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2',
            children() {
              fdom.div({
                className: 'text-white text-xs font-medium',
                childrenType: 'text',
                children: '📱',
              })
            },
          })

          // 卡片内容
          fdom.div({
            className: 'relative z-10 p-6 h-full flex flex-col justify-between',
            s_transform: 'translateZ(50px)',
            children() {
              fdom.div({
                children() {
                  fdom.div({
                    className: 'text-4xl mb-4',
                    s_transform: 'translateZ(20px)',
                    childrenType: 'text',
                    children: config.icon,
                  })

                  fdom.h3({
                    className: 'text-xl font-bold text-white mb-3',
                    s_transform: 'translateZ(30px)',
                    childrenType: 'text',
                    children: config.title,
                  })

                  fdom.p({
                    className: 'text-white/80 text-sm leading-relaxed',
                    s_transform: 'translateZ(20px)',
                    childrenType: 'text',
                    children: config.description,
                  })
                },
              })

              fdom.div({
                className: 'flex items-center justify-between mt-4',
                s_transform: 'translateZ(40px)',
                children() {
                  fdom.button({
                    className:
                      'bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors',
                    childrenType: 'text',
                    children: '测试效果',
                  })

                  fdom.div({
                    className: 'text-white/60 text-xs',
                    childrenType: 'text',
                    children: '触摸或倾斜设备',
                  })
                },
              })
            },
          })

          // 边框光效
          fdom.div({
            className: 'absolute inset-0 rounded-xl border border-white/10',
          })
        },
      })
    },
  })
}
