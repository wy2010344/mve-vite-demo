# hookMeasureSize 使用指南

## 🎯 正确的使用场景

`hookMeasureSize` 应该在以下情况使用：

### 1. 动态内容需要自适应尺寸

```typescript
// ✅ 正确：文本内容动态变化，需要根据内容调整容器大小
function renderDynamicButton(getText: () => string) {
  const size = hookMeasureSize()

  renderALayout({
    ...size, // 不设置固定 width/height，让内容决定尺寸
    render(button) {
      return fdom.button({
        plugin: size.plugin, // 测量这个元素的实际尺寸
        children: getText(), // 动态内容
      })
    },
  })
}
```

### 2. 复杂内容需要测量实际渲染尺寸

```typescript
// ✅ 正确：复杂的 SVG 图标，需要测量实际尺寸
function renderComplexIcon(renderIcon: () => void) {
  const size = hookMeasureSize()

  renderALayout({
    ...size,
    render(container) {
      return fdom.div({
        plugin: size.plugin,
        children() {
          fsvg.svg({
            // 复杂的 SVG 内容，尺寸不确定
            children: renderIcon,
          })
        },
      })
    },
  })
}
```

### 3. 第三方组件或未知尺寸的内容

```typescript
// ✅ 正确：集成第三方组件，尺寸未知
function renderThirdPartyWidget(widget: HTMLElement) {
  const size = hookMeasureSize()

  renderALayout({
    ...size,
    render(container) {
      return fdom.div({
        plugin: size.plugin,
        children() {
          // 插入第三方组件
          container.appendChild(widget)
        },
      })
    },
  })
}
```

## ❌ 错误的使用场景

### 1. 已知固定尺寸的组件

```typescript
// ❌ 错误：已经设置了固定尺寸，不需要测量
function renderFixedButton() {
  const size = hookMeasureSize() // 多余的

  renderALayout({
    width: 100, // 既然设置了固定尺寸
    height: 40, // 就不需要 hookMeasureSize
    ...size, // 这是多余的
    render(button) {
      return fdom.button({
        plugin: size.plugin, // 多余的测量
        children: '固定文本',
      })
    },
  })
}
```

### 2. 由布局系统管理尺寸的组件

```typescript
// ❌ 错误：在 flex 布局中，子元素尺寸由布局系统决定
renderALayout({
  layout() {
    return simpleFlex({ direction: 'x' })
  },
  render() {
    // 子元素会被 flex 布局自动分配尺寸
    const size = hookMeasureSize() // 不需要
    renderALayout({
      ...size, // 多余的
      render(child) {
        return fdom.div({
          plugin: size.plugin, // 多余的
          children: '内容',
        })
      },
    })
  },
})
```

### 3. 简单的 SVG 图形

```typescript
// ❌ 错误：简单的 SVG 图形，尺寸已知
function renderSimpleIcon() {
  const size = hookMeasureSize() // 不需要

  renderALayout({
    width: 24, // 图标尺寸固定
    height: 24, // 不需要测量
    ...size, // 多余的
    render(icon) {
      return fsvg.svg({
        width: 24,
        height: 24,
        children() {
          fsvg.circle({ cx: 12, cy: 12, r: 10 })
        },
      })
    },
  })
}
```

## 🔧 实际应用示例

在物理小球示例中，我们在状态按钮中正确使用了 `hookMeasureSize`：

```typescript
// 状态文本会动态变化，长度不确定
function renderDynamicStatusButton() {
  renderDynamicTextButton(() => {
    const ballsCount = balls.get().length
    const selectedCount = balls.get().filter((b) => b.selected).length
    const status = isPlaying.get() ? '运行中' : '已暂停'
    // 文本长度会根据数据动态变化
    return `${status} | 小球: ${ballsCount} | 选中: ${selectedCount}`
  }, onClick)
}
```

## 📝 总结

**使用 hookMeasureSize 的原则**：

- ✅ 内容决定尺寸时使用
- ✅ 尺寸未知或动态变化时使用
- ❌ 尺寸固定或由布局系统管理时不使用
- ❌ 简单内容或已知尺寸时不使用

记住：`hookMeasureSize` 是为了让组件根据**自身内容**决定尺寸，而不是被外部约束。
