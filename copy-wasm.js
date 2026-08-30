import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('node_modules/canvaskit-wasm/bin');
const destDir = path.resolve('public/canvas-kit');

// 确保目标文件夹存在
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 复制文件
const files = ['canvaskit.js', 'canvaskit.wasm'];
files.forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log('✅ CanvasKit WASM 文件已自动同步到 public 目录！');
