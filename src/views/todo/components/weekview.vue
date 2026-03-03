<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "WeekView"
});

interface Activity {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

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
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(current);
  monday.setDate(diff);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    dates.push(`${month}月${day}日`);
  }

  return dates;
});

const currentWeekRange = computed(() => {
  const current = value.value ? new Date(value.value) : new Date();
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);

  const monday = new Date(current);
  monday.setDate(diff);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
  };

  return `${formatDate(monday)} 至 ${formatDate(sunday)}`;
});

const tableData = [
  {
    sunday: [
      {
        id: "1",
        title: "完成周报",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "2",
        title: "团队会议",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ],
    monday: [
      {
        id: "3",
        title: "项目评审",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "4",
        title: "代码审查",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ],
    tuesday: [
      {
        id: "5",
        title: "需求分析",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ],
    wednesday: [
      {
        id: "6",
        title: "开发任务",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      { id: "7", title: "测试", content: "", timestamp: "", isCompleted: false }
    ],
    thursday: [
      {
        id: "8",
        title: "文档编写",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ],
    friday: [
      {
        id: "9",
        title: "部署上线",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "10",
        title: "总结",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ],
    saturday: [
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      },
      {
        id: "11",
        title: "学习新技术",
        content: "",
        timestamp: "",
        isCompleted: false
      }
    ]
  }
];

function handleClickTodo(activity: Activity) {
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

const handleMenuAction = (action: string) => {
  contextMenuVisible.value = false;
  const activity = selectedActivity.value;

  if (!activity) return;

  switch (action) {
    case "add":
      message("新增待办");
      break;
    case "edit":
      message(`修改待办：${activity.title}`);
      break;
    case "delete":
      message(`删除待办：${activity.title}`);
      break;
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="monday" label="周一" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[0] }}</div>
          <div
            v-for="(activity, index) in row.monday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[1] }}</div>
          <div
            v-for="(activity, index) in row.tuesday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[2] }}</div>
          <div
            v-for="(activity, index) in row.wednesday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[3] }}</div>
          <div
            v-for="(activity, index) in row.thursday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[4] }}</div>
          <div
            v-for="(activity, index) in row.friday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[5] }}</div>
          <div
            v-for="(activity, index) in row.saturday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(activity)"
            @contextmenu.prevent="handleRightClick($event, activity)"
          >
            {{ activity.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sunday" label="周日" min-width="14.2%">
        <template #default="{ row }">
          <div>{{ weekDates[6] }}</div>
          <div
            v-for="(activity, index) in row.sunday"
            :key="index"
            class="todo-item"
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
</style>
