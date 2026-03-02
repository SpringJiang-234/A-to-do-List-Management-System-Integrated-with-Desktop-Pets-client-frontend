<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <span class="font-medium">待办-月视图</span>
        </div>
      </div>
    </template>
    <el-calendar ref="calendar">
      <template #header="{ date }">
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')">
            上一年
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')">
            上一个月
          </el-button>
          <el-button size="small" @click="selectDate('today')">
            今天
          </el-button>
          <el-button size="small" @click="selectDate('next-month')">
            下一个月
          </el-button>
          <el-button size="small" @click="selectDate('next-year')">
            下一年
          </el-button>
        </el-button-group>
      </template>
      <template #date-cell="{ data }" class="date-cell">
        <p :class="data.isSelected ? 'is-selected' : ''" class="date-text">
          {{ data.day.split("-").slice(2).join("-") }}
        </p>
        <!-- 待办事项 -->
        <!-- 点击进入详情页 -->
        <div class="todo-item" @click="() => handleClickTodo('测试')">测试</div>
        <div class="todo-item">测试</div>
        <div class="todo-item">测试</div>
        <div class="todo-item">测试</div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type { CalendarDateType, CalendarInstance } from "element-plus";
import { message } from "@/utils/message";

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};

const handleClickTodo = (todo: string) => {
  message(`点击了待办：${todo}`);
};
</script>

<style lang="scss" scoped>
:deep(.el-calendar-table .el-calendar-day) {
  height: 100px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(transparent, var(--el-bg-color));
    pointer-events: none;
  }
}

.date-text {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.todo-item {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  padding: 2px 4px;
  margin: 2px 0;
  background-color: var(--el-color-primary-light-9);
  border-radius: 2px;
  cursor: pointer;
}
</style>
