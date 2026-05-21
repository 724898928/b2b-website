import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { viteMockPlugin } from './mock/vite-plugin-mock.js'

export default defineConfig(({ mode }) => {
  // 在开发模式下默认启用 mock
  const useMock = process.env.USE_MOCK === 'true' || mode === 'development' || mode === 'serve'

  return {
    plugins: [
      vue(),
      viteMockPlugin({ 
        enable: useMock,
        log: true,
        port: 8787
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: './dist',
      emptyOutDir: true
    }
  }
})
