# XL-Blog 项目文档

## 项目概述

XL-Blog 是一个基于 Vue 3 + TypeScript + Vite 构建的现代化个人技术博客模板。采用 Markdown 驱动的内容管理方式，支持多种展示模式、主题切换和响应式设计。

**作者**: Lantxx
**包管理器**: pnpm
**Node.js 要求**: ^20.19.0 || >=22.12.0

## 核心技术栈

### 前端框架
- **Vue 3** (v3.5.26) - 使用 Composition API
- **TypeScript** (v5.9.3) - 严格模式
- **Vite** (v7.3.0) - 构建工具

### 主要依赖
- **Vue Router** (v4.6.4) - 路由管理
- **Markdown-it** (v14.1.0) - Markdown 解析
- **Shiki** (v3.21.0) - 代码高亮
- **DOMPurify** (v3.3.1) - XSS 防护
- **Vue Icons Plus** (v0.1.8) - 图标库

### 开发工具
- **Vitest** (v4.0.18) - 单元测试
- **Vue Test Utils** (v2.4.6) - 组件测试
- **ESLint** & **Prettier** - 代码规范

## 项目结构

```
XL-Blog/
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 根组件
│   ├── router/                   # 路由配置
│   ├── client/                   # 前端代码
│   │   ├── component/           # Vue 组件
│   │   │   ├── ArticleList.vue      # 文章列表
│   │   │   ├── ArticleRender.vue    # 文章渲染
│   │   │   ├── ControlPanel.vue     # 控制面板
│   │   │   ├── FilterPanel.vue      # 过滤面板
│   │   │   ├── PageTitle.vue        # 页面标题
│   │   │   ├── ProfileCard.vue      # 个人信息卡片
│   │   │   └── widget/             # 小组件
│   │   ├── composables/         # 组合式函数
│   │   ├── domain/               # 领域模型
│   │   ├── utils/                # 工具函数
│   │   ├── styles/               # 样式文件
│   │   └── views/                # 页面视图
│   └── contact/                  # 内容资源
│       ├── docs/                 # Markdown 文章
│       └── links.md             # 链接页面
├── public/                       # 静态资源
├── tests/unit/                   # 单元测试
└── [配置文件]
```

## 开发指南

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 运行测试
pnpm test
```

### 添加新文章

1. 在 `src/contact/docs/` 目录下创建 `.md` 文件
2. 文件名格式建议：`topic-subtitle.md`
3. 在文件顶部添加元数据：

```markdown
---
title: 文章标题
date: YYYY-MM-DD
subtitle: 文章副标题（可选）
tags: [tag1, tag2]（可选）
---

# 文章内容

使用 Markdown 语法编写...
```

### 路由配置

路由定义在 `src/router/index.ts`，支持两种类型：

1. **文章路由** - 自动从 `docs` 目录加载
2. **静态路由** - 如链接页面 (`/links`)

### 组件开发约定

#### 使用 Composition API
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

#### 组合式函数 (Composables)
位于 `src/client/composables/`，封装可复用逻辑：
- `useArticleList.ts` - 文章列表管理
- `useArticleState.ts` - 文章状态管理
- `useMarkdown.ts` - Markdown 处理
- `useTheme.ts` - 主题管理
- `useLayoutTransform.ts` - 布局变换
- `useSeo.ts` - SEO 管理

#### 领域模型 (Domain)
位于 `src/client/domain/`，定义数据结构：
- `doc/` - 文档相关模型
- `theme/` - 主题相关
- `widgets/` - 小组件模型
- `profile/` - 个人信息模型

## 功能特性

### 文章管理
- **排序**: 默认按文件名排序
- **搜索**: 支持标题和内容搜索
- **过滤**: 支持标签过滤
- **导航**: 上一篇/下一篇文章

### 视图模式
1. **文章模式** - 完整文章展示
2. **小组件模式** - 卡片式展示
3. **链接列表** - 简洁列表

### 主题系统
- 亮/暗模式切换
- 色相滑块自定义主题色
- 多种背景图片
- 毛玻璃 (Glassmorphism) 设计

### 小组件
- 时钟显示
- GitHub 仓库统计
- 文章计数
- 站点年龄

### 性能优化
- 代码分割 (vite.config.ts 中配置)
- 虚拟滚动
- 懒加载
- 依赖预构建优化

## 测试

测试文件位于 `tests/unit/`，使用 Vitest + Vue Test Utils。

```bash
# 运行测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率报告
pnpm test:coverage
```

## SEO 优化

### 配置位置
- `useSeo.ts` - SEO 逻辑
- 路由元信息 - `meta: { title, description }`
- `public/sitemap.xml` - 站点地图
- `public/robots.txt` - 爬虫规则

### 支持功能
- Meta 标签
- Open Graph
- Twitter Card
- JSON-LD 结构化数据

## 构建配置

### Vite 配置重点
- **Markdown 支持**: `.md` 文件可作为组件导入
- **Shiki 高亮**: 代码块语法高亮
- **代码分割**: 大型库单独打包
- **构建分析**: 可视化打包结果

### TypeScript 配置
- 严格模式启用
- 路径别名: `@` 指向 `src`
- JSX 支持

## 重要约定

### 文件命名
- 组件: PascalCase (如 `ArticleList.vue`)
- 组合式函数: camelCase with `use` 前缀 (如 `useArticle.ts`)
- 工具函数: camelCase (如 `markdownRenderer.ts`)
- Markdown 文章: kebab-case (如 `vue3-composition-api.md`)

### 代码风格
- 使用 TypeScript 类型注解
- 组件使用 `<script setup>`
- 优先使用 Composition API
- 避免在组件中直接修改 props

### 安全注意
- 所有用户输入必须通过 DOMPurify 清理
- Markdown 渲染使用 `markdownRenderer.ts`
- 注意 XSS 攻击防护

## 扩展指南

### 添加新小组件
1. 在 `src/client/component/widget/` 创建组件
2. 在 `WidgetPanel.vue` 中注册
3. 在 `src/client/domain/widgets/` 添加类型定义

### 添加新视图模式
1. 在 `useLayoutTransform.ts` 添加模式
2. 更新 `ControlPanel.vue` 切换按钮
3. 添加对应样式

### 自定义主题
修改 `src/client/domain/theme/` 中的主题配置。

## 部署

### 构建生产版本
```bash
pnpm build
```

构建产物在 `dist/` 目录，可部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### 环境变量
如需环境变量，创建 `.env.local` 文件（不提交到版本控制）。

## 故障排除

### 常见问题
1. **依赖安装失败**: 确保 Node.js 版本符合要求
2. **构建失败**: 检查 TypeScript 类型错误
3. **路由 404**: 检查 `vite.config.ts` 中的 `rollupOptions.input`
4. **样式不生效**: 检查 `import "./styles/base.css"` 是否在 `main.ts` 中

## 许可证

请查看项目根目录的 LICENSE 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**: 在修改代码前，请先阅读相关模块的现有实现，保持代码风格一致。
