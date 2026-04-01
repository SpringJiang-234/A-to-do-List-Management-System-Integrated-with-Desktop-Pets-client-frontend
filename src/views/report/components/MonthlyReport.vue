<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "MonthlyReport"
});

const router = useRouter();
const loading = ref(false);
const reportData = ref<any>(null);

const loadReport = async () => {
  loading.value = true;
  try {
  } catch (error) {
    console.error("加载本月报表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  router.back();
};

onMounted(() => {
  loadReport();
});
</script>

<template>
  <div class="monthly-report-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>本月报表</h3>
          <div class="header-actions">
            <el-button
              type="primary"
              circle
              size="small"
              class="close-button"
              @click="handleClose"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.monthly-report-container {
  padding: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-button {
  padding: 4px;
}
</style>
