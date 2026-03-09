<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "@/utils/message";
import { getAnnouncementDetail } from "@/api/announcement";
import dayjs from "dayjs";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "AnnouncementDetail"
});

const route = useRoute();
const router = useRouter();

const announcementId = ref<number>(0);
const title = ref("");
const content = ref("");
const updateTime = ref("");
const loading = ref(false);

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const parseMarkdown = (markdown: string): string => {
  if (!markdown) return "";
  
  let html = markdown;
  
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  
  html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*)\*/gim, "<em>$1</em>");
  
  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" />');
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
  
  html = html.replace(/`(.*?)`/gim, "<code>$1</code>");
  
  html = html.replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>");
  
  html = html.replace(/\n$/gim, "");
  
  return html;
};

const renderedContent = computed(() => {
  return parseMarkdown(content.value);
});

const loadAnnouncementDetail = async () => {
  try {
    loading.value = true;
    const result = await getAnnouncementDetail(announcementId.value);
    if (result.code === 200) {
      title.value = result.data.title;
      content.value = result.data.content;
      updateTime.value = formatTimestamp(result.data.updateTime);
    } else {
      message(result.msg || "获取公告详情失败", { type: "error" });
    }
  } catch (error) {
    message("获取公告详情失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  router.back();
};

onMounted(() => {
  announcementId.value = Number(route.params.id);
  loadAnnouncementDetail();
});
</script>

<template>
  <div class="announcement-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <div>公告详情</div>
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
          <div class="announcement-title">{{ title }}</div>
          <div class="markdown-content" v-html="renderedContent"></div>
          <div class="update-time">
            <span class="time-label">最新修改时间：</span>
            <span class="time-value">{{ updateTime }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.announcement-detail-container {
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
  gap: 20px;
}

.announcement-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--el-border-color);
}

.markdown-content {
  line-height: 1.8;
  color: var(--el-text-color-primary);
  
  :deep(h1) {
    font-size: 24px;
    font-weight: 600;
    margin: 24px 0 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--el-border-color);
  }
  
  :deep(h2) {
    font-size: 20px;
    font-weight: 600;
    margin: 20px 0 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--el-border-color);
  }
  
  :deep(h3) {
    font-size: 18px;
    font-weight: 600;
    margin: 16px 0 8px;
  }
  
  :deep(p) {
    margin: 12px 0;
    text-align: justify;
  }
  
  :deep(ul) {
    margin: 12px 0;
    padding-left: 24px;
  }
  
  :deep(ol) {
    margin: 12px 0;
    padding-left: 24px;
  }
  
  :deep(li) {
    margin: 6px 0;
  }
  
  :deep(code) {
    padding: 2px 6px;
    background-color: var(--el-fill-color-light);
    border-radius: 4px;
    font-family: "Courier New", Courier, monospace;
    font-size: 14px;
  }
  
  :deep(pre) {
    padding: 16px;
    background-color: var(--el-fill-color-light);
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
    
    code {
      padding: 0;
      background-color: transparent;
    }
  }
  
  :deep(blockquote) {
    margin: 12px 0;
    padding: 12px 16px;
    background-color: var(--el-fill-color-lighter);
    border-left: 4px solid var(--el-color-primary);
    color: var(--el-text-color-regular);
  }
  
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    
    th, td {
      padding: 8px 12px;
      border: 1px solid var(--el-border-color);
      text-align: left;
    }
    
    th {
      background-color: var(--el-fill-color-light);
      font-weight: 600;
    }
  }
  
  :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 12px 0;
  }
}

.update-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  font-size: 14px;
}

.time-label {
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.time-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}
</style>
