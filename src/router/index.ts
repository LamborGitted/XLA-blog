import { createRouter, createWebHistory } from 'vue-router'

// 使用路由懒加载 - 优化首屏加载性能
const HomeView = () => import('@/client/views/HomeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
        description: 'Lantxx的个人技术博客，分享编程技术、开发经验和学习笔记，涵盖Rust、TypeScript、Vue.js等技术栈',
        keywords: '技术博客,编程,Rust,TypeScript,Vue.js,前端开发,后端开发'
      }
    }
  ],
})

// 全局路由守卫 - 更新页面标题和基础SEO
router.beforeEach((to, from, next) => {
  const meta = to.meta as {
    title?: string
    description?: string
    keywords?: string
  }

  if (meta.title) {
    document.title = `${meta.title} - Lantxx Blog`
  } else {
    document.title = 'Lantxx Blog - 技术博客与编程思考'
  }

  next()
})

export default router
