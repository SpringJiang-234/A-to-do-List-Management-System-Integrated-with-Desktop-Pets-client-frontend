<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import {
  abandonTodo,
  completeTodo,
  cancelCompleteTodo,
  deleteTodo
} from "@/api/todo";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";
import sakikoMessages from "@/constants/sakiko-messages.json";

defineOptions({
  name: "WeekView"
});

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

interface WeekData {
  sunday: Activity[];
  monday: Activity[];
  tuesday: Activity[];
  wednesday: Activity[];
  thursday: Activity[];
  friday: Activity[];
  saturday: Activity[];
}

interface Props {
  weekData: WeekData;
  dateTodoMap: Map<string, number[]>;
  originalTodoList: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const router = useRouter();
const desktopPetStore = useDesktopPetStoreHook();

const value = ref("");

const dateRange = computed(() => {
  const current = value.value ? new Date(value.value) : new Date();
  const year = current.getFullYear();
  const month = current.getMonth() + 1;

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const dayOfMonth = current.getDate();

  const weekNumber = Math.ceil((dayOfMonth + dayOfWeek) / 7);

  return `${year}年${month}月第${weekNumber}周`;
});

const weekDates = computed(() => {
  const current = value.value ? new Date(value.value) : new Date();
  const day = current.getDay();
  const diff = current.getDate() - day;

  const sunday = new Date(current);
  sunday.setDate(diff);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dates.push(`${month}月${day}日`);
  }

  return dates;
});

const currentWeekRange = computed(() => {
  const current = value.value ? new Date(value.value) : new Date();
  const day = current.getDay();
  const diff = current.getDate() - day;

  const sunday = new Date(current);
  sunday.setDate(diff);

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
  };

  return `${formatDate(sunday)} 至 ${formatDate(saturday)}`;
});

const tableData = computed(() => [props.weekData]);

const currentWeekData = computed(() => {
  const current = value.value ? new Date(value.value) : new Date();
  const day = current.getDay();
  const diff = current.getDate() - day;

  const sunday = new Date(current);
  sunday.setDate(diff);

  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  const result: WeekData = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  };

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const todoIds = props.dateTodoMap.get(dateKey) || [];
    const dayName = weekDays[i];
    result[dayName as keyof WeekData] = todoIds
      .map(id => {
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
      })
      .filter(Boolean) as Activity[];
  }

  return result;
});

function handleClickTodo(activity: Activity) {
  router.push(`/todo/detail/${activity.id}`);
}

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedActivity = ref<Activity | null>(null);

const handleRightClick = (event: MouseEvent, activity: Activity) => {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  selectedActivity.value = activity;
  contextMenuVisible.value = true;
};

const handleMenuAction = async (action: string) => {
  contextMenuVisible.value = false;
  const activity = selectedActivity.value;

  if (!activity) return;

  try {
    switch (action) {
      case "toggleComplete":
        const previousLevel = desktopPetStore.levelValue;
        const previousVitality = desktopPetStore.vitalityValue;

        if (activity.status === 2) {
          await cancelCompleteTodo(activity.id);
          const todo = props.originalTodoList.find(t => t.id === activity.id);
          if (todo) {
            todo.status = 1;
          }
          activity.status = 1;
          message("取消完成待办", { type: "success" });
        } else {
          await completeTodo(activity.id);
          const todo = props.originalTodoList.find(t => t.id === activity.id);
          if (todo) {
            todo.status = 2;
          }
          activity.status = 2;
          await desktopPetStore.loadDesktopPetInfo();
          message("完成待办", { type: "success" });

          const isOverdue =
            activity.endDate && new Date(activity.endDate) < new Date();

          if (isOverdue) {
            (window as any).ipcRenderer.send("play-clap-animation");
            (window as any).ipcRenderer.invoke(
              "open-win",
              "pop-up-window",
              sakikoMessages.complete
            );
          } else {
            (window as any).ipcRenderer.send("play-good-animation");
            (window as any).ipcRenderer.invoke(
              "open-win",
              "pop-up-window",
              sakikoMessages.onTime
            );
          }

          if (desktopPetStore.levelValue > previousLevel) {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-upgrade-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.upgrade
              );
            }, 2500);
          }

          if (desktopPetStore.vitalityValue === 100 && previousVitality < 100) {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-energetic-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.energetic
              );
            }, 2500);
          }

          const moodChange = desktopPetStore.checkMoodChange();
          if (moodChange === "increased") {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-tea-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.onTimeMore
              );
            }, 2500);
          } else if (moodChange === "decreased") {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-pointing-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.overdue
              );
            }, 2500);
          }
        }
        break;
      case "edit":
        router.push(`/todo/detail/${activity.id}?edit=true`);
        break;
      case "abandon":
        await abandonTodo(activity.id);
        const abandonTodoItem = props.originalTodoList.find(
          t => t.id === activity.id
        );
        if (abandonTodoItem) {
          abandonTodoItem.status = 3;
        }
        activity.status = 3;
        message("放弃待办", { type: "warning" });
        break;
      case "delete":
        console.log("========== 周视图删除待办 ==========", activity.id);
        await deleteTodo(activity.id);
        message("删除待办成功", { type: "success" });
        console.log("========== 周视图 emit refresh 事件 ==========");
        emit("refresh");
        break;
    }
  } catch (error) {
    console.error("操作失败:", error);
    message("操作失败，请重试", { type: "error" });
  }

  selectedActivity.value = null;
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
            >周视图</span
          >
        </div>
        <div class="date-picker-container">
          <span class="current-date">{{ currentWeekRange }}</span>
          <el-date-picker
            v-model="value"
            type="week"
            format="[Week] ww"
            placeholder="选择周"
            class="week-picker"
          />
        </div>
      </div>
    </template>
    <el-table :data="[currentWeekData]" border style="width: 100%">
      <el-table-column prop="sunday" label="周日" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[0] }}</div>
          <div
            v-for="(activity, index) in row.sunday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="monday" label="周一" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[1] }}</div>
          <div
            v-for="(activity, index) in row.monday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[2] }}</div>
          <div
            v-for="(activity, index) in row.tuesday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[3] }}</div>
          <div
            v-for="(activity, index) in row.wednesday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[4] }}</div>
          <div
            v-for="(activity, index) in row.thursday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[5] }}</div>
          <div
            v-for="(activity, index) in row.friday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[6] }}</div>
          <div
            v-for="(activity, index) in row.saturday"
            :key="index"
            :class="[
              'todo-item',
              { 'line-through': activity.status === 2 || activity.status === 3 }
            ]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span>{{ activity.title }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
          {{ selectedActivity?.status === 2 ? "取消完成待办" : "完成待办" }}
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

.week-picker {
  padding: 12px;
  width: auto;
}

:deep(.el-table .cell) {
  text-align: left;
  vertical-align: top;
}

:deep(.el-table td.el-table__cell) {
  vertical-align: top;
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
</style>
