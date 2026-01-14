<script setup lang="ts">

</script>

<template>
  <div class="item">
    <div class="text"><slot /></div>
    <div class="sub-text"><slot name="sub-text" /></div>
  </div>
</template>

<style scoped>
.item{
  position: relative;
  padding: 30px 32px;
 /* border-radius: 16px;*/
  /* 毛玻璃核心 */
  background: rgba(255, 255, 255, 0.12);
  //backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  /* Apple 式细边框 */
  border: 1px solid rgba(255, 255, 255, 0.25);
  /* 轻微发光 */
  box-shadow:
      0 0 0.5px rgba(255, 255, 255, 0.6),
      0 8px 30px rgba(0, 0, 0, 0.25);
  color: #fff;
  z-index: 10;
}

.text {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 10px;
}

.sub-text {
  margin-top: 6px;
  font-size: 14px;
  opacity: 0.65;
}

.text .sub-text{
  transform: skew(19deg);
}

</style>