<script setup lang="ts">
import EnumContainer from "@/Component/enum-container.vue";
</script>

<template>
  <div class="app">
      <enum-container></enum-container>
  </div>
</template>

<style scoped>
.app{
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #010d1c;
  z-index: -100;
}

</style>


