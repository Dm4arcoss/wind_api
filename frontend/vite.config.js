import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/products': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/categories': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/orders': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/customers': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/dashboard': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/users': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/profile': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})