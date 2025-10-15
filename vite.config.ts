import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import viteImportMap from 'wy-helper/viteImportmap';
import path from 'path';
// import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
  root: path.resolve(__dirname), // apps/demo 的路径
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**'], // 忽略 node_modules 目录
    },
  },
  base: './',
  build: {
    outDir: './docs',
    commonjsOptions: {
      transformMixedEsModules: true, // 处理混合模块
    },
    rollupOptions: {
      // 应用包需要打包所有依赖，不应该有 external
      // 但需要特殊处理 workspace 依赖的外部引用
      output: {
        // 确保正确处理动态导入
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    // dedupe: ['wy-helper', 'wy-dom-helper', 'mve-core', 'mve-dom'],
    alias: {
      '~': path.resolve(__dirname, 'src'), // 例如 @/components → src/components
    },
    // 确保能正确解析 node_modules 中的依赖
    preserveSymlinks: false,
  },
  optimizeDeps: {
    // 显式包含依赖，确保其被正确预构建
    include: [
      'wy-helper',
      'wy-dom-helper',
      'mve-core',
      'mve-helper',
      'mve-dom',
      'mve-dom-helper',
      'daisy-mobile-helper',
      'history', // 确保 history 被正确预构建
    ],
  },
  plugins: [
    tailwindcss(),
    // 自定义插件来处理 workspace 依赖的外部引用
    {
      name: 'resolve-workspace-externals',
      resolveId(id, importer) {
        // 如果是从 workspace 包中导入 history，将其解析为实际的 node_modules 路径
        if (
          id === 'history' &&
          importer &&
          importer.includes('daisy-mobile-helper')
        ) {
          return path.resolve(__dirname, 'node_modules/history/index.js');
        }
        return null;
      },
    },
  ],
});
