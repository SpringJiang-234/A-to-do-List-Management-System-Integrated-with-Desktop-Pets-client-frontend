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

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedTodoText = ref<string | null>(null);

const handleRightClick = (event: MouseEvent, todo: string) => {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  selectedTodoText.value = todo;
  contextMenuVisible.value = true;
};

const handleMenuAction = (action: string) => {
  contextMenuVisible.value = false;
  const todo = selectedTodoText.value;

  if (!todo) return;

  switch (action) {
    case "add":
      message("新增待办");
      break;
    case "edit":
      message(`修改待办：${todo}`);
      break;
    case "delete":
      message(`删除待办：${todo}`);
      break;
  }

  selectedTodoText.value = null;
};
</script>

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
        <div
          class="todo-item"
          @click="() => handleClickTodo('测试')"
          @contextmenu.prevent="handleRightClick($event, '测试')"
        >
          测试
        </div>
        <div
          class="todo-item"
          @contextmenu.prevent="handleRightClick($event, '测试')"
        >
          测试
        </div>
        <div
          class="todo-item"
          @contextmenu.prevent="handleRightClick($event, '测试')"
        >
          测试
        </div>
        <div
          class="todo-item"
          @contextmenu.prevent="handleRightClick($event, '测试')"
        >
          测试
        </div>
      </template>
    </el-calendar>

    <!-- 右键菜单 -->
    <el-popover
      v-model:visible="contextMenuVisible"
      placement="bottom-start"
      width="160"
      :popper-style="{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        position: 'absolute'
      }"
    >
      <div class="flex flex-col items-center">
        <div
          @click="handleMenuAction('add')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          新增待办
        </div>
        <div
          @click="handleMenuAction('edit')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          修改待办
        </div>
        <div
          @click="handleMenuAction('delete')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          删除待办
        </div>
      </div>
    </el-popover>
  </el-card>
</template>

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
