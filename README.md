# XL-Blog

> 一个现代化的 Vue 3 博客模板，支持 Markdown 文章管理与动态主题切换

[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[在线演示](https://blog.lantxx.com.cn)** | **[快速开始](#快速开始)** | **[功能特性](#功能特性)**

---

## 功能特性

✨ **Markdown 驱动** - 支持文章管理、代码高亮、前后导航

🎨 **动态主题** - 亮暗模式切换 + 色相滑块自定义主题色

🔒 **安全防护** - 集成 DOMPurify 防止 XSS 攻击

🔍 **智能搜索** - 实时搜索与文章过滤

🚀 **高性能** - 虚拟滚动、代码分割、懒加载优化

💎 **精美 UI** - 玻璃态设计、平滑过渡动画

---

## 快速开始

```bash
# 克隆项目
git clone https://github.com/LamborGitted/XL-Blog.git
cd XL-Blog

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:5173` 查看效果

---

## 技术栈

- **Vue 3** + **TypeScript** + **Vite**
- **Vue Router** - 路由管理
- **Markdown-it** + **Shiki** - Markdown 渲染与代码高亮
- **DOMPurify** - XSS 防护

---

## 项目结构

```
src/
├── contact/docs/     # Markdown 文章
├── client/
│   ├── component/    # Vue 组件
│   ├── composables/  # 组合式函数
│   └── domain/       # 领域模型
└── main.ts           # 应用入口
```

---

## 添加文章

在 `src/contact/docs/` 创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
tags: ['Vue', 'TypeScript']
---

# 内容开始...
```

---

## 构建部署

```bash
# 构建
pnpm build

# 预览
pnpm preview
```

构建产物位于 `dist/` 目录，可部署至 Vercel / Netlify / GitHub Pages

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**License**: [MIT](LICENSE) | 如果觉得有帮助，请给个 ⭐️

