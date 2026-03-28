<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "PopUpWindow"
});

const route = useRoute();
const message = ref("这是一个弹窗提示");

onMounted(() => {
  const messageParam = route.query.message as string;
  if (messageParam) {
    message.value = decodeURIComponent(messageParam);
  }

  setTimeout(() => {
    window.close();
  }, 3000);
});
</script>

<template>
  <div class="pop-up-container">
    <div class="pop-up-content">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.pop-up-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.pop-up-content {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 360px;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.pop-up-content p {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 500;
  line-height: 1.8;
  word-wrap: break-word;
}
</style>
