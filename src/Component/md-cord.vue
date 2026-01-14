<script setup lang="ts">

import { onMounted, onUpdated, nextTick } from 'vue'

function enhanceCodeBlocks() {
  document.querySelectorAll<HTMLPreElement>('pre.shiki').forEach(pre => {
    if (pre.querySelector('.code-copy-btn')) return

    const btn = document.createElement('button')
    btn.className = 'code-copy-btn'
    btn.type = 'button'
    btn.textContent = 'Copy'

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText
      if (!code) return

      await navigator.clipboard.writeText(code)
      btn.textContent = 'Copied'
      setTimeout(() => (btn.textContent = 'Copy'), 1200)
    })

    pre.appendChild(btn)
  })
}

onMounted(async () => {
  await nextTick()
  enhanceCodeBlocks()
})

onUpdated(async () => {
  await nextTick()
  enhanceCodeBlocks()
})
</script>



<template>
  <div class="main">
    <div class="card">
      <div class="card-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  position: absolute;
  right: 4vw;
  top: 7vh;
  bottom: 7vh;
  width: 48vw;

  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 100%;
  height: 100%;
  border-radius: 25px;

  /* 毛玻璃 */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);

  /* 边框 + 发光 */
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.45),
      inset 0 0 0.5px rgba(255, 255, 255, 0.6);

  overflow: hidden;

  /* 入场动画准备 */
  animation: card-enter 0.6s ease-out;
  z-index: 100;
}

.card-inner {
  height: 100%;
  padding: 10px 48px;


  overflow-y: auto;
  scrollbar-width: none;

  color: #cbcbcb;
}

.card-inner::-webkit-scrollbar {
  display: none;
}

/* 入场动画 */
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>


<style>
pre.shiki {
  position: relative;
}

.code-copy-btn {
  position: absolute;
  top: 10px;
  right: 12px;

  font-size: 12px;
  padding: 4px 10px;

  border-radius: 8px;
  border: none;
  cursor: pointer;

  color: #aaa;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(4px);

  transition: all 0.2s ease;
}

pre.shiki:hover .code-copy-btn {
  color: #fff;
  background: rgba(255,255,255,0.18);
}

</style>