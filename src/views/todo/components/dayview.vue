<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "DayView"
});

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  color?: string;
}

interface Props {
  todoList: Activity[];
  dateTodoMap: Map<string, number[]>;
  originalTodoList: any[];
}

const props = defineProps<Props>();

const value = ref("");
const { lastBuildTime } = __APP_INFO__;
const activities = computed(() => props.todoList);

const currentDayTodos = computed(() => {
  const date = value.value ? new Date(value.value) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;
  
  const todoIds = props.dateTodoMap.get(dateKey) || [];
  return todoIds.map(id => {
    const todo = props.originalTodoList.find(t => t.id === id);
    if (todo) {
      return {
        id: todo.id,
        title: todo.title,
        content: todo.content,
        timestamp: dateKey,
        status: todo.status
      };
    }
    return null;
  }).filter(Boolean) as Activity[];
});

const currentDate = computed(() => {
  const date = value.value ? new Date(value.value) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year} 年 ${month} 月 ${day} 日`;
});

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedActivityIndex = ref<number | null>(null);

/** 点击事件 */
function handleClick(activity: Activity) {
  const todo = props.originalTodoList.find(t => t.id === activity.id);
  if (todo) {
    todo.status = activity.status;
  }
  message(`点击了待办：${activity.content}`);
}

/** 点击文字内容事件 */
function handleTextClick(activity: Activity) {
  message(`点击了文字：${activity.content}`);
}

/** 右键点击事件 */
function handleRightClick(event: MouseEvent, index: number) {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  selectedActivityIndex.value = index;
  contextMenuVisible.value = true;
}

/** 菜单操作处理 */
function handleMenuAction(action: string) {
  contextMenuVisible.value = false;
  const index = selectedActivityIndex.value;

  if (index === null) return;

  switch (action) {
    case "add":
      message("新增待办");
      break;
    case "edit":
      message(`修改待办：${activities.value[index].title},${index}`);
      break;
    case "delete":
      message(`删除待办：${activities.value[index].title},${index}`);
      break;
  }

  selectedActivityIndex.value = null;
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <h3>待办</h3>
          <span
            style="
              font-size: 14px;
              font-weight: 400;
              color: var(--el-text-color-secondary);
            "
            >日视图</span
          >
        </div>
        <div class="date-picker-container">
          <span class="current-date">{{ currentDate }}</span>
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            size="default"
          />
        </div>
      </div>
    </template>
    <div class="flex">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in currentDayTodos"
          :key="index"
          :timestamp="formatTimestamp(activity.timestamp)"
          :hollow="activity.status !== 2"
          :color="activity.color"
          @click="handleClick(activity)"
          @contextmenu.prevent="handleRightClick($event, index)"
        >
          <!-- 使用 dot 插槽完全自定义节点，仅当 status 不为 2 时生效 -->
          <template #dot v-if="activity.status !== 2">
            <div
              class="custom-node"
              :style="{
                borderColor: activity.color
              }"
            ></div>
          </template>
          <!-- 只有点击标题才跳到详细页 -->
          <span class="todo-text" @click.stop="handleTextClick(activity)">
            {{ activity.title }}
          </span>
        </el-timeline-item>
      </el-timeline>
    </div>

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

<style scoped>
.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.date-picker-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 12px;
}

.current-date {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.custom-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: white;
  cursor: pointer;
}

.todo-text {
  cursor: pointer;
}
</style>
