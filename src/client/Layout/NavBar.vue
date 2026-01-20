<script setup lang="ts">

import NavBar from "@/client/component/NavBar.vue";
</script>

<template>
    <NavBar class="navbar"/>
</template>

<style scoped>
.navbar {
  position: fixed;
  bottom: 20VH;
  left: 50%;
  transform: translateX(-50%);   /* ⭐ 核心：整体居中 */
  width: fit-content;            /* ⭐ 父元素随子元素宽度 */
  height: auto;
  z-index: 100;
}
</style>