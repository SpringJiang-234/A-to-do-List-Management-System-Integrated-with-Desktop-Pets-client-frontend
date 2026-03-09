<script setup lang="ts">
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
  emit("click", activity);
}

function handleTextClick(activity: Activity) {
  emit("textClick", activity);
}
</script>

<template>
  <div class="announce-list">
    <div
      v-for="(activity, index) in activities"
      :key="index"
      class="announce-item"
      @click="handleClick(activity)"
    >
      <div class="announce-header">
        <span class="announce-title" @click.stop="handleTextClick(activity)">{{
          activity.title
        }}</span>
        <span class="announce-time">{{ activity.timestamp }}</span>
      </div>
      <div class="announce-content">
        {{ activity.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.announce-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.announce-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.announce-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.announce-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.announce-title {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
}

.announce-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.announce-content {
  font-size: 13px;
  color: var(--el-text-color-regular);
  cursor: pointer;
}
</style>
