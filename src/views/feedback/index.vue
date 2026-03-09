<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import FeedbackList from "@/components/FeedbackList.vue";
import { getMyFeedbacks } from "@/api/feedback";
import dayjs from "dayjs";

defineOptions({
  name: "Feedback"
});

const router = useRouter();

interface Activity {
  title: string;
  status: 1 | 2 | 3;
  timestamp: string;
  isCompleted: boolean;
}

interface FeedbackItem {
  id: number;
  title: string;
  content: string;
  status: string;
  updateTime: string;
}

const activities = ref<Activity[]>([]);

const statusMap: Record<string, 1 | 2 | 3> = {
  "未受理": 1,
  "已受理": 2,
  "已解决": 3
};

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const loadFeedbacks = async () => {
  try {
    const result = await getMyFeedbacks();
    if (result.code === 200) {
      activities.value = result.data.map((item: FeedbackItem) => ({
        title: item.title,
        status: statusMap[item.status] || 1,
        timestamp: formatTimestamp(item.updateTime),
        isCompleted: item.status === "已解决"
      }));
    } else {
      message(result.msg || "获取反馈列表失败", { type: "error" });
    }
  } catch (error: unknown) {
    message("获取反馈列表失败", { type: "error" });
  }
};

function handleAddClick() {
  router.push("/feedback/add");
}

function handleTodoClick(activity: Activity) {
  console.log("反馈项被点击:", activity);
}

function handleTextClick(activity: Activity) {
  console.log("反馈文字被点击:", activity);
}

onMounted(() => {
  loadFeedbacks();
});
</script>

<template>
  <div class="feedback-container">
    <el-button type="primary" circle class="add-button" @click="handleAddClick" />
    <el-card shadow="never">
      <template #header>
        <h3>反馈</h3>
      </template>
      <FeedbackList
        :activities="activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.feedback-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
}

.add-button {
  position: fixed;
  left: 230px;
  bottom: 40px;
  z-index: 9999;
  transition: opacity 0.3s ease;
  opacity: 1;
  width: 40px;
  height: 40px;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::before {
    width: 16px;
    height: 2px;
  }
  
  &::after {
    width: 2px;
    height: 16px;
  }
}
</style>
