<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "DayView"
});

interface Activity {
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

const value = ref("");
const { lastBuildTime } = __APP_INFO__;
const activities = ref<Activity[]>([
  {
    content: "支持默认颜色测试测试测试",
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    isCompleted: false,
    color: "#F56C6C"
  }
]);

/** 点击事件 */
function handleClick(activity: Activity) {
  activity.isCompleted = !activity.isCompleted;
  message(`点击了待办：${activity.content}`);
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
          <span>这是一个{{ activity.color }}边框的空心节点</span>
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

.message {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  padding: 5px 12px;
  line-height: 18px;
  color: #fff;
  word-break: break-all;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  border-radius: 6px;
}
.message::after {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  content: "";
  border-color: var(--el-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}

.custom-node {
  width: 12px; /* 控制圆点大小 */
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7); /* 默认灰色 */
  background-color: white; /* 背景白色，时间线不穿过 */
}
</style>
