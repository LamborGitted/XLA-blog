import { fileURLToPath, URL } from 'node:url'
import type { UserConfig } from 'vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-md'
import { createHighlighter } from 'shiki'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['ts', 'js', 'vue', 'bash', 'json', 'rust', 'cpp', 'nix']
  })

  const config: UserConfig = {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Markdown({
        markdownItOptions: {
          html: true,
        },
        markdownItSetup(md) {
          md.options.highlight = (code, lang) => {
            return highlighter.codeToHtml(code, {
              lang: lang || 'text',
              theme: 'github-dark'
            })
          }
        }
      }),
      // 构建分析
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        open: false
      }),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),

      },
    },
    build: {
      // 代码分割配置
      rollupOptions: {
        output: {
          // 手动分包：将大型依赖分离到单独的 chunk
          manualChunks(id: string) {
            // Vue 核心库
            if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/') || id.includes('node_modules/vue-router/')) {
              return 'vue-vendor'
            }
            // Markdown 和高亮库
            if (id.includes('node_modules/markdown-it/') || id.includes('node_modules/shiki/')) {
              return 'markdown-vendor'
            }
            // 安全和工具库
            if (id.includes('node_modules/dompurify/')) {
              return 'utils-vendor'
            }
            // 其他 node_modules 包
            if (id.includes('node_modules/')) {
              return 'vendor'
            }
          }
        }
      },
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // chunk 大小警告阈值
      chunkSizeWarningLimit: 500,
      // 生产环境不生成 source map（减小体积）
      sourcemap: false,
      // CSS 最小化
      cssMinify: true,
      // 目标浏览器（Cloudflare 支持现代浏览器）
      target: 'es2015'
    },
    // 生产环境移除 console 和 debugger
    esbuild: {
      drop: ['console', 'debugger']
    },
    // 依赖预构建优化
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'dompurify',
        'markdown-it',
        'vue-icons-plus'
      ]
    }
  }

  return config
})
