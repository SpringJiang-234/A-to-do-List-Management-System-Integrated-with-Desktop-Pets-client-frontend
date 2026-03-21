<script setup lang="ts">
import { ref, onMounted } from "vue";
import summonGifPath from "@/assets/images/丰川祥子-召唤.gif";
import teaGifPath from "@/assets/images/丰川祥子-喝茶.gif";

defineOptions({
  name: "DesktopPetWindow"
});

const currentGif = ref(summonGifPath);
const isFading = ref(false);

onMounted(() => {
  setTimeout(() => {
    isFading.value = true;
    setTimeout(() => {
      currentGif.value = teaGifPath;
      setTimeout(() => {
        isFading.value = false;
      }, 400);
    }, 400);
  }, 2000);
});
</script>

<template>
  <div class="pet-container">
    <div class="gif-container">
      <img :class="{ fading: isFading }" :src="currentGif" alt="动画" draggable="false">
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
  transition: opacity 0.4s ease;
}

.gif-container img.fading {
  opacity: 0;
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
