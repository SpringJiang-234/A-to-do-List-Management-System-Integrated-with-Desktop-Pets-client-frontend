<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import TodoList from "@/components/TodoList.vue";
import FluentAlertUrgent16Filled from "~icons/fluent/alert-urgent-16-filled?width=16px&height=16px";
import FluentImportant12Filled from "~icons/fluent/important-12-filled?width=16px&height=16px";

defineOptions({
  name: "Priority"
});

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

const highPriorityActivities = ref<Activity[]>([
  // 颜色和标签有关，和优先级无关
  {
    title: "完成项目报告",
    content: "需要在今天下班前提交",
    timestamp: "10:00",
    isCompleted: false,
    color: "#F56C6C"
  },
  {
    title: "紧急会议",
    content: "下午3点参加项目评审",
    timestamp: "15:00",
    isCompleted: false,
    color: "#F56C6C"
  }
]);

const mediumPriorityActivities = ref<Activity[]>([
  {
    title: "代码审查",
    content: "审查新功能的代码",
    timestamp: "09:00",
    isCompleted: false,
    color: "#E6A23C"
  },
  {
    title: "文档编写",
    content: "更新API文档",
    timestamp: "14:00",
    isCompleted: true,
    color: "#E6A23C"
  }
]);

const lowPriorityActivities = ref<Activity[]>([
  {
    title: "客户咨询",
    content: "回复客户邮件",
    timestamp: "11:00",
    isCompleted: false,
    color: "#409EFF"
  },
  {
    title: "数据分析",
    content: "分析上周数据",
    timestamp: "16:00",
    isCompleted: false,
    color: "#409EFF"
  }
]);

const nonePriorityActivities = ref<Activity[]>([
  {
    title: "学习新技术",
    content: "学习Vue3新特性",
    timestamp: "13:00",
    isCompleted: true,
    color: "#67C23A"
  },
  {
    title: "整理文件",
    content: "整理项目文档",
    timestamp: "17:00",
    isCompleted: false,
    color: "#67C23A"
  }
]);

function handleClick(activity: Activity) {
  message(`点击了待办：${activity.content}`);
}

function handleTextClick(activity: Activity) {
  message(`点击了文字：${activity.content}`);
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">优先级</div>
        </div>
      </template>
      <div class="grid-container">
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentImportant12Filled /><FluentAlertUrgent16Filled />重要且紧急
              </div>
            </div>
            <TodoList
              :activities="highPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentImportant12Filled />重要不紧急
              </div>
            </div>
            <TodoList
              :activities="mediumPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentAlertUrgent16Filled />不重要但紧急
              </div>
            </div>
            <TodoList
              :activities="lowPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <greenImportant />不重要不紧急
              </div>
            </div>
            <TodoList
              :activities="nonePriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}

.grid-item-header-content {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.grid-item-header-content svg {
  width: 20px;
  height: 20px;
}
</style>
