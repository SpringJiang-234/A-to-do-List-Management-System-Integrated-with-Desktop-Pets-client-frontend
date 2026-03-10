<script setup lang="ts">
import { ref, watch } from "vue";
defineOptions({
  name: "Settings"
});

const valueCategory = ref(localStorage.getItem('valueCategory') !== 'false');
const valueTag = ref(localStorage.getItem('valueTag') !== 'false');
const valuePriority = ref(localStorage.getItem('valuePriority') !== 'false');
const valueStartTimer = ref(localStorage.getItem('valueStartTimer') !== 'false');
const valueReport = ref(localStorage.getItem('valueReport') !== 'false');
const valueAnnouncement = ref(localStorage.getItem('valueAnnouncement') !== 'false');
const valueFeedback = ref(localStorage.getItem('valueFeedback') !== 'false');

watch(valueCategory, (newVal) => localStorage.setItem('valueCategory', String(newVal)));
watch(valueTag, (newVal) => localStorage.setItem('valueTag', String(newVal)));
watch(valuePriority, (newVal) => localStorage.setItem('valuePriority', String(newVal)));
watch(valueStartTimer, (newVal) => localStorage.setItem('valueStartTimer', String(newVal)));
watch(valueReport, (newVal) => localStorage.setItem('valueReport', String(newVal)));
watch(valueAnnouncement, (newVal) => localStorage.setItem('valueAnnouncement', String(newVal)));
watch(valueFeedback, (newVal) => localStorage.setItem('valueFeedback', String(newVal)));
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
      <div class="switch-container">
        <el-switch v-model="valueCategory" class="mb-2" active-text="显示分类" inactive-text="隐藏分类" />
        <el-switch v-model="valueTag" class="mb-2" active-text="显示标签" inactive-text="隐藏标签" />
        <el-switch v-model="valuePriority" class="mb-2" active-text="显示优先级" inactive-text="隐藏优先级" /> 
        <el-switch v-model="valueStartTimer" class="mb-2" active-text="显示开始计时" inactive-text="隐藏开始计时" />
        <el-switch v-model="valueReport" class="mb-2" active-text="显示报表" inactive-text="隐藏报表" />
        <el-switch v-model="valueAnnouncement" class="mb-2" active-text="显示公告" inactive-text="隐藏公告" />
        <el-switch v-model="valueFeedback" class="mb-2" active-text="显示反馈" inactive-text="隐藏反馈" />
      </div>
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

.switch-container {
  display: flex;
  flex-wrap: wrap;
}

.switch-container :deep(.el-switch) {
  margin-right: 20px;
}
</style>
