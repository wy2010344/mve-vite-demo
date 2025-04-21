import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import viteImportMap from 'wy-helper/viteImportmap'
import path from 'path'
// import vitePluginRequire from "vite-plugin-require";

export default defineConfig({
	server: {
		watch: {
			usePolling: true,
			interval: 1000,
			ignored: ['**/node_modules/**'], // 忽略 node_modules 目录
		}
	},
	base: './',
	build: {
		outDir: './docs',
		commonjsOptions: {
			transformMixedEsModules: true, // 处理混合模块
		}
	},
	plugins: [
		// viteImportMap({
		// 	watchFolder: path.resolve(__dirname, './src/pages'),
		// 	outputFile: path.resolve(__dirname, './src/route.ts')
		// }),
		tailwindcss(),
	],
})