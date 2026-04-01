<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import PieChart from "./PieChart.vue";
import LineChart from "./LineChart.vue";
import BarChart from "./BarChart.vue";

defineOptions({
  name: "CustomReport"
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const reportData = ref<any>(null);

const dateRange = ref<string[]>([]);
const chartType = ref("pie");
const categories = ref<string[]>([]);

// 处理饼图数据
const pieChartData = ref<Array<{ name: string; value: number }>>([]);

// 处理折线图和条形图数据
const lineChartData = ref<Array<{ name: string; data: number[] }>>([]);
const xAxisData = ref<string[]>([]);

const processReportData = () => {
  if (!reportData.value) return;

  if (chartType.value === "pie") {
    // 处理饼图数据
    pieChartData.value = reportData.value.map((item: any) => ({
      name: item.categoryName,
      value: item.sum
    }));
  } else {
    // 处理折线图和条形图数据
    // 按类别分组
    const categoryMap: Record<string, Record<string, number>> = {};
    const dates = new Set<string>();

    reportData.value.forEach((item: any) => {
      if (!categoryMap[item.categoryName]) {
        categoryMap[item.categoryName] = {};
      }
      categoryMap[item.categoryName][item.date] = item.sum;
      dates.add(item.date);
    });

    // 生成 x 轴数据（日期）
    xAxisData.value = Array.from(dates).sort();

    // 生成系列数据
    lineChartData.value = Object.entries(categoryMap).map(([category, dataMap]) => ({
      name: category,
      data: xAxisData.value.map(date => dataMap[date] || 0)
    }));
  }
};

const loadReport = async () => {
  loading.value = true;
  try {
    const { startDate, endDate, chartType: queryChartType, categories: queryCategories, reportData: queryReportData } = route.query;
    
    if (startDate && endDate) {
      dateRange.value = [startDate as string, endDate as string];
    }
    if (queryChartType) {
      chartType.value = queryChartType as string;
    }
    if (queryCategories) {
      categories.value = (queryCategories as string).split(",");
    }
    if (queryReportData) {
      try {
        reportData.value = JSON.parse(queryReportData as string);
        processReportData();
      } catch (error) {
        console.error("解析报表数据失败:", error);
      }
    }

    console.log("自定义报表参数:", {
      dateRange: dateRange.value,
      chartType: chartType.value,
      categories: categories.value,
      reportData: reportData.value
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

watch(
  () => reportData.value,
  () => processReportData(),
  { deep: true }
);
</script>

<template>
  <div class="custom-report-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <div>
            <h3>自定义报表</h3>
            <span v-if="dateRange.length === 2" class="date-range">
              {{ dateRange[0] }} 至 {{ dateRange[1] }}
            </span>
          </div>
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
      <div v-loading="loading" class="report-content">
        <div v-if="reportData" class="chart-container">
          <!-- 饼图 -->
          <PieChart
            v-if="chartType === 'pie'"
            :data="pieChartData"
            :title="'按类别分布'"
            width="100%"
            height="400px"
          />
          <!-- 折线图 -->
          <LineChart
            v-else-if="chartType === 'line'"
            :x-axis-data="xAxisData"
            :series="lineChartData"
            :title="'按类别和日期趋势'"
            width="100%"
            height="400px"
          />
          <!-- 条形图 -->
          <BarChart
            v-else-if="chartType === 'bar'"
            :data="lineChartData.map(series => ({
              category: series.name,
              value: series.data.reduce((sum, val) => sum + val, 0)
            }))"
            :title="'按类别分布'"
            width="100%"
            height="400px"
          />
        </div>
        <div v-else class="no-data">
          <el-empty description="暂无报表数据" />
        </div>
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
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
}

.date-range {
  font-size: 14px;
  color: #606266;
}

.close-button {
  padding: 4px;
}

.report-content {
  min-height: 400px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style>
