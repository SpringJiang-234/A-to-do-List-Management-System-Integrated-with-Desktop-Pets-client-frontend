<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "DayView"
});

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

const value = ref("");
const { lastBuildTime } = __APP_INFO__;
const activities = ref<Activity[]>([
  {
    title: "支持默认颜色测试测试测试",
    content: "支持默认颜色测试测试测试",
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "支持自定义颜色",
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    isCompleted: false,
    color: "#F56C6C"
  },
  {
    title: "支持自定义颜色",
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    isCompleted: false,
    color: "#66CCFF"
  }
]);

/** 点击事件 */
function handleClick(activity: Activity) {
  activity.isCompleted = !activity.isCompleted;
  message(`点击了待办：${activity.content}`);
}

/** 点击文字内容事件 */
function handleTextClick(activity: Activity) {
  message(`点击了文字：${activity.content}`);
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <span class="font-medium">待办-日视图</span>
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            size="default"
          />
        </div>
      </div>
    </template>
    <div class="flex">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          :hollow="!activity.isCompleted"
          :color="activity.color"
          @click="handleClick(activity)"
        >
          <!-- 使用 dot 插槽完全自定义节点，仅当 isCompleted 为 false 时生效 -->
          <template #dot v-if="!activity.isCompleted">
            <div
              class="custom-node"
              :style="{
                borderColor: activity.color
              }"
            ></div>
          </template>
          <!-- 只有点击标题才跳到详细页 -->
          <span class="todo-text" @click.stop="handleTextClick(activity)">
            {{ activity.title }}
          </span>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: white;
  cursor: pointer;
}

.todo-text {
  cursor: pointer;
}
</style>
