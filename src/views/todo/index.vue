<script setup lang="ts">
import { computed } from "vue";
import Search from "@/views/todo/components/Search.vue";
import { useTodoStoreHook } from "@/store/modules/todo";
import DayView from "@/views/todo/components/DayView.vue";
import WeekView from "@/views/todo/components/WeekView.vue";
import MonthView from "@/views/todo/components/MonthView.vue";

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
  return DayView;
});
</script>

<template>
  <div class="todo-container">
    <div class="header-wrapper">
      <el-card shadow="never">
        <el-collapse expand-icon-position="left">
          <el-collapse-item title="搜索筛选待办">
            <template #default>
              <Search />
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- 待办事项列表 -->
    <!-- 根据筛选条件显示待办事项，特别要注意的是需要根据视图选择展示不同逻辑的列表：
    1、如果是日视图，则展示时间线（可以选择日）
    2、如果是周视图，则展示分段控制器+卡片（一列）列表（可以选择周）
    3、如果是月视图，则展示热力图，按照待办完成数量区分颜色深度（可以选择月） -->
    <div class="main-wrapper">
      <component :is="currentView" />
    </div>
    <div class="footer-wrapper">
      <!-- 这里需要一个回到顶部的按钮 -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.todo-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
}

.header-wrapper {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.main-wrapper {
  flex: 0 1 auto;
  overflow: visible;
}

.footer-wrapper {
  flex-shrink: 0;
}
</style>
