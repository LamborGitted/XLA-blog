---
subtitle:  Vite 插件开发
date:  2026-01-18
tags: [Vite, 插件开发, 构建工具, 前端工程化]
---

# Vite 插件开发实战指南(测试文档)

> 从零开始编写你的第一个 Vite 插件

---

## 什么是 Vite 插件

Vite 插件基于 Rollup 插件接口，可以在构建过程的各个阶段介入并转换代码。

### 插件的应用场景

* 文件转换（Markdown、Svelte、CSS Modules）
* 构建优化（代码压缩、Tree Shaking）
* HMR 增强
* 自定义资源处理
* 环境变量注入

---

## 插件基础结构

### 最简单的插件

```typescript
// my-plugin.ts
import type { Plugin } from 'vite'

export function myVitePlugin(): Plugin {
  return {
    name: 'my-vite-plugin',
    // 插件钩子
  }
}
```

### 使用插件

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { myVitePlugin } from './my-plugin'

export default defineConfig({
  plugins: [myVitePlugin()]
})
```

---

## 核心钩子函数

### 1. resolveId

解析模块 ID，可用于路径别名：

```typescript
export function myPlugin(): Plugin {
  return {
    name: 'resolve-plugin',
    resolveId(source) {
      if (source === 'virtual-module') {
        return '\0virtual-module' // \0 表示虚拟模块
      }
    }
  }
}
```

### 2. load

加载模块内容：

```typescript
export function myPlugin(): Plugin {
  return {
    name: 'load-plugin',
    resolveId(id) {
      if (id === '\0virtual-module') {
        return id
      }
    },
    load(id) {
      if (id === '\0virtual-module') {
        return `export const msg = "Hello from virtual module!"`
      }
    }
  }
}
```

### 3. transform

转换模块内容：

```typescript
export function myPlugin(): Plugin {
  return {
    name: 'transform-plugin',
    transform(code, id) {
      if (id.endsWith('.js')) {
        return code.replace(/console\.log\(/g, 'customLog(')
      }
    }
  }
}
```

---

## 实战插件 1：自动导入组件

```typescript
// auto-import-components.ts
import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export function autoImportComponents(): Plugin {
  const componentDir = 'src/components'

  return {
    name: 'auto-import-components',
    transform(code, id) {
      // 只处理 .vue 文件
      if (!id.endsWith('.vue')) return

      // 扫描组件目录
      const components = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.vue'))
        .map(file => file.replace('.vue', ''))

      // 生成导入语句
      const imports = components
        .map(name => `import ${name} from '/${componentDir}/${name}.vue'`)
        .join('\n')

      // 在 script 标签后插入导入
      const modifiedCode = code.replace(
        /<script setup>/,
        `<script setup>\n${imports}\n`
      )

      return {
        code: modifiedCode,
        map: null // 简化示例，实际应生成 source map
      }
    }
  }
}
```

---

## 实战插件 2：自定义 Markdown 转换

```typescript
// markdown-transformer.ts
import type { Plugin } from 'vite'
import { marked } from 'marked'

export function markdownTransformer(): Plugin {
  return {
    name: 'markdown-transformer',
    transform(code, id) {
      if (!id.endsWith('.md')) return

      // 转换 Markdown 为 HTML
      const html = marked(code)

      // 生成 Vue 组件代码
      const vueCode = `
        <template>
          <div class="markdown-content" v-html="html"></div>
        </template>

        <script setup>
          const html = ${JSON.stringify(html)}
        </script>

        <style>
          .markdown-content {
            line-height: 1.6;
          }
          .markdown-content h1 {
            font-size: 2em;
            font-weight: bold;
          }
        </style>
      `

      return {
        code: vueCode,
        map: null
      }
    }
  }
}
```

---

## 实战插件 3：环境变量加密

```typescript
// env-encrypt.ts
import type { Plugin } from 'vite'
import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-32-bytes!'

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

export function envEncrypt(): Plugin {
  return {
    name: 'env-encrypt',
    transform(code, id) {
      // 只处理主入口
      if (!id.includes('/main.ts')) return

      // 查找环境变量使用
      const envPattern = /import\.meta\.env\.(\w+)/g
      const matches = [...code.matchAll(envPattern)]

      let modifiedCode = code
      matches.forEach(match => {
        const envVar = process.env[match[1]]
        if (envVar) {
          const encrypted = encrypt(envVar)
          modifiedCode = modifiedCode.replace(
            match[0],
            `"${encrypted}"`
          )
        }
      })

      // 注入解密函数
      const decryptFn = `
        function decryptEnv(text: string): string {
          const [iv, encrypted] = text.split(':')
          const decipher = crypto.createDecipheriv(
            '${algorithm}',
            '${secretKey}',
            Buffer.from(iv, 'hex')
          )
          let decrypted = decipher.update(encrypted, 'hex', 'utf8')
          decrypted += decipher.final('utf8')
          return decrypted
        }
      `

      modifiedCode = modifiedCode.replace(
        "import { createApp } from 'vue'",
        `import { createApp } from 'vue'\nimport crypto from 'crypto'\n${decryptFn}`
      )

      return {
        code: modifiedCode,
        map: null
      }
    }
  }
}
```

---

## HMR 增强

处理热模块替换：

```typescript
export function hmrPlugin(): Plugin {
  return {
    name: 'hmr-enhance',
    handleHotUpdate({ file, modules }) {
      // 只处理 .vue 文件的 HMR
      if (file.endsWith('.vue')) {
        console.log(`[HMR] ${file} changed`)

        // 自定义 HMR 行为
        modules.forEach(mod => {
          // 发送自定义 HMR 事件
          this.emit('custom-hmr', {
            type: 'vue-update',
            path: file
          })
        })
      }
    }
  }
}
```

---

## 插件配置选项

```typescript
interface PluginOptions {
  include?: RegExp | string[]
  exclude?: RegExp | string[]
  transform?: (code: string, id: string) => string
}

export function configurablePlugin(options: PluginOptions): Plugin {
  const includePattern = options.include
    ? new RegExp(options.include as string)
    : null

  return {
    name: 'configurable-plugin',
    transform(code, id) {
      // 检查是否包含
      if (includePattern && !includePattern.test(id)) {
        return
      }

      // 检查是否排除
      if (options.exclude) {
        const excludePattern = new RegExp(options.exclude as string)
        if (excludePattern.test(id)) return
      }

      // 应用转换
      if (options.transform) {
        return options.transform(code, id)
      }
    }
  }
}
```

---

## 插件调试

```typescript
export function debugPlugin(): Plugin {
  return {
    name: 'debug-plugin',
    configureServer(server) {
      // 打印中间件信息
      server.middlewares.use((req, res, next) => {
        console.log(`[${req.method}] ${req.url}`)
        next()
      })
    },
    buildStart() {
      console.log('Build started')
    },
    buildEnd() {
      console.log('Build ended')
    },
    transform(code, id) {
      console.log(`Transforming: ${id}`)
    }
  }
}
```

---

## 插件最佳实践

### 1. 使用 TypeScript 类型

```typescript
import type { Plugin, ResolvedConfig } from 'vite'

export function typedPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'typed-plugin',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform(code, id) {
      // 使用 config
      if (config.command === 'serve') {
        // 开发模式
      } else {
        // 构建模式
      }
    }
  }
}
```

### 2. 虚拟模块命名规范

```typescript
// 使用 \0 前缀表示虚拟模块
const virtualModuleId = '\0my-virtual-module'
const resolvedVirtualModuleId = '\0my-virtual-module'

export function virtualModulePlugin(): Plugin {
  return {
    name: 'virtual-module',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return 'export default "virtual content"'
      }
    }
  }
}
```

### 3. 错误处理

```typescript
export function errorHandlingPlugin(): Plugin {
  return {
    name: 'error-handling',
    transform(code, id) {
      try {
        // 转换逻辑
        return processCode(code)
      } catch (error) {
        this.error(`Failed to transform ${id}: ${error.message}`)
      }
    }
  }
}
```

---

## 发布你的插件

### package.json

```json
{
  "name": "vite-plugin-my-plugin",
  "version": "1.0.0",
  "keywords": ["vite", "vite-plugin"],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"]
}
```

### 构建配置

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true
})
```

---

## 总结

Vite 插件开发的要点：

* ✅ 理解 Rollup 插件接口
* ✅ 选择合适的钩子函数
* ✅ 正确处理虚拟模块
* ✅ 做好错误处理和类型安全
* ✅ 编写清晰的文档和示例

Vite 插件系统强大而灵活，掌握它你就能：

> 为特定需求定制构建流程，提升开发效率

---

*相关资源：*

* [Vite 官方插件 API](https://vitejs.dev/guide/api-plugin.html)
* [Rollup 插件开发指南](https://rollupjs.org/plugin-development/)
* awesome-vite：精选 Vite 插件集合
