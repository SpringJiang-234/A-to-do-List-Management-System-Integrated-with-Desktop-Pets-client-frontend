<script setup lang="ts">
import { computed } from "vue";
import Search from "@/views/todo/components/search.vue";
import { useTodoStoreHook } from "@/store/modules/todo";
import DayView from "@/views/todo/components/dayview.vue";
import WeekView from "@/views/todo/components/weekview.vue";
import MonthView from "@/views/todo/components/monthview.vue";
import YearView from "@/views/todo/components/yearview.vue";

defineOptions({
  name: "Todo"
});

const todoStore = useTodoStoreHook();
// 可以在 index 页面中使用 todoStore.filter 来获取 DialogPage 中设置的筛选条件
console.log("筛选条件:", todoStore.filter);

const currentView = computed(() => {
  const timeRule = todoStore.filter.timeRule;
  if (timeRule === "1") {
    return DayView;
  }
  if (timeRule === "2") {
    return WeekView;
  }
  if (timeRule === "3") {
    return MonthView;
  }
  if (timeRule === "4") {
    return YearView;
  }
  return DayView;
});
</script>

<template>
  <div>
    <el-container>
      <el-header>
        <Search />
      </el-header>

      <!-- 待办事项列表 -->
      <!-- 根据筛选条件显示待办事项，特别要注意的是需要根据视图选择展示不同逻辑的列表：
    1、如果是日视图，则展示时间线（可以选择日）
    2、如果是周视图，则展示分段控制器+卡片（一列）列表（可以选择周）
    3、如果是月视图，则展示热力图，按照待办完成数量区分颜色深度（可以选择月） -->
      <el-main scroll="true">
        <component :is="currentView" />
      </el-main>
      <el-footer>
        <!-- 这里需要一个回到顶部的按钮 -->
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped lang="scss"></style>
