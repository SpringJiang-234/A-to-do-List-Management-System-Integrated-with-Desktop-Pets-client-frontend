<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import FeedbackList from "@/components/FeedbackList.vue";

defineOptions({
  name: "Feedback"
});

interface Activity {
  title: string;
  status: 1 | 2 | 3;
  timestamp: string;
  isCompleted: boolean;
}

const { lastBuildTime } = __APP_INFO__;

const activities = ref<Activity[]>([
  {
    title: "功能建议",
    status: 1,
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "Bug 反馈",
    status: 2,
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "界面优化建议",
    status: 3,
    timestamp: lastBuildTime,
    isCompleted: true
  }
]);

function handleTodoClick(activity: Activity) {
  console.log("反馈项被点击:", activity);
}

function handleTextClick(activity: Activity) {
  console.log("反馈文字被点击:", activity);
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>公告</span>
      </template>
      <FeedbackList
        :activities="activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
    </el-card>
    <!-- 有我的反馈面板，还有提交反馈面板 -->
  </div>
</template>
