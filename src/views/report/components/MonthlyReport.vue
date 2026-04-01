<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import LineChart from "./LineChart.vue";

defineOptions({
  name: "MonthlyReport"
});

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const reportData = ref<any[]>([]);
const startDate = ref("");
const endDate = ref("");
const lineChartData = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return [];
  }
  
  // 按类别分组
  const categoryMap: Record<string, Record<string, number>> = {};
  const dates = new Set<string>();
  
  reportData.value.forEach(item => {
    const date = item.date;
    const categoryName = item.categoryName;
    const sum = item.sum || 0;
    
    dates.add(date);
    
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = {};
    }
    categoryMap[categoryName][date] = sum;
  });
  
  // 生成日期数组（按顺序）
  const dateArray = Array.from(dates).sort();
  
  // 转换为 LineChart 组件期望的格式
  return Object.keys(categoryMap).map(category => ({
    name: category,
    data: dateArray.map(date => categoryMap[category][date] || 0)
  }));
});

const xAxisData = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return [];
  }
  
  const dates = new Set<string>();
  reportData.value.forEach(item => {
    dates.add(item.date);
  });
  
  return Array.from(dates).sort();
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
        <div v-if="lineChartData && lineChartData.length > 0">
          <div class="date-info">
            <span>{{ startDate }} 至 {{ endDate }}</span>
          </div>
          <div class="chart-container">
            <!-- 折线图 -->
            <LineChart
              :xAxisData="xAxisData"
              :series="lineChartData"
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

.date-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #606266;
}

.chart-container {
  margin-top: 20px;
}
</style>
