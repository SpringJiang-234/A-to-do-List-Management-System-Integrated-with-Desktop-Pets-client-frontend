<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "WeekView"
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

/** 分段控制器选项 */
const options = [
  { label: "周一", value: 1 },
  { label: "周二", value: 2 },
  { label: "周三", value: 3 },
  { label: "周四", value: 4 },
  { label: "周五", value: 5 },
  { label: "周六", value: 6 },
  { label: "周日", value: 0 }
];

/** change 事件 */
function onChange(value: any) {
  const option = options.find(opt => opt.value === value);
  const index = options.indexOf(option);
  message(`当前选中项索引为：${index}，名字为${option.label}，值为${value}`, {
    type: "success"
  });
}

/** 点击事件 */
function handleClick(activity: Activity) {
  activity.isCompleted = !activity.isCompleted;
  message(`切换是否完成：${activity.isCompleted}`);
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
          <span class="font-medium">待办-周视图</span>
          <el-date-picker
            v-model="value"
            type="week"
            format="[Week] ww"
            placeholder="选择周"
          />
        </div>
      </div>
    </template>
    <!-- 分段控制器：周一到周日 选择 -->
    <el-segmented v-model="value" :options="options" block @change="onChange" />
    <div style="margin-top: 20px">
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
                // 完成状态下，节点背景颜色与边框颜色一致
                backgroundColor: activity.isCompleted
                  ? activity.color || 'var(--el-color-info-light-7)'
                  : 'white'
              }"
            ></div>
            <!-- 只有点击标题才跳到详细页 -->
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
