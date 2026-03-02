<script lang="ts" setup>
import { ref } from "vue";
import TodoList from "@/components/TodoList.vue"; 

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}
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

function handleTodoClick(activity: Activity) {
  console.log("待办项被点击:", activity);
}

function handleTextClick(activity: Activity) {
  console.log("文字被点击:", activity);
}
</script>

<template>
  <div>
    <TodoList
      :activities="activities"
      @click="handleTodoClick"
      @textClick="handleTextClick"
    />
  </div>
</template>

<style lang="scss" scoped></style>
