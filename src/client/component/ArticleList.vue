<script setup lang="ts">
import { inject } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'

// 使用父组件提供的状态
const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const { filteredArticles, selectedIndex, selectByIndex } = articleListState


</script>

<template>
  <div class="article-list">

    <div class="row">
      <div
        v-for="(item, i) in filteredArticles"
        :key="item.path"
        class="article-item"
        :class="{ 'is-selected': i === selectedIndex }"
        @click="selectByIndex(i)"
       >
        <div class="title">{{item.title}}</div>
        <div v-if="item.subtitle" class="subtitle">{{item.subtitle}}</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.article-list {
  position: absolute;
  padding: 30px;
  width: 20vw;
  height: 100vh;
  left: 10vw;
  transform: skew(-19deg);
  z-index: 1;

  /* 默认模糊背景 */
  background: var(--color-surfaceBlur);
  backdrop-filter: blur(6px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  /* border-radius: 30px; */
}
.row{
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

  padding-top: calc(50vh - 20px);
  padding-bottom: calc(50vh - 20px);

  perspective: 800px;
  //cursor: grab;
  user-select: none;
  gap: 10px;

}

/* WebKit browsers: hide scrollbar visually but keep scroll functionality */
.row::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.row::-webkit-scrollbar-thumb {
  background: transparent;
}

.article-item {
  padding:15px 0px 15px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.article-item:hover {
  background: var(--color-accent);
  opacity: 0.8;
}

.article-item.is-selected {
  background: var(--color-primary);
}

.article-item.is-selected .title,
.article-item.is-selected .subtitle {
  color: var(--color-bg);
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

</style>
