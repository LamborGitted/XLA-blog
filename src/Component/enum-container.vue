<script setup lang="ts">

import Tools from "@/Component/tools.vue";
import EnumItem from "@/Component/enum-item.vue";
import { watch } from "vue";
import SearchBox from "@/Component/search-box.vue";
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

import { docs, type DocMeta} from "@/Script/useDocs";
import MdCord from "@/Component/md-cord.vue";
const docsList =docs;
const docList = ref<DocMeta[]>(docs);
const selectedDoc = ref<DocMeta | null>(docList.value[0] ?? null);

const rowRef = ref<HTMLElement | null>(null);
let items: HTMLElement[] = [];
let rafId: number | null = null;

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

let lastY = 0;
let lastTime = 0;
let velocity = 0;
let inertiaRaf: number | null = null;




//enum-items

function updateSelected() {
  if (!rowRef.value) return;

  const row = rowRef.value;
  const screenCenterInRow =
      window.innerHeight / 2 -
      row.getBoundingClientRect().top +
      row.scrollTop;

  let closestIndex = -1;
  let minDistance = Infinity;

  items.forEach((el, index) => {
    const itemCenter = el.offsetTop + el.offsetHeight / 2;
    const distance = Math.abs(itemCenter - screenCenterInRow);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  items.forEach((el, index) => {
    const isSelected = index === closestIndex;

    if (isSelected) {
      el.classList.add("is-selected");
      el.style.transform = "scale(1.25)";
      el.style.opacity = "1";
      el.style.zIndex = "10";
    } else {
      el.classList.remove("is-selected");
      el.style.transform = "scale(0.85)";
      el.style.opacity = "0.45";
      el.style.zIndex = "1";
    }
  });

  // ✅ 这里才是安全的
  selectedDoc.value = docList.value[closestIndex] ?? null;
}


function onScroll() {
  if (!rowRef.value) return;

  // 每一帧都尝试更新选中状态
  updateSelected();
}

function onMouseDown(e: MouseEvent) {
  if (!rowRef.value) return;

  isDragging = true;
  startY = lastY = e.clientY;
  startScrollTop = rowRef.value.scrollTop;
  lastTime = performance.now();
  velocity = 0;

  rowRef.value.classList.add("dragging");
  e.preventDefault();


}

function onMouseMove(e: MouseEvent) {
  if (!isDragging || !rowRef.value) return;

  const now = performance.now();
  const dy = e.clientY - lastY;
  const dt = now - lastTime;

  if (dt > 0) {
    velocity = dy / dt; // px per ms
  }

  rowRef.value.scrollTop -= dy;

  lastY = e.clientY;
  lastTime = now;
}

function onMouseUp() {
  if (!rowRef.value) return;

  isDragging = false;
  rowRef.value.classList.remove("dragging");

  startInertiaScroll();
}

function startInertiaScroll() {
  if (!rowRef.value) return;

  let v = velocity * 20; // 惯性强度，可调
  const friction = 0.95;

  function step() {
    if (!rowRef.value) return;

    rowRef.value.scrollTop -= v;
    updateSelected(); // <-- 每帧更新选中

    v *= friction;

    if (Math.abs(v) > 0.1) {
      inertiaRaf = requestAnimationFrame(step);
    } else {
      inertiaRaf = null;
      snapToClosestItem();
    }
  }

  inertiaRaf = requestAnimationFrame(step);
}

function snapToClosestItem() {
  if (!rowRef.value) return;

  const row = rowRef.value;

  const screenCenterInRow =
      window.innerHeight / 2 -
      row.getBoundingClientRect().top +
      row.scrollTop;

  let closest: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const item of items) {
    const center =
        item.offsetTop + item.offsetHeight / 2;
    const dist = Math.abs(center - screenCenterInRow);

    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  if (!closest) return;

  const targetCenter =
      closest.offsetTop + closest.offsetHeight / 2;

  row.scrollTo({
    top: row.scrollTop + (targetCenter - screenCenterInRow),
    behavior: "smooth"
  });
}

onMounted(async () => {
  if (!rowRef.value) return;

  // 2️⃣ 等待 enum-item 真正渲染进 DOM
  await nextTick();

  // 3️⃣ 再获取 item 元素
  items = Array.from(
      rowRef.value.querySelectorAll(".enum-item")
  ) as HTMLElement[];

  // 4️⃣ 再绑定事件
  rowRef.value.addEventListener("scroll", onScroll);
  rowRef.value.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  // 5️⃣ 初始计算
  updateSelected();
});

onUnmounted(() => {
  if (rowRef.value) {
    rowRef.value.removeEventListener("scroll", onScroll);
  }
  if (rowRef.value) {
    rowRef.value.removeEventListener("mousedown", onMouseDown);
  }
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
});


//Search-box
const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null);
function showSearch() {
  searchBoxRef.value?.showSearchBox?.(); // 调用暴露的方法
}

//open GitHub
function goGithub() {
  window.open(
      'https://github.com/LamborGitted/XLA-blog',
      '_blank'
  )
}

//filter



</script>

<template>
  <div>
    <div class="container">
      <div class="row" ref="rowRef">
        <enum-item
            v-for="doc in docsList"
            :key="doc.path"
            class="enum-item"
        >
          <template #default>
            <div class="title">{{ doc.title }}</div>
          </template>

          <template #sub-text>

          </template>
        </enum-item>

        <div class="scroll-spacer"></div>
      </div>
    </div>

    <div class="tools">
        <tools class = "tool" @click="showSearch">Search</tools>
        <tools class = "tool">Filter</tools>
        <tools class = "tool" @click="goGithub">Github</tools>

    </div>
    <div class="search-box">
      <SearchBox ref="searchBoxRef" />
    </div>

    <md-cord>
      <component
          v-if="selectedDoc"
          :is="selectedDoc.component"
      />
    </md-cord>

  </div>
</template>

<style scoped>

.container {
  position: absolute;

  width: 460px;
  height: 100vh;
  left: 15vw;
  background: linear-gradient(to right, #005dc8, rgb(0, 93, 200));
  transform: skew(-19deg);
  z-index: 1;

  mask-image: linear-gradient(
      to bottom,
      transparent,
      black 10%,
      black 90%,
      transparent
  );

}
.container::before,
.container::after {
  content: '';
  position: absolute;
  top: 0;
  width: 8px;         /* 边框厚度 */
  height: 100%;
  background: #b4b4b4; /* 边框颜色 */
  //box-shadow: 0 0 15px #2b6bab, 0 0 15px #1f6bc2; /* 发光 */
  z-index: 0;
}
.container::before {
  left: -5px; /* 调整位置，让模糊部分在边缘外 */
}
.container::after {
  right: -5px;
}

.tools {
  position: absolute;
  z-index: -1;
  top: 10vh;
  left: 5vw;

  transform: skew(-19deg);
}
.tool{
  position: relative;

  padding: 1px 40px 1px 20px;
  margin: 20px;
  font-size: 30px;
  color: white;
}
.row{
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  scroll-behavior: smooth;
  overscroll-behavior: contain;

  padding-top: calc(50vh - 18px);
  padding-bottom: 0;

  perspective: 800px;
  cursor: grab;
  user-select: none;

}
.row.dragging {
  scroll-behavior: auto;
  cursor: grabbing;
}

.enum-item {
  position: relative;
  margin: 5px;
  height: 35px;
  width: 80%;
  left: 1%;

  display: flex;
  align-items: center;

  transition:
      transform 0.18s ease,
      opacity 0.18s ease;

  transform-origin: center center;
  will-change: transform, opacity;

}

.enum-item.is-selected {
  font-weight: 600;
  opacity: 1;
  transform: scale(1.05);

  z-index: 10;
  filter: brightness(1.2);
}

.scroll-spacer {
  height: calc(100vh - 18px);
  pointer-events: none;
}

.search-box{
  z-index: 1000;
}

</style>