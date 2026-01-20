<script setup lang="ts">
import { NavBar as navItems, type NavItem } from '@/client/domain/view/NavBar'
import GlassButton from '@/client/component/GlassButton.vue'
import { ref } from 'vue'

const activeIndex = ref<number | null>(null)

function handleClick(item: NavItem, index: number) {
  console.log('导航点击:', item.link)
  activeIndex.value = index
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-buttons">
      <div v-for="(item, index) in navItems" :key="item.text">
        <!-- 如果有子菜单可以做下拉 -->
        <div class="nav-item" v-if="!item.children">
          <GlassButton @click="() => handleClick(item, index)">
            {{ item.text }}
          </GlassButton>
        </div>

        <div class="nav-item" v-else>
          <GlassButton>
            {{ item.text }}
          </GlassButton>
          <div class="dropdown">
            <GlassButton
                v-for="sub in item.children"
                :key="sub.text"
                @click="() => handleClick(sub, index)"
                variant="default"
            >
              {{ sub.text }}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  --glass-bg: rgba(255, 255, 255, 0.35);
  --glass-border: rgba(255, 255, 255, 0.45);
  --glass-shadow: rgba(0, 0, 0, 0.08);
  --glass-text: #1f2328;

  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.6rem 1.1rem;
  border-radius: 30px;
  border: 1px solid var(--glass-border);
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.73),
      rgba(255, 255, 255, 0.25)
  );
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
}

.nav-buttons {
  display: flex;          /* 横向排列导航按钮 */
  flex-direction: row;    /* 确保是水平方向 */
  align-items: center;    /* 垂直居中按钮文字 */
  gap: 1.2rem;
}

.nav-item {
  position: relative;
  display: flex;          /* 保证按钮容器也是flex */
  align-items: center;
}

.dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;

  flex-direction: column; /* 子菜单竖着排列 */
  align-items: flex-start; /* 子菜单文字靠左 */
}

.nav-item:hover .dropdown {
  opacity: 1;
  pointer-events: auto;
}

.nav-item button {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap; /* 防止文字换行 */
}
</style>
