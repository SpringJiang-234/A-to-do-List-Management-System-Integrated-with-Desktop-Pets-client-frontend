<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "@/utils/message";
import { getFeedbackDetail } from "@/api/feedback";
import dayjs from "dayjs";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "FeedbackDetail"
});

const route = useRoute();
const router = useRouter();

const feedbackId = ref<number>(0);
const userId = ref("");
const title = ref("");
const content = ref("");
const status = ref(1);
const replyContent = ref("");
const createTime = ref("");
const updateTime = ref("");
const loading = ref(false);

const statusText = computed(() => {
  const statusMap = {
    1: "未受理",
    2: "已受理",
    3: "已解决"
  };
  return statusMap[status.value] || "";
});

const statusTagType = computed(() => {
  switch (status.value) {
    case 1:
      return "danger";
    case 2:
      return "warning";
    case 3:
      return "success";
    default:
      return "info";
  }
});

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const loadFeedbackDetail = async () => {
  try {
    loading.value = true;
    const result = await getFeedbackDetail(feedbackId.value);
    if (result.code === 200) {
      const data = result.data;
      userId.value = String(data.userId || "");
      title.value = data.title || "";
      content.value = data.content || "";
      status.value = data.status;
      replyContent.value = data.replyContent || "";
      createTime.value = formatTimestamp(data.createTime);
      updateTime.value = formatTimestamp(data.updateTime);
    } else {
      message(result.msg || "获取反馈详情失败", { type: "error" });
    }
  } catch (error) {
    message("获取反馈详情失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  router.back();
};

onMounted(() => {
  feedbackId.value = Number(route.params.id);
  loadFeedbackDetail();
});
</script>

<template>
  <div class="feedback-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <div>反馈详情</div>
          <el-button 
            type="primary" 
            circle 
            size="small" 
            @click="handleClose"
            class="close-button"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      <div v-loading="loading">
        <div class="detail-content">
          <div class="feedback-section">
            <div class="section-title">反馈内容</div>
            <div class="feedback-title">{{ title }}</div>
            <div class="feedback-content">{{ content }}</div>
          </div>
          
          <div class="feedback-meta">
            <span class="meta-item">
              <span class="meta-label">创建时间：</span>
              <span class="meta-value">{{ createTime }}</span>
            </span>
            <span class="meta-item">
              <span class="meta-label">处理状态：</span>
              <el-tag :type="statusTagType" size="small">
                {{ statusText }}
              </el-tag>
            </span>
          </div>
          
          <div class="feedback-section" v-if="replyContent">
            <div class="section-title">回复内容</div>
            <div class="reply-content">{{ replyContent }}</div>
          </div>
          
          <div class="feedback-meta" v-if="replyContent">
            <span class="meta-item">
              <span class="meta-label">回复时间：</span>
              <span class="meta-value">{{ updateTime }}</span>
            </span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.feedback-detail-container {
  padding: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  padding: 4px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feedback-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color);
}

.feedback-title {
  font-size: 16px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
  margin-bottom: 8px;
}

.feedback-content {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.reply-content {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.feedback-meta {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  font-weight: 500;
}

.meta-value {
  color: var(--el-text-color-regular);
}
</style>
