<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import type { useArticleState } from '@/client/composables/useArticleState'
import { useVirtualScroll } from '@/client/composables/useVirtualScroll'
import TagBadge from '@/client/component/TagBadge.vue'

// 使用父组件提供的状态，添加错误处理
const articleListState = inject<ReturnType<typeof useArticleList> | null>('articleListState', null)
const articleState = inject<ReturnType<typeof useArticleState> | null>('articleState', null)

if (!articleListState) {
  console.error('ArticleList: articleListState not provided. Make sure to provide it from parent component.')
  throw new Error('articleListState is required but not provided')
}

const { filteredArticles, selectedIndex, selectByIndex } = articleListState
const rowRef = ref<HTMLElement | null>(null)

// 动画状态
const isInitialLoad = ref(true)
const clickedIndex = ref<number | null>(null)

// ===== 虚拟滚动常量 =====
// 单个文章项的总高度 = padding-top(15px) + padding-bottom(15px) + margin-bottom(20px) + 文本行高(约1px)
const ARTICLE_ITEM_HEIGHT = 51
// 预渲染的额外项数（上下各渲染此数量的不可见项，提升滚动体验）
const OVERSCAN_ITEM_COUNT = 10
// 底部额外空间系数：让最后一个 item 能滚动到窗口中心下方的距离
const BOTTOM_SPACE_FACTOR = 1.6
// 居中位置系数：让第一个 item 的中心在窗口高度的一半
const CENTER_POSITION_FACTOR = 0.5

// 使用虚拟滚动
const ITEM_HEIGHT = ARTICLE_ITEM_HEIGHT
const OVERSCAN = OVERSCAN_ITEM_COUNT

// 响应式窗口高度
const windowHeight = ref(window.innerHeight)

// 居中偏移：第一个 item 的中心在窗口高度的一半
const centerOffset = computed(() => windowHeight.value * CENTER_POSITION_FACTOR - ITEM_HEIGHT * CENTER_POSITION_FACTOR)

const {
  visibleItems,
  totalHeight,
  offsetY,
  handleScroll,
  scrollTop
} = useVirtualScroll(filteredArticles, {
  containerHeight: windowHeight,
  itemHeight: ITEM_HEIGHT,
  overscan: OVERSCAN
})

// 实际的偏移量：初始略在中线上方，随滚动向下移动
const actualOffsetY = computed(() => centerOffset.value - offsetY.value)

// spacer 高度：让最后一个 item 能到中线往下一个身位
// = totalHeight + 顶部空间(centerOffset) + 底部额外空间
const spacerHeight = computed(() => {
  // 底部空间：让最后一个 item 能到达窗口中心下方
  const bottomSpace = windowHeight.value * CENTER_POSITION_FACTOR + ITEM_HEIGHT * BOTTOM_SPACE_FACTOR
  return totalHeight.value + centerOffset.value + bottomSpace
})

// 构建路径到索引的映射，避免重复 findIndex
const pathToIndexMap = computed(() => {
  const map = new Map<string, number>()
  filteredArticles.value.forEach((article, index) => {
    map.set(article.path, index)
  })
  return map
})

// 初始化完成后禁用初始加载状态
onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 延迟禁用初始加载状态，让动画有足够时间播放
  setTimeout(() => {
    isInitialLoad.value = false
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  windowHeight.value = window.innerHeight
  // centerOffset 会自动重新计算
}

// 计算动画延迟（交错进入效果）
function getAnimationDelay(index: number): number {
  // 前几项快速进入，后续项稍慢
  if (isInitialLoad.value) {
    return Math.min(index * 50, 300) // 最多300ms延迟
  }
  return 0
}

// 处理点击动画
function handleItemClick(index: number, articlePath: string) {
  clickedIndex.value = index
  articleState?.openArticle(index)

  // 短暂延迟后重置点击状态
  setTimeout(() => {
    clickedIndex.value = null
  }, 300)
}

// 初始化完成后禁用初始加载状态
onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 延迟禁用初始加载状态，让动画有足够时间播放
  setTimeout(() => {
    isInitialLoad.value = false
  }, 500)
})
</script>

<template>
  <div class="article-list">
    <div
      ref="rowRef"
      class="row"
      @scroll="handleScroll"
    >
      <!-- 占位容器，撑开滚动高度 -->
      <div class="spacer" :style="{ height: `${spacerHeight}px` }"></div>

      <!-- 可见项列表 -->
      <div class="items" :style="{ transform: `translateY(${actualOffsetY}px)` }">
        <div
          v-for="(item, displayIndex) in visibleItems"
          :key="item.path"
          class="article-item"
          :class="{
            'is-selected': pathToIndexMap.get(item.path) === selectedIndex,
            'is-clicked': clickedIndex === pathToIndexMap.get(item.path)
          }"
          :style="{ animationDelay: `${getAnimationDelay(displayIndex)}ms` }"
          @click="handleItemClick(pathToIndexMap.get(item.path)!, item.path)"
        >
          <div class="title">{{ item.title }}</div>
          <div v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</div>
          <div v-if="item.tags && item.tags.length > 0" class="article-tags">
            <TagBadge
              v-for="tag in item.tags"
              :key="tag"
              :tag="tag"
              size="small"
            />
          </div>
          <!-- 点击涟漪效果 -->
          <div class="ripple-container">
            <span class="ripple"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-list {
  position: absolute;
  padding: 30px;
  width: 20vw;
  min-width: 250px;
  max-width: 320px;
  height: 100vh;
  left: 10vw;
  transform: skew(-19deg);
  z-index: 6;

  /* 默认模糊背景 */
  background: var(--color-surfaceBlur);
  backdrop-filter: blur(6px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
}

/* 大屏优化 */
@media (min-width: 1600px) {
  .article-list {
    width: 18vw;
    max-width: 360px;
  }
}

/* 平板优化 */
@media (max-width: 1024px) {
  .article-list {
    width: 28vw;
    left: 5vw;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .article-list {
    width: calc(100% - 32px);
    max-width: none;
    min-width: auto;
    left: 16px;
    right: 16px;
    padding: 15px;
    transform: skew(-10deg);
  }
}

@media (max-width: 480px) {
  .article-list {
    width: calc(100% - 16px);
    left: 8px;
    right: 8px;
    padding: 12px;
    transform: none;
  }
}

.row {
  position: absolute;
  top: 0;
  bottom: 0;
  width: auto;
  left: 15px;
  right: 15px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
  overscroll-behavior: contain;

  perspective: 800px;
  user-select: none;
}

/* WebKit browsers: hide scrollbar visually but keep scroll functionality */
.row::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.row::-webkit-scrollbar-thumb {
  background: transparent;
}

.spacer {
  position: absolute;
  width: 1px;
  left: 0;
  top: 0;
}

.items {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  will-change: transform;
}

.article-item {
  position: relative;
  padding: 15px 0px 15px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  /* 进入动画 */
  animation: slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards,
              fadeIn 0.5s ease backwards;

  /* 过渡动画 */
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

/* 初始进入动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) translateZ(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 悬停效果 - 3D 变换 */
.article-item:hover {
  background: var(--color-accent);
  border-color: var(--color-primary);
  transform: translateY(-2px) translateZ(20px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

/* 点击反馈 */
.article-item.is-clicked {
  transform: translateY(0) translateZ(0) scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.article-item.is-clicked .ripple {
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* 选中状态 */
.article-item.is-selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 6px 20px rgba(var(--color-primary-rgb, 100, 100, 100), 0.4);
  transform: translateX(5px);
}

.article-item.is-selected:hover {
  transform: translateX(5px) translateY(-2px) scale(1.02);
}

.article-item.is-selected .title,
.article-item.is-selected .subtitle {
  color: var(--color-bg);
}

/* 涟漪效果容器 */
.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  pointer-events: none;
}

.ripple {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: scale(0);
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 400;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
</style>
