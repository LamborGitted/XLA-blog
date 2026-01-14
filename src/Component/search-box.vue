<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Search } from "@element-plus/icons-vue";

const visible = ref(false);
const query = ref("");

// 对外暴露方法
function showSearchBox() {
  visible.value = true;
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(".search-input");
    input?.focus();
  });
}

function hide() {
  visible.value = false;
  query.value = "";
}

function onSearch() {
  console.log("搜索内容:", query.value);
  // TODO: 可以 emit 或调用搜索逻辑
}

// 暴露给父组件调用
defineExpose({
  showSearchBox
});
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
    <el-icon class="search-btn" @click="onSearch">
      <Search />
    </el-icon>
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
  background: rgba(255, 255, 255, 0.1);
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  backdrop-filter: blur(6px);
  z-index: 5;
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
  color: rgba(255, 255, 255, 0.6);
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
