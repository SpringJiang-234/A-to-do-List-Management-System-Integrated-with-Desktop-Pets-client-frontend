<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import TodoList from "@/components/TodoList.vue";
import { getTodoListByCategoryOrTag, completeTodo, cancelCompleteTodo } from "@/api/todo";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import FluentAlertUrgent16Filled from "~icons/fluent/alert-urgent-16-filled?width=16px&height=16px";
import FluentImportant12Filled from "~icons/fluent/important-12-filled?width=16px&height=16px";

defineOptions({
  name: "Priority"
});

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  startTime?: string;
  endTime?: string;
  status: number;
  priority?: number;
  color?: string;
}

const highPriorityActivities = ref<Activity[]>([]);
const mediumPriorityActivities = ref<Activity[]>([]);
const lowPriorityActivities = ref<Activity[]>([]);
const nonePriorityActivities = ref<Activity[]>([]);
const loading = ref(false);

const loadTodoListByPriority = async (priority: number) => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载待办列表");
      return [];
    }

    const response = await getTodoListByCategoryOrTag({
      userId: userInfo.id,
      priority: priority
    });

    if (response.code === 200) {
      return response.data.map(todo => ({
        id: todo.id,
        title: todo.title,
        content: todo.content,
        timestamp: todo.startTime || "",
        startTime: todo.startTime,
        endTime: todo.endTime,
        status: todo.status,
        priority: todo.priority
      }));
    }
    return [];
  } catch (error) {
    console.error(`加载优先级 ${priority} 的待办失败:`, error);
    return [];
  }
};

const loadAllPriorityTodos = async () => {
  loading.value = true;
  try {
    const [high, medium, low, none] = await Promise.all([
      loadTodoListByPriority(4),
      loadTodoListByPriority(3),
      loadTodoListByPriority(2),
      loadTodoListByPriority(1)
    ]);

    highPriorityActivities.value = high;
    mediumPriorityActivities.value = medium;
    lowPriorityActivities.value = low;
    nonePriorityActivities.value = none;
  } catch (error) {
    console.error("加载待办列表失败:", error);
    message("加载待办列表失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

async function handleClick(activity: Activity) {
  await loadAllPriorityTodos();
}

function handleTextClick(activity: Activity) {
}

onMounted(() => {
  loadAllPriorityTodos();
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h3>优先级</h3>
          </div>
        </div>
      </template>
      <div class="grid-container">
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentImportant12Filled /><FluentAlertUrgent16Filled />重要且紧急
              </div>
            </div>
            <TodoList
              :activities="highPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentImportant12Filled />重要不紧急
              </div>
            </div>
            <TodoList
              :activities="mediumPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <FluentAlertUrgent16Filled />不重要但紧急
              </div>
            </div>
            <TodoList
              :activities="lowPriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
        <el-card class="grid-item" shadow="never">
          <template #header>
            <div class="grid-item-card-header">
              <div class="grid-item-header-content">
                <greenImportant />不重要不紧急
              </div>
            </div>
            <TodoList
              :activities="nonePriorityActivities"
              @click="handleClick"
              @textClick="handleTextClick"
            />
          </template>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}

.grid-item-header-content {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.grid-item-header-content svg {
  width: 20px;
  height: 20px;
}
</style>
