<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import Select from "@/components/Select.vue";
import { getCategoryList } from "@/api/category";
import { getTodoCountByCategory, getTodoCountByCategoryAndDate } from "@/api/report";
import { storageLocal } from "@pureadmin/utils";
import { userKey, type DataInfo } from "@/utils/auth";

defineOptions({
  name: "Welcome"
});

const router = useRouter();
const userDefinedDateRange = ref<any[]>([]);
const systemDateRange = ref<string[]>([]);

watch(userDefinedDateRange, newVal => {
  console.log("userDefinedDateRange changed:", newVal);
  if (newVal && Array.isArray(newVal) && newVal.length === 2 && newVal[0] && newVal[1]) {
    const startDate = formatDate(newVal[0]);
    const endDate = formatDate(newVal[1]);
    message(`自定义日期范围：${startDate} 至 ${endDate}`);
  }
});

const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const setToday = async () => {
  const today = new Date();
  const startDate = formatDate(today);
  const endDate = formatDate(today);
  systemDateRange.value = [startDate, endDate];
  message(`本日：${systemDateRange.value[0]} 至 ${systemDateRange.value[1]}`);
  
  // 获取所有类别
  const categoryIdList = formInline.value.categories.map(id => parseInt(id, 10));
  
  try {
    // 调用 API 获取饼图数据
    const response = await getTodoCountByCategory({
      startDate,
      endDate,
      categoryIdList
    });
    
    if (response.code === 200) {
      const reportData = response.data;
      
      // 跳转到 DailyReport 页面并传递数据
      router.push({
        name: "DailyReport",
        query: {
          startDate,
          endDate,
          reportData: JSON.stringify(reportData)
        }
      });
    } else {
      message("获取本日报表数据失败: " + response.msg, { type: "error" });
      // 即使获取数据失败，也要跳转到页面
      router.push({ name: "DailyReport" });
    }
  } catch (error) {
    console.error("获取本日报表数据失败:", error);
    message("获取本日报表数据失败，请稍后重试", { type: "error" });
    // 即使获取数据失败，也要跳转到页面
    router.push({ name: "DailyReport" });
  }
};

const setThisWeek = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const startDate = formatDate(startOfWeek);
  const endDate = formatDate(endOfWeek);
  systemDateRange.value = [startDate, endDate];
  message(`本周：${systemDateRange.value[0]} 至 ${systemDateRange.value[1]}`);
  
  // 获取所有类别
  const categoryIdList = formInline.value.categories.map(id => parseInt(id, 10));
  
  try {
    // 调用 API 获取条形图数据（按类别和日期分组）
    const response = await getTodoCountByCategoryAndDate({
      startDate,
      endDate,
      categoryIdList
    });
    
    if (response.code === 200) {
      const reportData = response.data;
      
      // 跳转到 WeeklyReport 页面并传递数据
      router.push({
        name: "WeeklyReport",
        query: {
          startDate,
          endDate,
          reportData: JSON.stringify(reportData)
        }
      });
    } else {
      message("获取本周报表数据失败: " + response.msg, { type: "error" });
      // 即使获取数据失败，也要跳转到页面
      router.push({ name: "WeeklyReport" });
    }
  } catch (error) {
    console.error("获取本周报表数据失败:", error);
    message("获取本周报表数据失败，请稍后重试", { type: "error" });
    // 即使获取数据失败，也要跳转到页面
    router.push({ name: "WeeklyReport" });
  }
};

const setThisMonth = async () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDate = formatDate(startOfMonth);
  const endDate = formatDate(endOfMonth);
  systemDateRange.value = [startDate, endDate];
  message(`本月：${systemDateRange.value[0]} 至 ${systemDateRange.value[1]}`);
  
  // 获取所有类别
  const categoryIdList = formInline.value.categories.map(id => parseInt(id, 10));
  
  try {
    // 调用 API 获取折线图数据（按类别和日期分组）
    const response = await getTodoCountByCategoryAndDate({
      startDate,
      endDate,
      categoryIdList
    });
    
    if (response.code === 200) {
      const reportData = response.data;
      
      // 跳转到 MonthlyReport 页面并传递数据
      router.push({
        name: "MonthlyReport",
        query: {
          startDate,
          endDate,
          reportData: JSON.stringify(reportData)
        }
      });
    } else {
      message("获取本月报表数据失败: " + response.msg, { type: "error" });
      // 即使获取数据失败，也要跳转到页面
      router.push({ name: "MonthlyReport" });
    }
  } catch (error) {
    console.error("获取本月报表数据失败:", error);
    message("获取本月报表数据失败，请稍后重试", { type: "error" });
    // 即使获取数据失败，也要跳转到页面
    router.push({ name: "MonthlyReport" });
  }
};

const setThisYear = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  systemDateRange.value = [formatDate(startOfYear), formatDate(endOfYear)];
  message(`本年：${systemDateRange.value[0]} 至 ${systemDateRange.value[1]}`);
  router.push({ name: "YearlyReport" });
};

const formInline = ref({
  chartType: "pie",
  categories: []
});

const chartTypes = [
  { value: "pie", label: "饼图" },
  { value: "bar", label: "条形图" },
  { value: "line", label: "折线图" }
];

const chartTypeMap: Record<string, string> = {
  pie: "饼图",
  bar: "条形图",
  line: "折线图"
};

const categories = ref<any[]>([]);

const loadCategories = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载分类");
      return;
    }

    const systemCategoryResponse = await getCategoryList(0);
    const userCategoryResponse = await getCategoryList(userInfo.id);

    const systemCategories =
      systemCategoryResponse.code === 200 ? systemCategoryResponse.data : [];
    const userCategories =
      userCategoryResponse.code === 200 ? userCategoryResponse.data : [];

    categories.value = [...systemCategories, ...userCategories].map(
      (item: any) => ({
        value: item.id.toString(),
        label: item.name
      })
    );
  } catch (error) {
    console.error("加载分类失败:", error);
  }
};

onMounted(() => {
  const today = new Date();
  systemDateRange.value = [formatDate(today), formatDate(today)];
  loadCategories();

  watch(
    () => categories.value,
    newCategories => {
      if (newCategories && newCategories.length > 0) {
        formInline.value.categories = newCategories.map(cat => cat.value.toString());
      }
    },
    { immediate: true }
  );
});

const generateReport = async () => {
  if (userDefinedDateRange.value.length !== 2) {
    message("请选择日期范围", { type: "error" });
    return;
  }

  const startDate = formatDate(userDefinedDateRange.value[0]);
  const endDate = formatDate(userDefinedDateRange.value[1]);
  const categoryIdList = formInline.value.categories.map(id => parseInt(id, 10));

  try {
    let reportData;
    if (formInline.value.chartType === "pie") {
      // 饼图使用 getTodoCountByCategory API
      const response = await getTodoCountByCategory({
        startDate,
        endDate,
        categoryIdList
      });
      if (response.code === 200) {
        reportData = response.data;
      } else {
        message(`获取饼图数据失败: ${response.msg}`, { type: "error" });
        return;
      }
    } else {
      // 折线图和条形图使用 getTodoCountByCategoryAndDate API
      const response = await getTodoCountByCategoryAndDate({
        startDate,
        endDate,
        categoryIdList
      });
      if (response.code === 200) {
        reportData = response.data;
      } else {
        message(`获取图表数据失败: ${response.msg}`, { type: "error" });
        return;
      }
    }

    message(`生成报表：${startDate} 至 ${endDate}，图表类型：${chartTypeMap[formInline.value.chartType]}`);

    const query: any = {
      startDate,
      endDate,
      chartType: formInline.value.chartType,
      categories: formInline.value.categories.join(","),
      reportData: JSON.stringify(reportData)
    };

    router.push({
      name: "CustomReport",
      query
    });
  } catch (error) {
    console.error("生成报表失败:", error);
    message("生成报表失败，请稍后重试", { type: "error" });
  }
};
</script>

<template>
  <div class="report-container">
    <!-- 还没想好具体展示什么数据，但是年热力图是一定要有的
  可以导出报表
  时间段自定义也是一定要有的 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h3>快速生成报表</h3>
          </div>
        </div>
      </template>
      <!-- 选择日期范围 -->
      <div class="date-picker-wrapper">
        <el-button-group>
          <el-button @click="setToday">本日</el-button>
          <el-button @click="setThisWeek">本周</el-button>
          <el-button @click="setThisMonth">本月</el-button>
          <el-button @click="setThisYear">本年</el-button>
        </el-button-group>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <span>自定义报表</span>
          </div>
        </div>
      </template>
      <div class="form-item">
        <span class="font-small">日期范围：</span><el-date-picker v-model="userDefinedDateRange" type="daterange"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </div>
      <div class="form-item">
        <span class="font-small">报表类型：</span>
        <Select v-model="formInline.chartType" :options="chartTypes" placeholder="请选择图表类型" :multiple="false"
          width="240px" />
      </div>
      <div class="form-item">
        <span class="font-small">类别：</span>
        <Select v-model="formInline.categories" :options="categories" placeholder="请选择类别" all-text="全选"
          :max-collapse-tags="1" width="240px" />
      </div>
      <div class="form-item">
        <el-button type="primary" @click="generateReport">生成报表</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.report-container :deep(.el-card) {
  margin-bottom: 20px;
}

.font-small {
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
}

.form-item {
  margin-bottom: 20px;
}
</style>
