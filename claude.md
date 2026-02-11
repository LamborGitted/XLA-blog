# XL-Blog 项目文档

## 项目概述

XL-Blog 是一个基于 Vue 3 + TypeScript + Vite 构建的现代化个人技术博客模板。采用 Markdown 驱动的内容管理方式，支持多种展示模式、主题切换和响应式设计。已引入 Pinia 进行集中状态管理。

**作者**: Lantxx
**包管理器**: pnpm
**Node.js 要求**: ^20.19.0 || >=22.12.0

## 核心技术栈

### 前端框架
- **Vue 3** (v3.5.26) - 使用 Composition API
- **TypeScript** (v5.9.3) - 严格模式
- **Vite** (v7.3.0) - 构建工具
- **Pinia** (v3.0.4) - 状态管理

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
│   ├── main.ts                   # 应用入口（已集成 Pinia）
│   ├── App.vue                   # 根组件
│   ├── router/                   # 路由配置
│   ├── client/                   # 前端代码
│   │   ├── component/           # Vue 组件
│   │   │   ├── article/         # 文章相关子组件
│   │   │   │   ├── ArticleLayout.vue    # 布局容器
│   │   │   │   ├── ArticleHeader.vue     # 文章头部
│   │   │   │   ├── ArticleContent.vue    # 内容渲染
│   │   │   │   ├── ArticleNavigation.vue # 导航组件
│   │   │   │   └── index.ts
│   │   │   ├── ArticleList.vue      # 文章列表
│   │   │   ├── ArticleRender.vue    # 文章渲染器（薄包装层）
│   │   │   ├── ControlPanel.vue     # 控制面板
│   │   │   ├── FilterPanel.vue      # 过滤面板
│   │   │   ├── PageTitle.vue        # 页面标题
│   │   │   ├── ProfileCard.vue      # 个人信息卡片
│   │   │   └── widget/             # 小组件
│   │   ├── composables/         # 组合式函数
│   │   │   ├── article/         # 文章相关 composables
│   │   │   │   ├── useArticleScroll.ts
│   │   │   │   └── index.ts
│   │   ├── domain/               # 领域模型
│   │   │   ├── doc/             # 文档模型
│   │   │   ├── widgets/         # 小组件模型
│   │   │   │   ├── github.ts
│   │   │   │   ├── githubApiTypes.ts
│   │   │   │   └── widgets.ts
│   │   │   ├── theme/           # 主题相关
│   │   │   ├── profile/         # 个人信息模型
│   │   │   └── seo/            # SEO 相关
│   │   │       └── structuredData.ts
│   │   ├── utils/                # 工具函数
│   │   ├── styles/               # 样式文件
│   │   └── views/                # 页面视图
│   ├── stores/                   # Pinia 状态管理
│   │   └── article/          # 文章相关 stores
│   │       ├── articleListStore.ts
│   │       ├── articleStore.ts
│   │       └── index.ts
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

# 类型检查
pnpm type-check
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

### 状态管理（Pinia）

项目使用 **Pinia** 进行集中状态管理，替代原有的 inject/provide 模式。

**文章状态管理**:
- `stores/article/articleListStore.ts` - 文章列表、搜索、排序、导航
- `stores/article/articleStore.ts` - URL 同步、浏览器历史支持

**使用方式**:
```typescript
// 在组件中使用
import { useArticleListStore } from '@/stores'

const articleListStore = useArticleListStore()
const { filteredArticles, selectedIndex, selectByIndex } = articleListStore
```

### 组件开发约定

#### 使用 Composition API
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

#### 使用 Pinia Store
```typescript
// 推荐：使用 toRef 保持响应式
import { toRef } from 'vue'
import { useArticleListStore } from '@/stores'

const articleListStore = useArticleListStore()
const filteredArticles = toRef(articleListStore, 'filteredArticles')
```

#### 组合式函数 (Composables)
位于 `src/client/composables/`，封装可复用逻辑：
- `article/useArticleScroll.ts` - 文章滚动管理
- `useTheme.ts` - 主题管理
- `useLayoutTransform.ts` - 布局变换
- `useSeo.ts` - SEO 管理
- `useMarkdown.ts` - Markdown 处理

#### 领域模型 (Domain)
位于 `src/client/domain/`，定义数据结构：
- `doc/` - 文档相关模型
  - `ArticleFrontMatter` - Markdown frontmatter 类型
  - `ArticleMeta` - 文章元数据
- `widgets/` - 小组件模型
  - `githubApiTypes.ts` - GitHub API 类型
  - `widgets.ts` - 小组件配置类型
- `seo/` - SEO 相关
  - `structuredData.ts` - JSON-LD 结构化数据类型

## 功能特性

### 文章管理
- **排序**: 默认按文件名排序
- **搜索**: 支持标题和内容搜索
- **过滤**: 支持标签过滤
- **导航**: 上一篇/下一篇文章
- **URL 同步**: 文章选择与 URL 参数同步

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

### CSS 变量系统

项目使用 CSS 变量来减少重复代码并提高可维护性：

**模糊强度**: `--blur-xs` 到 `--blur-2xl`
**毛玻璃预设**: `--glass-blur-light/medium/heavy/xheavy`
**过渡曲线**: `--ease-out-cubic`, `--ease-in-out-cubic`, `--ease-bounce-cubic`
**阴影预设**: `--shadow-sm/md/lg`

### 性能优化
- 代码分割 (vite.config.ts 中配置)
- 虚拟滚动
- 懒加载
- 依赖预构建优化

## 类型安全

项目已消除所有 `any` 类型（测试文件除外），使用严格的类型定义：
- `ArticleFrontMatter` - 文章 frontmatter
- `GithubRepoResponse` - GitHub API 响应
- `StructuredData` - SEO 结构化数据
- `WidgetType` - 小组件类型枚举

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
- 组合式函数: camelCase with `use` 前缀 (如 `useArticleScroll.ts`)
- 工具函数: camelCase (如 `markdownRenderer.ts`)
- Markdown 文章: kebab-case (如 `vue3-composition-api.md`)
- Store 文件: camelCase with `Store` 后缀 (如 `articleListStore.ts`)

### 代码风格
- 使用 TypeScript 类型注解
- 组件使用 `<script setup>`
- 优先使用 Composition API
- 避免在组件中直接修改 props
- 优先使用 Pinia store 而非 inject/provide

### 安全注意
- 所有用户输入必须通过 DOMPurify 清理
- Markdown 渲染使用 `markdownRenderer.ts`
- 注意 XSS 攻击防护

## 组件拆分

大型组件已拆分为更小的子组件以提高可维护性：

**ArticleRender.vue** (95 行 → 95 行)
- 作为薄包装层，使用子组件组合：
  - `article/ArticleLayout.vue` - 布局容器
  - `article/ArticleHeader.vue` - 文章头部
  - `article/ArticleContent.vue` - 内容渲染
  - `article/ArticleNavigation.vue` - 导航控制

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
5. **Pinia store 未找到**: 确保使用 `useXxxStore()` 而非 inject
6. **类型错误**: 检查是否正确使用 `toRef()` 保持响应式

### 开发服务器问题
- 清除缓存并重启: `pnpm dev --force`
- 检查端口占用: 默认 5173 端口

## 近期更新

### v1.1.0 (2025-01)
- ✅ 引入 Pinia 状态管理
- ✅ 拆分 ArticleRender.vue 组件（956 行 → 95 行）
- ✅ 新增文章子组件目录
- ✅ 消除所有 `any` 类型使用
- ✅ 新增 CSS 变量系统
- ✅ 完善类型定义（GitHub API、SEO 结构化数据）
- ✅ 迁移组件使用 Pinia stores
- ✅ 新增文章滚动管理 composable

### 技术债务清理
- 移除 inject/provide 模式，统一使用 Pinia
- 提取可复用逻辑到独立 composables
- 减少 CSS 代码重复，使用变量系统
- 添加严格类型检查

## 许可证

请查看项目根目录的 LICENSE 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**: 在修改代码前，请先阅读相关模块的现有实现，保持代码风格一致。

请使用中文回答！
