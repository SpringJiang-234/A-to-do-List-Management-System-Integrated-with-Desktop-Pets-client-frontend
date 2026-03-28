<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import {
  completeTodo,
  cancelCompleteTodo,
  abandonTodo,
  deleteTodo
} from "@/api/todo";
import dayjs from "dayjs";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";
import sakikoMessages from "@/constants/sakiko-messages.json";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  startDate?: string;
  endDate?: string;
  status: number;
  priority?: number;
  isTop?: number;
  color?: string;
}

interface Props {
  activities: Activity[];
}

interface Emits {
  (e: "click", activity: Activity): void;
  (e: "textClick", activity: Activity): void;
  (e: "refresh"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const desktopPetStore = useDesktopPetStoreHook();

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const currentIndex = ref(-1);
const selectedActivity = ref<Activity | null>(null);

const pinnedIndex = computed(() => {
  return props.activities.findIndex(activity => activity.isTop !== 2);
});

const getPriorityColor = (priority?: number) => {
  switch (priority) {
    case 4:
      return "#F56C6C";
    case 3:
      return "#E6A23C";
    case 2:
      return "#409EFF";
    case 1:
    default:
      return "var(--el-color-info-light-7)";
  }
};

const formatTimestamp = (
  timestamp: string,
  startDate?: string,
  endDate?: string
) => {
  if (!timestamp) return "";

  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  if (startDate && endDate && startDate !== endDate) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  return formatDate(timestamp);
};

async function handleClick(activity: Activity) {
  try {
    const previousLevel = desktopPetStore.levelValue;
    const previousMood = desktopPetStore.moodValue;
    const previousVitality = desktopPetStore.vitalityValue;

    if (activity.status === 2) {
      await cancelCompleteTodo(activity.id);
      activity.status = 1;
      message("取消完成待办", { type: "success" });
    } else {
      await completeTodo(activity.id);
      activity.status = 2;
      await desktopPetStore.loadDesktopPetInfo();
      message("完成待办", { type: "success" });

      const isOverdue = dayjs().isAfter(dayjs(activity.endDate).endOf("day"));
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

      let animationPromise = Promise.resolve();

      if (desktopPetStore.levelValue > previousLevel) {
        animationPromise = animationPromise.then(() => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-upgrade-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.upgrade
              );
              setTimeout(resolve, 3500);
            }, 0);
          });
        });
      }

      if (desktopPetStore.vitalityValue === 100 && previousVitality < 100) {
        animationPromise = animationPromise.then(() => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-energetic-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.energetic
              );
              setTimeout(resolve, 3500);
            }, 0);
          });
        });
      }

      const moodChanged = desktopPetStore.moodValue >= 60 && previousMood < 60;
      const moodDecreased = desktopPetStore.moodValue < 60 && previousMood >= 60;

      if (moodChanged) {
        animationPromise = animationPromise.then(() => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-tea-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.onTimeMore
              );
              setTimeout(resolve, 3500);
            }, 0);
          });
        });
      } else if (moodDecreased) {
        animationPromise = animationPromise.then(() => {
          return new Promise<void>(resolve => {
            setTimeout(() => {
              (window as any).ipcRenderer.send("play-pointing-animation");
              (window as any).ipcRenderer.invoke(
                "open-win",
                "pop-up-window",
                sakikoMessages.overdue
              );
              setTimeout(resolve, 3500);
            }, 0);
          });
        });
      }
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
        router.push(`/todo/detail/${activity.id}?edit=true`);
        break;
      case "abandon":
        await abandonTodo(activity.id);
        activity.status = 3;
        message("放弃待办", { type: "warning" });
        (window as any).ipcRenderer.send("play-abandon-animation");
        (window as any).ipcRenderer.invoke(
          "open-win",
          "pop-up-window",
          sakikoMessages.abandon
        );
        emit("click", activity);
        break;
      case "delete":
        console.log("========== TodoList 删除待办 ==========", activity.id);
        await deleteTodo(activity.id);
        message("删除待办成功", { type: "success" });
        (window as any).ipcRenderer.send("play-delete-animation");
        (window as any).ipcRenderer.invoke(
          "open-win",
          "pop-up-window",
          sakikoMessages.delete
        );
        console.log("========== TodoList emit refresh 事件 ==========");
        emit("refresh");
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

    <div v-if="pinnedIndex > 0" class="pinned-section">
      <div class="pinned-title">置顶</div>
      <div
        v-for="(activity, index) in activities.slice(0, pinnedIndex)"
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
              borderColor: getPriorityColor(activity.priority),
              backgroundColor:
                activity.status === 2
                  ? getPriorityColor(activity.priority)
                  : 'white'
            }"
          />
          <div class="todo-info">
            <el-tooltip
              :content="activity.title"
              placement="top-start"
              :show-after="1000"
              :show-arrow="true"
            >
              <span
                :class="[
                  'todo-title',
                  {
                    'line-through':
                      activity.status === 2 || activity.status === 3
                  }
                ]"
                @click.stop="handleTextClick(activity)"
              >
                {{ activity.title }}
              </span>
            </el-tooltip>
            <span class="todo-time">{{
              formatTimestamp(
                activity.timestamp,
                activity.startDate,
                activity.endDate
              )
            }}</span>
          </div>
        </div>
        <div
          :class="[
            'todo-content',
            { 'line-through': activity.status === 2 || activity.status === 3 }
          ]"
        >
          {{ activity.content }}
        </div>
      </div>
      <div class="divider" />
    </div>

    <div
      v-for="(activity, index) in activities.slice(pinnedIndex)"
      :key="index"
      :class="['todo-item', { 'todo-abandoned': activity.status === 3 }]"
      @click="handleClick(activity)"
      @contextmenu.prevent="handleRightClick($event, pinnedIndex + index)"
    >
      <div class="todo-header">
        <div
          :class="
            activity.status === 2 ? 'custom-node-completed' : 'custom-node'
          "
          :style="{
            borderColor: getPriorityColor(activity.priority),
            backgroundColor:
              activity.status === 2
                ? getPriorityColor(activity.priority)
                : 'white'
          }"
        />
        <div class="todo-info">
          <el-tooltip
            :content="activity.title"
            placement="top-start"
            :show-after="1000"
            :show-arrow="true"
          >
            <span
              :class="[
                'todo-title',
                {
                  'line-through': activity.status === 2 || activity.status === 3
                }
              ]"
              @click.stop="handleTextClick(activity)"
            >
              {{ activity.title }}
            </span>
          </el-tooltip>
          <span class="todo-time">{{
            formatTimestamp(
              activity.timestamp,
              activity.startDate,
              activity.endDate
            )
          }}</span>
        </div>
      </div>
      <div
        :class="[
          'todo-content',
          { 'line-through': activity.status === 2 || activity.status === 3 }
        ]"
      >
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

.pinned-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pinned-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 8px 0;
}

.divider {
  height: 1px;
  background-color: var(--el-border-color);
  margin: 8px 0;
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

.todo-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 8px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
