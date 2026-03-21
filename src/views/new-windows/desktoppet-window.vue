<script setup lang="ts">
import gifPath from "@/assets/images/丰川祥子-鼓掌.gif";

defineOptions({
  name: "DesktopPetWindow"
});
</script>

<template>
  <div class="pet-container">
    <div class="gif-container">
      <img :src="gifPath" alt="动画" draggable="false">
    </div>
  </div>
</template>

<style scoped>
.pet-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
}

.gif-container {
  position: relative;
  -webkit-app-region: drag;
  user-select: none;
}

.gif-container img {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
