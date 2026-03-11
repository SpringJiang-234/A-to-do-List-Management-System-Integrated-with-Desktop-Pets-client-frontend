<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Welcome"
});

const openPopUpWindow = async () => {
  try {
    await (window as any).ipcRenderer.invoke("open-win", "pop-up-window");
  } catch (error) {
    console.error("打开弹窗窗口失败:", error);
  }
};
</script>

<template>
  <div>
    <!-- 解决pure admin特性：没有div包裹就不加载页面 -->
    <h1>Pure-Admin-Thin（非国际化版本）</h1>
    <el-button type="primary" @click="openPopUpWindow">测试</el-button>
  </div>
</template>
