import { defineConfig } from 'vite'
export default defineConfig({
	server:{
		port:4000, 
		fs: {
      // Allow serving files from one level up to the project root
      allow: ['.','..','/','/node_modules/']
    }
	},
})