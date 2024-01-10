import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/Api': {
        target: 'http://221.130.54.58:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/Api/, ""),
      },
    }
  }
})
