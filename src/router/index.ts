import { createRouter, createWebHistory } from 'vue-router'

// 使用路由懒加载 - 优化首屏加载性能
const HomeView = () => import('@/client/views/HomeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ],
})

export default router
