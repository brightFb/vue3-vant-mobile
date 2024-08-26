import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import viewport from 'postcss-mobile-forever'
import autoprefixer from 'autoprefixer'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(),

    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: '',
          ws: false,
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
      },
    },

    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: '#app',
            viewportWidth: 375,
            maxDisplayWidth: 600,
            rootContainingBlockSelectorList: [
              'van-tabbar',
              'van-popup',
            ],
          }),
        ],
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks: {
            // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
            vue: ['vue', 'vue-router', 'pinia'],
            vant: ['vant'],
            // sentry: ['@sentry/vue'],
            // echarts: ['echarts'],
          },
        },
      },
    },

    optimizeDeps: { include, exclude },
  }
}
