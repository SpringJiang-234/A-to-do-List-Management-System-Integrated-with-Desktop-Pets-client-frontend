<script setup lang="ts">
defineOptions({
  name: "DesktopPetWindow"
});

const gifPath = "/祥子鼓掌.gif";
</script>

<template>
  <div class="transparent-container">
    <div class="gif-container">
      <img :src="gifPath" alt="动画">
    </div>
  </div>
</template>

<style scoped>
.transparent-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.gif-container {
  position: relative;
}

.gif-container img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}
</style>
