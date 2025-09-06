import { arrayCountCreateWith, addEffect } from 'wy-helper'
import type { Ball, PhysicsParams } from './types'

// 颜色主题
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']

// 初始化小球
export function createBalls(count: number): Ball[] {
  return arrayCountCreateWith(count, (i) => ({
    id: i,
    x: Math.random() * 400 + 50,
    y: Math.random() * 200 + 50,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    radius: Math.random() * 15 + 10,
    color: colors[i % colors.length],
    selected: false,
    trail: []
  }))
}

// 物理更新
export function updateBallPhysics(balls: Ball[], params: PhysicsParams, showTrails: boolean): Ball[] {
  const { gravity, bounce, containerWidth, containerHeight } = params
  
  return balls.map(ball => {
    const newBall = { ...ball }
    
    // 更新位置
    newBall.x += newBall.vx
    newBall.y += newBall.vy
    
    // 重力
    newBall.vy += gravity
    
    // 边界碰撞
    if (newBall.x - newBall.radius <= 0) {
      newBall.x = newBall.radius
      newBall.vx *= -bounce
    }
    if (newBall.x + newBall.radius >= containerWidth) {
      newBall.x = containerWidth - newBall.radius
      newBall.vx *= -bounce
    }
    if (newBall.y - newBall.radius <= 0) {
      newBall.y = newBall.radius
      newBall.vy *= -bounce
    }
    if (newBall.y + newBall.radius >= containerHeight) {
      newBall.y = containerHeight - newBall.radius
      newBall.vy *= -bounce
    }
    
    // 小球间碰撞
    balls.forEach(other => {
      if (other.id !== ball.id) {
        const dx = newBall.x - other.x
        const dy = newBall.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = newBall.radius + other.radius
        
        if (distance < minDistance) {
          // 简单的弹性碰撞
          const angle = Math.atan2(dy, dx)
          const targetX = other.x + Math.cos(angle) * minDistance
          const targetY = other.y + Math.sin(angle) * minDistance
          
          newBall.x = targetX
          newBall.y = targetY
          
          const speed = Math.sqrt(newBall.vx * newBall.vx + newBall.vy * newBall.vy)
          newBall.vx = Math.cos(angle) * speed * 0.8
          newBall.vy = Math.sin(angle) * speed * 0.8
        }
      }
    })
    
    // 更新轨迹
    if (showTrails) {
      newBall.trail.push({ x: newBall.x, y: newBall.y, opacity: 1 })
      if (newBall.trail.length > 20) {
        newBall.trail.shift()
      }
      // 更新轨迹透明度
      newBall.trail.forEach((point, index) => {
        point.opacity = index / newBall.trail.length * 0.6
      })
    } else {
      newBall.trail = []
    }
    
    return newBall
  })
}

// 动画管理器
export class AnimationManager {
  private animationId: number | null = null
  
  constructor(
    private updateCallback: () => void,
    private isPlayingGetter: () => boolean
  ) {}
  
  start() {
    if (!this.animationId) {
      this.animate()
    }
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
  
  private animate = () => {
    this.updateCallback()
    
    if (this.isPlayingGetter()) {
      this.animationId = requestAnimationFrame(this.animate)
    } else {
      this.animationId = null
    }
  }
}