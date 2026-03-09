<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { submitFeedback } from "@/api/feedback";
import { message } from "@/utils/message";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "FeedbackAdd"
});

const router = useRouter();

const feedbackForm = ref({
  title: "",
  content: ""
});
const submitting = ref(false);

const handleCancel = () => {
  router.back();
};

const handleClose = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!feedbackForm.value.title.trim()) {
    message("请输入反馈标题", { type: "warning" });
    return;
  }

  if (!feedbackForm.value.content.trim()) {
    message("请输入反馈内容", { type: "warning" });
    return;
  }

  try {
    submitting.value = true;
    await submitFeedback({
      title: feedbackForm.value.title,
      content: feedbackForm.value.content
    });
    message("提交成功", { type: "success" });
    router.back();
  } catch (error) {
    console.error("提交反馈失败:", error);
    message("提交失败，请重试", { type: "error" });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="feedback-add-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <div>提交反馈</div>
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
      <el-form label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="feedbackForm.title" placeholder="请输入反馈标题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input 
            v-model="feedbackForm.content" 
            type="textarea" 
            placeholder="请输入反馈内容"
            :rows="8"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.feedback-add-container {
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
</style>
