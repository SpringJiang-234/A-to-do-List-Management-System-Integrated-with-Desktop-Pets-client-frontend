<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import type { CalendarDateType, CalendarInstance } from "element-plus";
import { message } from "@/utils/message";
import {
  abandonTodo,
  completeTodo,
  cancelCompleteTodo,
  deleteTodo
} from "@/api/todo";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";
import sakikoMessages from "@/constants/sakiko-messages.json";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  priority?: number;
  color?: string;
  endDate?: string;
}

interface MonthData {
  [key: string]: Activity[];
}

interface Props {
  monthData: MonthData;
  dateTodoMap: Map<string, number[]>;
  originalTodoList: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const router = useRouter();
const desktopPetStore = useDesktopPetStoreHook();

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};

const handleClickTodo = (todo: Activity) => {
  router.push(`/todo/detail/${todo.id}`);
};

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedTodo = ref<Activity | null>(null);

const handleRightClick = (event: MouseEvent, todo: Activity) => {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  selectedTodo.value = todo;
  contextMenuVisible.value = true;
};

const handleMenuAction = async (action: string) => {
  contextMenuVisible.value = false;
  const todo = selectedTodo.value;

  if (!todo) return;

  try {
    switch (action) {
      case "toggleComplete":
        const previousLevel = desktopPetStore.levelValue;
        const previousMood = desktopPetStore.moodValue;
        const previousVitality = desktopPetStore.vitalityValue;

        if (todo.status === 2) {
          await cancelCompleteTodo(todo.id);
          const cancelTodoItem = props.originalTodoList.find(
            t => t.id === todo.id
          );
          if (cancelTodoItem) {
            cancelTodoItem.status = 1;
          }
          todo.status = 1;
          message("取消完成待办", { type: "success" });
        } else {
          await completeTodo(todo.id);
          const completeTodoItem = props.originalTodoList.find(
            t => t.id === todo.id
          );
          if (completeTodoItem) {
            completeTodoItem.status = 2;
          }
          todo.status = 2;
          await desktopPetStore.loadDesktopPetInfo();
          message("完成待办", { type: "success" });

          const isOverdue = todo.endDate && new Date(todo.endDate) < new Date();

          const isEnergetic =
            desktopPetStore.vitalityValue === 100 && previousVitality < 100;
          const isUpgrade = desktopPetStore.levelValue > previousLevel;
          const moodChanged =
            desktopPetStore.moodValue >= 60 && previousMood < 60;
          const moodDecreased =
            desktopPetStore.moodValue < 60 && previousMood >= 60;

          if (isOverdue) {
            (window as any).ipcRenderer.invoke(
              "open-win",
              "pop-up-window",
              sakikoMessages.complete
            );
            (window as any).ipcRenderer.send(
              "play-complete-todo-overdue-animation",
              isEnergetic,
              isUpgrade,
              moodDecreased,
              {
                complete: sakikoMessages.complete,
                energetic: sakikoMessages.energetic,
                upgrade: sakikoMessages.upgrade,
                overdue: sakikoMessages.overdue
              }
            );
          } else {
            (window as any).ipcRenderer.invoke(
              "open-win",
              "pop-up-window",
              sakikoMessages.onTime
            );
            (window as any).ipcRenderer.send(
              "play-complete-todo-on-time-animation",
              isEnergetic,
              isUpgrade,
              moodChanged,
              {
                complete: sakikoMessages.onTime,
                energetic: sakikoMessages.energetic,
                upgrade: sakikoMessages.upgrade,
                onTimeMore: sakikoMessages.onTimeMore
              }
            );
          }
        }
        break;
      case "edit":
        router.push(`/todo/detail/${todo.id}?edit=true`);
        break;
      case "abandon":
        await abandonTodo(todo.id);
        const originalTodo = props.originalTodoList.find(t => t.id === todo.id);
        if (originalTodo) {
          originalTodo.status = 3;
        }
        todo.status = 3;
        message("放弃待办", { type: "warning" });
        (window as any).ipcRenderer.send("play-abandon-animation");
        (window as any).ipcRenderer.invoke(
          "open-win",
          "pop-up-window",
          sakikoMessages.abandon
        );
        break;
      case "delete":
        console.log("========== 月视图删除待办 ==========", todo.id);
        await deleteTodo(todo.id);
        message("删除待办成功", { type: "success" });
        (window as any).ipcRenderer.send("play-delete-animation");
        (window as any).ipcRenderer.invoke(
          "open-win",
          "pop-up-window",
          sakikoMessages.delete
        );
        console.log("========== 月视图 emit refresh 事件 ==========");
        emit("refresh");
        break;
    }
  } catch (error) {
    console.error("操作失败:", error);
    message("操作失败，请重试", { type: "error" });
  }

  selectedTodo.value = null;
};
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
            >月视图</span
          >
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
        <div
          v-for="todo in props.monthData[data.day] || []"
          :key="todo.id"
          :class="[
            'todo-item',
            { 'line-through': todo.status === 2 || todo.status === 3 }
          ]"
          @click="() => handleClickTodo(todo)"
          @contextmenu.prevent="handleRightClick($event, todo)"
        >
          <el-tooltip
            :content="todo.title"
            placement="top-start"
            :show-after="1000"
            :show-arrow="true"
          >
            <span>{{ todo.title }}</span>
          </el-tooltip>
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
          class="py-2.5 border-b w-full cursor-pointer text-center"
          @click="handleMenuAction('toggleComplete')"
        >
          {{ selectedTodo?.status === 2 ? "取消完成待办" : "完成待办" }}
        </div>
        <div
          class="py-2.5 border-b w-full cursor-pointer text-center"
          @click="handleMenuAction('edit')"
        >
          修改待办
        </div>
        <div
          class="py-2.5 border-b w-full cursor-pointer text-center"
          @click="handleMenuAction('abandon')"
        >
          放弃待办
        </div>
        <div
          class="py-2.5 border-b w-full cursor-pointer text-center"
          @click="handleMenuAction('delete')"
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

.line-through {
  text-decoration: line-through;
}

.header-content {
  display: flex;
  align-items: flex-end;
  width: 100%;
}
</style>
