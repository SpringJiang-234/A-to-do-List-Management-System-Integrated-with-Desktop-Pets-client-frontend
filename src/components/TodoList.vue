<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { completeTodo, cancelCompleteTodo, abandonTodo } from "@/api/todo";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  color?: string;
}

interface Props {
  activities: Activity[];
}

interface Emits {
  (e: "click", activity: Activity): void;
  (e: "textClick", activity: Activity): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const currentIndex = ref(-1);
const selectedActivity = ref<Activity | null>(null);

async function handleClick(activity: Activity) {
  try {
    if (activity.status === 2) {
      await cancelCompleteTodo(activity.id);
      activity.status = 1;
      message("取消完成待办", { type: "success" });
    } else {
      await completeTodo(activity.id);
      activity.status = 2;
      message("完成待办", { type: "success" });
    }
    emit("click", activity);
  } catch (error) {
    console.error("更新待办状态失败:", error);
    message("更新失败，请重试", { type: "error" });
  }
}

function handleTextClick(activity: Activity) {
  router.push(`/todo/detail/${activity.id}`);
  emit("textClick", activity);
}

function handleRightClick(event: MouseEvent, index: number) {
  event.preventDefault();
  event.stopPropagation();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  currentIndex.value = index;
  selectedActivity.value = props.activities[index];
  contextMenuVisible.value = true;
}

async function handleMenuAction(action: string) {
  contextMenuVisible.value = false;
  const activity = selectedActivity.value;
  
  if (!activity) return;

  try {
    switch (action) {
      case "edit":
        router.push(`/todo/edit/${activity.id}`);
        break;
      case "abandon":
        await abandonTodo(activity.id);
        activity.status = 3;
        message("放弃待办", { type: "warning" });
        emit("click", activity);
        break;
      case "delete":
        message(`删除待办，index: ${currentIndex.value}`);
        break;
    }
  } catch (error) {
    console.error("操作失败:", error);
    message("操作失败，请重试", { type: "error" });
  }
  
  selectedActivity.value = null;
}
</script>

<template>
  <div class="todo-list">
    <el-popover
      ref="popover"
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

    <div
      v-for="(activity, index) in activities"
      :key="index"
      :class="['todo-item', { 'todo-abandoned': activity.status === 3 }]"
      @click="handleClick(activity)"
      @contextmenu.prevent="handleRightClick($event, index)"
    >
      <div class="todo-header">
        <div
          :class="
            activity.status === 2 ? 'custom-node-completed' : 'custom-node'
          "
          :style="{
            borderColor: activity.color || 'var(--el-color-info-light-7)',
            backgroundColor: activity.status === 2
              ? activity.color || 'var(--el-color-info-light-7)'
              : 'white'
          }"
        ></div>
        <span 
          :class="['todo-title', { 'line-through': activity.status === 2 || activity.status === 3 }]" 
          @click.stop="handleTextClick(activity)"
        >
          {{ activity.title }}
        </span>
        <span class="todo-time">{{ activity.timestamp }}</span>
      </div>
      <div :class="['todo-content', { 'line-through': activity.status === 2 || activity.status === 3 }]">
        {{ activity.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.todo-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.todo-abandoned {
  opacity: 0.6;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.custom-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: white;
  flex-shrink: 0;
}

.custom-node-completed {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: var(--el-color-info-light-7);
  flex-shrink: 0;
}

.todo-title {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  cursor: pointer;
}

.line-through {
  text-decoration: line-through;
}

.todo-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.todo-content {
  font-size: 13px;
  color: var(--el-text-color-regular);
  padding-left: 20px;
  cursor: pointer;
}
</style>
