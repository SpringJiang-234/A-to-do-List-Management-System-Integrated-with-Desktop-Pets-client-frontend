<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Close } from "@element-plus/icons-vue";
import CalendarHeatmap from "./CalendarHeatmap.vue";
import { getTodoCountByDate } from "@/api/report";

defineOptions({
  name: "YearlyReport"
});

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const reportData = ref<any[]>([]);
const startDate = ref("");
const endDate = ref("");
const heatmapData = computed<Array<[string, number]>>(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return [];
  }
  
  // 转换为热力图组件期望的格式：Array<[string, number]>
  const result = reportData.value.map(item => [
    item.date,
    item.sum || 0
  ]) as Array<[string, number]>;
  
  // 打印调试信息
  console.log('热力图数据:', result);
  
  return result;
});

const loadReport = async () => {
  loading.value = true;
  try {
    // 从路由参数中获取日期范围和类别列表
    const startDateParam = route.query.startDate as string;
    const endDateParam = route.query.endDate as string;
    const categoryIdListParam = route.query.categoryIdList as string;
    
    if (startDateParam && endDateParam) {
      startDate.value = startDateParam;
      endDate.value = endDateParam;
      
      // 解析类别列表
      let categoryIdList: number[] = [];
      if (categoryIdListParam) {
        try {
          categoryIdList = JSON.parse(categoryIdListParam);
        } catch (error) {
          console.error("解析类别列表失败:", error);
        }
      }
      
      // 直接调用 API 获取数据
      const response = await getTodoCountByDate({
        startDate: startDateParam,
        endDate: endDateParam,
        categoryIdList
      });
      
      if (response.code === 200) {
        reportData.value = response.data;
      } else {
        console.error("获取热力图数据失败:", response.msg);
      }
    }
  } catch (error) {
    console.error("加载本年报表失败:", error);
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
  <div class="yearly-report-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>本年报表</h3>
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
        <div v-if="heatmapData && heatmapData.length > 0">
          <div class="date-info">
            <span>{{ startDate }} 至 {{ endDate }}</span>
          </div>
          <div class="chart-container">
            <!-- 热力图 -->
            <CalendarHeatmap
              :data="heatmapData"
              :range="[startDate, endDate]"
              width="100%"
              height="300px"
            />
          </div>
        </div>
        <el-empty v-else description="暂无报表数据" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.yearly-report-container {
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
