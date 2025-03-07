import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	server: {
		watch: {
			usePolling: true,
			interval: 1000,
			ignored: ['**/node_modules/**'], // 忽略 node_modules 目录
		}
	},
	build: {
		outDir: './docs',
		commonjsOptions: {
			transformMixedEsModules: true, // 处理混合模块
		}
	},
	plugins: [
		tailwindcss()
	],
})