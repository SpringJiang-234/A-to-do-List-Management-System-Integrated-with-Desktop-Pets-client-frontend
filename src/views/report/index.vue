<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "Welcome"
});

const dateRange = ref<string[]>([]);

watch(dateRange, newVal => {
  message(`日期范围：${newVal[0]} 至 ${newVal[1]}`);
});

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const setToday = () => {
  const today = new Date();
  dateRange.value = [formatDate(today), formatDate(today)];
  message(`本日：${dateRange.value[0]} 至 ${dateRange.value[1]}`);
};

const setThisWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  dateRange.value = [formatDate(startOfWeek), formatDate(endOfWeek)];
  message(`本周：${dateRange.value[0]} 至 ${dateRange.value[1]}`);
};

const setThisMonth = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  dateRange.value = [formatDate(startOfMonth), formatDate(endOfMonth)];
  message(`本月：${dateRange.value[0]} 至 ${dateRange.value[1]}`);
};

const setThisYear = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  dateRange.value = [formatDate(startOfYear), formatDate(endOfYear)];
  message(`本年：${dateRange.value[0]} 至 ${dateRange.value[1]}`);
};
</script>

<template>
  <div>
    <!-- 还没想好具体展示什么数据，但是年热力图是一定要有的
  可以导出报表
  时间段自定义也是一定要有的 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <span class="font-medium">报表</span>
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
        <span class="font-small">自定义：</span
        ><el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </el-card>

    <el-card shadow="never"> 放内容 </el-card>
  </div>
</template>

<style scoped>
.font-small {
  display: inline-block;
  margin-left: 50px;
  font-size: 14px;
  font-weight: 400;
}
</style>
