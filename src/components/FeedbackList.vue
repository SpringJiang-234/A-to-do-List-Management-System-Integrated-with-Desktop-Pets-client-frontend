<script setup lang="ts">
import { message } from "@/utils/message";

interface Activity {
  title: string;
  status: 1 | 2 | 3;
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
  message(`点击了文字：${activity.title}`);
  emit("textClick", activity);
}

const getStatusTag = (
  status: number
): {
  type: "info" | "danger" | "success" | "primary" | "warning";
  text: string;
} => {
  switch (status) {
    case 1:
      return { type: "info", text: "未受理" };
    case 2:
      return { type: "danger", text: "已受理" };
    case 3:
      return { type: "success", text: "已解决" };
    default:
      return { type: "info", text: "未知" };
  }
};
</script>

<template>
  <div class="feedback-list">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="feedback-item"
      @click="handleClick(activity)"
    >
      <div class="feedback-header">
        <span class="feedback-title" @click.stop="handleTextClick(activity)">{{
          activity.title
        }}</span>
        <span class="feedback-time">{{ activity.timestamp }}</span>
      </div>
      <div class="feedback-content">
        <el-tag :type="getStatusTag(activity.status).type">
          {{ getStatusTag(activity.status).text }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.feedback-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.feedback-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.feedback-title {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
}

.feedback-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.feedback-content {
  font-size: 13px;
  color: var(--el-text-color-regular);
  cursor: pointer;
}
</style>
