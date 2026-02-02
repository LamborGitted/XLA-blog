# SEO 使用指南

本项目已完成高优先级SEO优化，以下是使用说明。

## 已完成的优化

✅ **1. index.html 优化**
- 添加了完整的 meta 标签
- 配置了 Open Graph（Facebook/LinkedIn 分享优化）
- 配置了 Twitter Card（Twitter 分享优化）
- 添加了 JSON-LD 结构化数据
- 设置了 canonical URL

✅ **2. robots.txt**
- 位置：`public/robots.txt`
- 允许所有搜索引擎爬取
- 配置了 sitemap 位置

✅ **3. sitemap.xml**
- 位置：`public/sitemap.xml`
- 包含首页和所有文章的路由
- 设置了更新频率和优先级

✅ **4. useSeo Composable**
- 位置：`src/client/composables/useSeo.ts`
- 提供动态更新SEO元数据的功能

✅ **5. 路由级别SEO**
- 更新了 `src/router/index.ts`
- 添加了路由元数据类型
- 实现了全局路由守卫自动更新页面标题

## 如何在组件中使用动态SEO

### 基础用法

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '@/client/composables/useSeo'

const { updateMeta } = useSeo()

onMounted(() => {
  updateMeta({
    title: '文章标题',
    description: '文章描述',
    keywords: '关键词1,关键词2,关键词3',
    ogType: 'article'
  })
})
</script>
```

### 文章详情页示例

假设你有一个文章详情页组件：

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/client/composables/useSeo'
import { useArticleDetail } from '@/client/composables/useArticleDetail'

const route = useRoute()
const { updateMeta } = useSeo()
const { article } = useArticleDetail(route.params.slug as string)

onMounted(() => {
  if (article.value) {
    updateMeta({
      title: article.value.title,
      description: article.value.excerpt || article.value.description,
      keywords: article.value.tags?.join(',') || '',
      ogImage: article.value.coverImage,
      ogType: 'article',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.excerpt,
        author: {
          '@type': 'Person',
          name: 'Lantxx'
        },
        datePublished: article.value.date,
        dateModified: article.value.updatedAt || article.value.date,
        url: `https://blog.lantxx.com.cn/${route.path}`
      }
    })
  }
})
</script>
```

### 重置为首页SEO

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '@/client/composables/useSeo'

const { resetSeo } = useSeo()

onMounted(() => {
  // 重置为默认首页SEO配置
  resetSeo()
})
</script>
```

## 添加新路由时的SEO配置

在 `src/router/index.ts` 中添加新路由时：

```typescript
{
  path: '/about',
  name: 'about',
  component: () => import('@/client/views/AboutView.vue'),
  meta: {
    title: '关于我',
    description: '了解Lantxx的背景、技能和联系方式',
    keywords: '关于,简历,联系方式'
  } as RouteMeta
}
```

## SEO优化建议

### 1. Open Graph 图片

建议创建一个 1200x630 像素的图片作为 `og-image.jpg`，放置在 `public/` 目录下。

```bash
# 推荐尺寸
width: 1200px
height: 630px
format: JPG 或 PNG
```

### 2. 结构化数据测试

部署后使用以下工具测试结构化数据：
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### 3. 提交 Sitemap

部署后到以下平台提交 sitemap：
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

提交地址：`https://blog.lantxx.com.cn/sitemap.xml`

### 4. 性能优化

SEO不仅关乎内容，也关乎性能。确保：
- 页面加载速度快
- 移动端友好
- 使用HTTPS
- 无404错误

## 验证SEO是否生效

### 1. 本地测试

启动开发服务器后，查看页面源代码：

```bash
npm run dev
```

在浏览器中访问 `http://localhost:5173/`，右键 → 查看页面源代码，检查 meta 标签是否存在。

### 2. 使用浏览器扩展

推荐使用以下浏览器扩展测试SEO：
- Chrome SEO Panel
- Open Graph Preview
- META SEO inspector

### 3. 在线工具

- [Meta Tags Checker](https://www.metatags.org/all-meta-tags)
- [Open Graph Debugger](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 常见问题

### Q: 为什么修改 meta 标签后搜索引擎没有立即更新？

A: 搜索引擎爬虫需要时间来重新爬取和索引网站。通常需要几天到几周时间。

### Q: SPA应用的SEO有问题吗？

A: 现代搜索引擎（Google、Bing）可以很好地执行JavaScript并索引SPA应用。但为了更好的SEO，可以考虑：
1. 确保内容在HTML中是可访问的
2. 使用预渲染（如 vite-plugin-ssr）
3. 或迁移到SSR框架（如Nuxt.js）

### Q: 如何更新 sitemap.xml 中的 lastmod？

A: 有两种方法：
1. **手动更新**：每次添加/修改文章时，手动更新 `public/sitemap.xml` 中的日期
2. **自动化**：创建一个构建脚本，根据 Markdown 文件的修改时间自动生成 sitemap

## 下一步优化（中优先级）

- [ ] 集成 Google Analytics
- [ ] 添加面包屑导航的结构化数据
- [ ] 实现自动化 sitemap 生成
- [ ] 添加FAQ页面的结构化数据
- [ ] 优化图片的 alt 标签

## 参考资料

- [Google Search Central - SEO](https://developers.google.com/search/docs)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [schema.org](https://schema.org/)
