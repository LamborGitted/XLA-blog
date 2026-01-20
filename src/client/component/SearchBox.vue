<script setup lang="ts">
import {ref, defineExpose, watch} from 'vue'
import { useArticleList } from '@/client/composables/useArticleList'

const { query, searchArticles } = useArticleList()
const visible = ref(false)

// 显示搜索框
function show() {
  visible.value = true
}

// 隐藏搜索框
function hide() {
  visible.value = false
}

// 执行搜索
watch(query, searchArticles)

function onSearch() {
  searchArticles(query.value)
  hide()
}
// 暴露方法给父组件
defineExpose({ show, hide })
</script>

<template>
  <div v-if="visible" class="search-box">
    <input
        v-model="query"
        class="search-input"
        type="text"
        placeholder="输入关键字搜索"
        @keyup.enter="onSearch"
    />
    <div class="close-btn" @click="hide">×</div>
  </div>
</template>

<style scoped>
.search-box {
  position: absolute;
  top: 1vh;
  left: calc(50vw - 200px);
  width: 400px;
  //transform: skew(-19deg);
  background: rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  backdrop-filter: blur(6px);
  z-index: 5;
  height: 60px;
}

.search-input {
  flex: 1;
  padding: 5px 5px;
  font-size: 20px;
  border: none;
  outline: none;
  background: transparent;
  color: white;
}

.search-input::placeholder {
  color: rgba(145, 145, 145, 0.6);
}

.search-btn {
  padding: 10px;
  font-size: 28px;
  color: white;
  margin-left: 10px;
  cursor: pointer;
}

.close-btn {
  font-size: 28px;
  color: white;
  margin-left: 15px;
  cursor: pointer;
}
</style>