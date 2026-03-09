<script setup lang="ts">
defineOptions({
  name: "Welcome"
});

const openNewWindow = async () => {
  try {
    await (window as any).ipcRenderer.invoke("open-win", "new-windows");
  } catch (error) {
    console.error("打开新窗口失败:", error);
  }
};
</script>

<template>
  <div>
    <!-- 解决pure admin特性：没有div包裹就不加载页面 -->
    <h1>Pure-Admin-Thin（非国际化版本）</h1>
    <el-button type="primary" @click="openNewWindow">测试按钮</el-button>
  </div>
</template>
