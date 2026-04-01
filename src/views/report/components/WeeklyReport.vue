<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import BarChart from "./BarChart.vue";

defineOptions({
  name: "WeeklyReport"
});

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const reportData = ref<any[]>([]);
const startDate = ref("");
const endDate = ref("");
const barChartData = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return [];
  }
  
  // 按日期分组
  const dateMap: Record<string, Record<string, number>> = {};
  reportData.value.forEach(item => {
    const date = item.date;
    const categoryName = item.categoryName;
    const sum = item.sum || 0;
    
    if (!dateMap[date]) {
      dateMap[date] = {};
    }
    dateMap[date][categoryName] = sum;
  });
  
  // 转换为 BarChart 组件期望的格式
  return Object.keys(dateMap).map(date => {
    const item: Record<string, any> = { category: date };
    Object.keys(dateMap[date]).forEach(category => {
      item[category] = dateMap[date][category];
    });
    return item;
  });
});

const loadReport = async () => {
  loading.value = true;
  try {
    // 从路由参数中获取数据
    const startDateParam = route.query.startDate as string;
    const endDateParam = route.query.endDate as string;
    const reportDataParam = route.query.reportData as string;
    
    if (startDateParam && endDateParam) {
      startDate.value = startDateParam;
      endDate.value = endDateParam;
    }
    
    if (reportDataParam) {
      try {
        reportData.value = JSON.parse(reportDataParam);
      } catch (error) {
        console.error("解析报表数据失败:", error);
      }
    }
  } catch (error) {
    console.error("加载本周报表失败:", error);
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
  <div class="weekly-report-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>本周报表</h3>
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
        <div v-if="barChartData && barChartData.length > 0">
          <div class="date-info">
            <span>{{ startDate }} 至 {{ endDate }}</span>
          </div>
          <div class="chart-container">
            <!-- 条形图 -->
            <BarChart
              :data="barChartData"
              :title="'按类别和日期分布'"
              width="100%"
              height="400px"
            />
          </div>
        </div>
        <el-empty v-else description="暂无报表数据" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.weekly-report-container {
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

.date-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
}

.chart-container {
  margin-top: 20px;
}
</style>
