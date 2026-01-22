import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'vite-plugin-md'
import { createHighlighter } from 'shiki'

// https://vite.dev/config/
export default defineConfig(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['ts', 'js', 'vue', 'bash', 'json', 'rust', 'cpp','nix']
  })

  return{
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
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@docs': fileURLToPath(new URL('./contact/docs', import.meta.url))
      },
    },
  }
})
