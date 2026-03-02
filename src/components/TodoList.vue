<script setup lang="ts">
import { message } from "@/utils/message";

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

interface Props {
  activities: Activity[];
}

interface Emits {
  (e: "click", activity: Activity): void;
  (e: "textClick", activity: Activity): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleClick(activity: Activity) {
  activity.isCompleted = !activity.isCompleted;
  message(`切换是否完成：${activity.isCompleted}`);
  emit("click", activity);
}

function handleTextClick(activity: Activity) {
  message(`点击了文字：${activity.content}`);
  emit("textClick", activity);
}
</script>

<template>
  <div class="todo-list">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="todo-item"
      @click="handleClick(activity)"
    >
      <div class="todo-header">
        <div
          :class="
            activity.isCompleted ? 'custom-node-completed' : 'custom-node'
          "
          :style="{
            borderColor: activity.color || 'var(--el-color-info-light-7)',
            backgroundColor: activity.isCompleted
              ? activity.color || 'var(--el-color-info-light-7)'
              : 'white'
          }"
        ></div>
        <span class="todo-title" @click.stop="handleTextClick(activity)">{{
          activity.title
        }}</span>
        <span class="todo-time">{{ activity.timestamp }}</span>
      </div>
      <div class="todo-content">
        {{ activity.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.todo-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.custom-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: white;
  flex-shrink: 0;
}

.custom-node-completed {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: var(--el-color-info-light-7);
  flex-shrink: 0;
}

.todo-title {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
}

.todo-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.todo-content {
  font-size: 13px;
  color: var(--el-text-color-regular);
  padding-left: 20px;
  cursor: pointer;
}
</style>
