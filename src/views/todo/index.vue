<script setup lang="ts">
import { computed } from "vue";
import SearchCard from "@/components/SearchCard.vue";
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

    <el-button type="primary" circle class="add-button" />

    <div class="header-wrapper">
      <SearchCard />
    </div>

    <!-- 待办事项列表 -->
    <!-- 根据筛选条件显示待办事项，特别要注意的是需要根据视图选择展示不同逻辑的列表：
    1、如果是日视图，则展示时间线（可以选择日）
    2、如果是周视图，则展示分段控制器+卡片（一列）列表（可以选择周）
    3、如果是月视图，则展示热力图，按照待办完成数量区分颜色深度（可以选择月） 
    关于优先级：标题前加上图标
    1、重要且紧急：<FluentImportant12Filled /><FluentAlertUrgent16Filled />
    2、重要不紧急：<FluentImportant12Filled />
    3、不重要但紧急：<FluentAlertUrgent16Filled />
    -->
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

.add-button {
  position: fixed;
  left: 230px;
  bottom: 20px;
  z-index: 9999;
  transition: opacity 0.3s ease;
  opacity: 1;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::before {
    width: 14px;
    height: 2px;
  }
  
  &::after {
    width: 2px;
    height: 14px;
  }
}
</style>
