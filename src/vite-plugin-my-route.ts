import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

function scanPagesDir(pagesDir: string): string[] {
  const files: string[] = [];

  function scan(dir: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        scan(itemPath); // 递归扫描子目录
      } else if (stat.isFile() && item.endsWith('.ts')) {
        files.push(itemPath); // 记录 .ts 文件
      }
    }
  }

  scan(pagesDir);
  return files;
}

function generateRouteContent(files: string[], pagesDir: string): string {
  let content = 'export default {\n';

  for (const file of files) {
    // 计算相对路径（去掉 pagesDir 前缀和 .ts 后缀）
    const relativePath = path
      .relative(pagesDir, file)
      .replace(/\.ts$/, '')
      .replace(/\\/g, '/'); // 将 Windows 路径分隔符转换为 Unix 风格

    console.log("files", relativePath)
    // 生成动态导入代码
    content += `  '${relativePath}'() {\n`;
    content += `    return import('./pages/${relativePath}');\n`;
    content += '  },\n';
  }

  content += '};\n';
  return content;
}

export default function myVitePlugin(): Plugin {

  const watchFolder = path.resolve(__dirname, './pages')

  function rebuild() {

    const outputFile = path.resolve(__dirname, './route.ts'); // 输出文件路径

    // 扫描 pages 目录
    const files = scanPagesDir(watchFolder);

    // 生成 route.ts 内容
    const content = generateRouteContent(files, watchFolder);

    // 写入 route.ts 文件
    fs.writeFileSync(outputFile, content);

    console.log('Generated route.ts successfully!');
  }
  return {
    name: 'vite-plugin-my-routes',
    buildStart() {
      rebuild()
    },
    watchChange(id, change) {
      if (id.startsWith(watchFolder) && change.event != 'update') {
        rebuild()
      }
    },
  };
}