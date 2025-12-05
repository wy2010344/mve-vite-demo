# 桌面系统 - 前端技术展示平台

一套完整的酷炫桌面系统，展示 MVE 框架的强大能力和顶级前端技巧。

## 🎯 核心组件

- **Desktop** - 桌面主界面，带壁纸和图标网格
- **DockBar** - 底部应用栏，鼠标悬停放大效果（类似 macOS）
- **Window Manager** - 基于 daisy-mobile-helper 的窗口系统

## 🚀 高级应用展示

### 1. 💻 代码编辑器 (CodeEditorApp)

**技术亮点：**

- 实时代码执行沙箱
- 动态字体大小调整（带 spring 动画）
- 行号同步显示
- 多语言支持切换

### 2. 🎨 协作白板 (WhiteboardApp)

**技术亮点：**

- Canvas 实时绘图
- 多用户光标模拟
- 画笔/橡皮工具切换
- 路径平滑渲染

### 3. ✨ 粒子画板 (ParticleApp)

**技术亮点：**

- 实时粒子系统模拟
- 重力物理引擎
- 粒子生命周期管理
- 动态参数调节

### 4. 🎲 3D 魔方 (RubiksCubeApp)

**技术亮点：**

- CSS 3D Transform 实现
- 拖拽旋转视角
- 魔方旋转逻辑
- 打乱算法

### 5. 🎵 音频可视化器 (AudioVisualizerApp)

**技术亮点：**

- Web Audio API 频谱分析
- 4 种可视化模式（柱状图、波形、圆形、粒子）
- 实时音频数据处理
- 动态配色方案

### 6. 🎶 音乐播放器 (MusicApp)

- 旋转动画专辑封面
- 播放列表管理
- 播放控制

### 7. 🖼️ 照片应用 (PhotosApp)

- 网格布局展示
- 图片预览模态框

### 8. ⚙️ 设置面板 (SettingsApp)

- 多级设置项
- 主题切换

## 💡 技术亮点

### 动画系统

- `animateSignal` + `tween(duration, easeFns.xxx)` 实现缓动动画
- `spring()` 实现物理弹性动画
- 自定义动画曲线（quad, cubic, circ, back, elastic, bounce）

### 响应式系统

- MVE 框架的 signal 响应式
- `memo` 计算属性
- `addEffect` 副作用管理

### Canvas 渲染

- 实时粒子系统
- 音频频谱可视化
- 协作绘图

### 3D 渲染

- CSS 3D Transform
- perspective 透视
- transform-style: preserve-3d

### 窗口管理

- 基于 daisy-mobile-helper 的 panel 系统
- 动态导入（code splitting）
- 窗口拖拽、调整大小

## 🎨 设计特色

- 毛玻璃效果（backdrop-blur）
- 渐变色彩方案
- 流畅的过渡动画
- 响应式布局
- Tailwind CSS 工具类

## 📦 模块化设计

每个应用都是独立的模块，使用 `panel` 函数定义：

```typescript
export const MyApp = panel(function (info) {
  return {
    title: '应用标题',
    icon: '🎯',
    width: 800,
    height: 600,
    children() {
      // 应用内容
    },
  };
});
```

## 🔥 性能优化

- 动态导入减少初始加载
- Canvas 离屏渲染
- requestAnimationFrame 优化动画
- Signal 精确更新
