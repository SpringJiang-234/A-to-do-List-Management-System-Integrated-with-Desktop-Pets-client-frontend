<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "@/utils/message";
import { abandonTodo } from "@/api/todo";

defineOptions({
  name: "WeekView"
});

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  color?: string;
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
  for(let i = 0; i < 7; i++) {
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

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const todoIds = props.dateTodoMap.get(dateKey) || [];
    const dayName = weekDays[i];
    result[dayName as keyof WeekData] = todoIds.map(id => {
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
  }

  return result;
});

function handleClickTodo(activity: Activity) {
  const todo = props.originalTodoList.find(t => t.id === activity.id);
  if (todo) {
    todo.status = activity.status;
  }
  message(`点击了待办：${activity.title}，ID：${activity.id}`);
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
      case "edit":
        message(`修改待办：${activity.title}`);
        break;
      case "abandon":
        await abandonTodo(activity.id);
        const todo = props.originalTodoList.find(t => t.id === activity.id);
        if (todo) {
          todo.status = 3;
        }
        activity.status = 3;
        message("放弃待办", { type: "warning" });
        break;
      case "delete":
        message(`删除待办：${activity.title}`);
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
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="monday" label="周一" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[1] }}</div>
          <div
            v-for="(activity, index) in row.monday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[2] }}</div>
          <div
            v-for="(activity, index) in row.tuesday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[3] }}</div>
          <div
            v-for="(activity, index) in row.wednesday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[4] }}</div>
          <div
            v-for="(activity, index) in row.thursday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[5] }}</div>
          <div
            v-for="(activity, index) in row.friday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[6] }}</div>
          <div
            v-for="(activity, index) in row.saturday"
            :key="index"
            :class="['todo-item', { 'line-through': activity.status === 2 || activity.status === 3 }]"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
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
          @click="handleMenuAction('edit')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          修改待办
        </div>
        <div
          @click="handleMenuAction('abandon')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          放弃待办
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
