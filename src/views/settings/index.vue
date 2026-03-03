<script setup lang="ts">
defineOptions({
  name: "Settings"
});
</script>

<template>
  <div class="settings-container">
    <!-- 细节看一下思考笔记 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>菜单设置</h4>
          </div>
        </div>
      </template>
      可以控制路由展不展示
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>桌宠设置</h4>
          </div>
        </div>
      </template>
      <!-- 
      桌宠模式（单选）：标准、mini、隐藏
  1. 标准模式（标准、弹对话框、有语音或提示音）
  2. mini模式（mini、通知、有语音或提示音）
  3. 隐藏模式（隐藏、有语音或提示音）
  4. 自定义模式（全自定义） -->
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>提醒设置</h4>
          </div>
        </div>
      </template>
      <!-- - 提示方式（多选）：弹对话框、通知、语音或提示音（如果桌宠选4则亮起，否则灰色不可动）-->
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>分类设置</h4>
          </div>
        </div>
      </template>
      <!-- 在这里可以拖拽排序卡片类型分类，也可以添加删除分类 -->
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>标签设置</h4>
          </div>
        </div>
      </template>
      <!-- 在这里可以拖拽排序标签，也可以添加删除标签 -->
    </el-card>
  </div>
</template>

<style scoped>
.settings-container :deep(.el-card) {
  margin-bottom: 20px;
}
</style>
