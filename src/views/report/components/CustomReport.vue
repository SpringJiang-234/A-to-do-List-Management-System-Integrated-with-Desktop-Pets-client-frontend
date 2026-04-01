<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "CustomReport"
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const reportData = ref<any>(null);

const dateRange = ref<string[]>([]);
const chartType = ref("");
const categories = ref<string[]>([]);

const loadReport = async () => {
  loading.value = true;
  try {
    const { startDate, endDate, chartType: queryChartType, categories: queryCategories } = route.query;
    
    if (startDate && endDate) {
      dateRange.value = [startDate as string, endDate as string];
    }
    if (queryChartType) {
      chartType.value = queryChartType as string;
    }
    if (queryCategories) {
      categories.value = (queryCategories as string).split(",");
    }

    console.log("自定义报表参数:", {
      dateRange: dateRange.value,
      chartType: chartType.value,
      categories: categories.value
    });
  } catch (error) {
    console.error("加载自定义报表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  router.back();
};

watch(
  () => route.query,
  () => {
    loadReport();
  },
  { immediate: true }
);
</script>

<template>
  <div class="custom-report-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>自定义报表</h3>
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
.custom-report-container {
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
