<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import TodoList from "@/components/TodoList.vue";

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

function handleTodoClick(activity: Activity) {
  console.log("待办项被点击:", activity);
}

function handleTextClick(activity: Activity) {
  console.log("文字被点击:", activity);
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
      <TodoList
        :activities="activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
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
</style>
