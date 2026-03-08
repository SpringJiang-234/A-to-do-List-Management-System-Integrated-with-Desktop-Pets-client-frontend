<script setup lang="ts">
import { ref } from "vue";
import TodoList from "@/components/TodoList.vue";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  color?: string;
}

const { lastBuildTime } = __APP_INFO__;
const activities = ref<Activity[]>([
  {
    id: 1,
    title: "重要待办",
    content: "这是一个重要的待办事项",
    timestamp: lastBuildTime,
    status: 1,
    color: "#F56C6C"
  },
  {
    id: 2,
    title: "紧急待办",
    content: "这是一个紧急的待办事项",
    timestamp: lastBuildTime,
    status: 1,
    color: "#E6A23C"
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
