<script setup lang="ts">

</script>

<template>
    <div class="tool-button">
       <slot class ="text"></slot>

    </div>
</template>

<style scoped>
.tool-button {

  background-color: rgb(119, 113, 208);


  //transform: skew(-19deg);
  transition:
      transform 0.2s ease,
      box-shadow 0.3s ease,
      background-color 0.3s ease;

  cursor: pointer;

}

.text{
  transform: skew(19deg);
}

.tool-button:hover{
  background: rgb(119, 113, 208); /* 边框颜色 */
  box-shadow: 0 0 15px #2b6bab, 0 0 15px #1f6bc2; /* 发光 */

  transform: translateX(-50px) scale(1.1);
}

</style>