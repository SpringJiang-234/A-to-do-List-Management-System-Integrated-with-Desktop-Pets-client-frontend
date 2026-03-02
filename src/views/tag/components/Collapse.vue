<script setup lang="ts">
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
const tagGroups = ref([
  {
    name: "重要",
    activities: [
      {
        title: "重要待办1",
        content: "这是一个重要的待办事项",
        timestamp: lastBuildTime,
        isCompleted: false,
        color: "#F56C6C"
      },
      {
        title: "重要待办2",
        content: "这是另一个重要的待办事项",
        timestamp: lastBuildTime,
        isCompleted: true,
        color: "#F56C6C"
      }
    ]
  },
  {
    name: "紧急",
    activities: [
      {
        title: "紧急待办",
        content: "这是一个紧急的待办事项",
        timestamp: lastBuildTime,
        isCompleted: false,
        color: "#E6A23C"
      }
    ]
  },
  {
    name: "工作",
    activities: [
      {
        title: "工作待办",
        content: "这是一个工作相关的待办事项",
        timestamp: lastBuildTime,
        isCompleted: false,
        color: "#409EFF"
      }
    ]
  },
  {
    name: "生活",
    activities: [
      {
        title: "生活待办",
        content: "这是一个生活相关的待办事项",
        timestamp: lastBuildTime,
        isCompleted: false,
        color: "#67C23A"
      }
    ]
  },
  {
    name: "学习",
    activities: [
      {
        title: "学习待办",
        content: "这是一个学习相关的待办事项",
        timestamp: lastBuildTime,
        isCompleted: false,
        color: "#909399"
      }
    ]
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
  <el-collapse>
    <el-collapse-item
      v-for="(group, index) in tagGroups"
      :key="index"
      :title="group.name"
      :name="index"
    >
      <TodoList
        :activities="group.activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
    </el-collapse-item>
  </el-collapse>
</template>
