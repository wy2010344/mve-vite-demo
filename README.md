# mve-vite-demo

基于 [mve](https://github.com/wy2010344/mve) 信号驱动框架的示例集，50+ 个真实交互场景。

▶ **[在线体验（GitHub Pages）](https://wy2010344.github.io/mve-vite-demo/)** ｜ 框架文档：[mve](https://wy2010344.github.io/mve/)

![demo](demo.gif)

## 精选示例

| 示例 | 说明 |
| --- | --- |
| `kanban-board` | 拖拽看板，跨列移动 + 持久化 |
| `depth-chart` | 深度图 / 金融图表绘制 |
| `virtual-list` | 虚拟列表（定高、动态高度、反向滚动） |
| `staggered-grid-animation` | 瀑布流布局与位移动画 |
| `three` | Three.js 集成（crossy-road、earth、rapier 物理等） |
| `map-analysis` | 高德地图聚合标记与自定义渲染 |
| `custom-scroll` | 自定义滚动行为与滚动吸附 |
| `canvas-v2-demo` / `mve-canvas` | Canvas 渲染 |
| `rich-text` / `markdown-parse` | 富文本与 Markdown 解析渲染 |
| `calendar` / `contacts` / `taskist` | 完整业务型页面 |

> 完整列表见 `src/pages/`，站点内通过路由可直接切换。

## 技术栈

mve（信号驱动）· TypeScript · Vite · Tailwind / DaisyUI · Three.js · 高德地图

## 本地运行

```bash
pnpm install
pnpm run dev
```

部署由 GitHub Actions 自动完成（push 到 main/master 即发布 Pages）。
