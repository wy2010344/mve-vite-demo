import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
// import vitePluginRequire from "vite-plugin-require";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: path.resolve(__dirname), // apps/demo 的路径
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  server: {
    port: 5364,
    watch:
      process.env.VITE_USE_POLLING === 'true'
        ? {
            usePolling: true,
            interval: 1000,
            ignored: ['**/node_modules/**'], // 忽略 node_modules 目录
          }
        : undefined,
  },
  base: './',
  build: {
    outDir: './docs',
    commonjsOptions: {
      transformMixedEsModules: true, // 处理混合模块
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'), // 例如 @/components → src/components
    },
    preserveSymlinks: false,
  },
  optimizeDeps: {
    // 显式包含依赖，确保其被正确预构建
    include: [
      'history', // 确保 history 被正确预构建
      'konva',
    ],
  },
  plugins: [tailwindcss()],
});
