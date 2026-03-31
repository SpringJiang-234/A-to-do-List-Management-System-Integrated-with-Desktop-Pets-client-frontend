<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { updateFocusTime, getTodoDetails } from "@/api/todo";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import sakikoMessages from "@/constants/sakiko-messages.json";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";

defineOptions({
  name: "CompoundTimer"
});

const route = useRoute();

const desktopPetStore = useDesktopPetStoreHook();

const valueType = ref((route.query.valueType as string) || "番茄钟");
const timeValue1 = ref(
  route.query.timeValue1
    ? new Date(route.query.timeValue1 as string)
    : new Date("1970-01-01T02:00:00")
);
const timeValue2 = ref(
  route.query.timeValue2
    ? new Date(route.query.timeValue2 as string)
    : new Date("1970-01-01T00:25:00")
);
const timeValue3 = ref(
  route.query.timeValue3
    ? new Date(route.query.timeValue3 as string)
    : new Date("1970-01-01T00:05:00")
);
const timeValue4 = ref(
  route.query.timeValue4 ? parseInt(route.query.timeValue4 as string) : 4
);
const todoId = ref(
  route.query.todoId ? parseInt(route.query.todoId as string) : null
);
const todoTitle = ref((route.query.todoTitle as string) || "");
const todoCategoryName = ref("");

const formatTime = (timeValue: string | Date): string => {
  if (!timeValue) return "0小时0分钟0秒";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hours}小时${minutes}分钟${seconds}秒`;
};

const formatTimeForDisplay = (timeValue: string | Date): string => {
  if (!timeValue) return "00:00:00";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const remainingTime = ref(0);
const isRunning = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);
const currentCycle = ref(1);
const isBreak = ref(false);
const isCompleted = ref(false);

const loadTodoDetail = async () => {
  if (todoId.value) {
    try {
      const response = await getTodoDetails(todoId.value);
      if (response.code === 200 && response.data) {
        todoCategoryName.value = response.data.categoryName || "";

        const categoryName = todoCategoryName.value.toLowerCase();

        if (categoryName.includes("工作")) {
          (window as any).ipcRenderer.send("play-work-animation");
        } else if (categoryName.includes("学习")) {
          (window as any).ipcRenderer.send("play-study-animation");
        } else if (categoryName.includes("娱乐")) {
          (window as any).ipcRenderer.send("play-entertain-animation");
        } else {
          (window as any).ipcRenderer.send("play-other-animation");
        }
      }
    } catch (error) {
      console.error("获取待办详情失败:", error);
    }
  }
};

onMounted(async () => {
  await desktopPetStore.loadDesktopPetInfo();
  await loadTodoDetail();

  if (valueType.value === "正计时") {
    isRunning.value = true;
    timer.value = setInterval(() => {
      remainingTime.value++;
    }, 1000);
  } else if (valueType.value === "倒计时" && timeValue1.value) {
    startTimer();
  } else if (valueType.value === "番茄钟" && timeValue2.value) {
    startTimer();
  }
});

const formatRemainingTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const startTimer = () => {
  if (isRunning.value) return;

  isRunning.value = true;

  let targetSeconds = 0;

  if (valueType.value === "倒计时" && timeValue1.value) {
    const date = timeValue1.value;
    targetSeconds =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  } else if (
    valueType.value === "番茄钟" &&
    !isBreak.value &&
    timeValue2.value
  ) {
    const date = timeValue2.value;
    targetSeconds =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  } else if (
    valueType.value === "番茄钟" &&
    isBreak.value &&
    timeValue3.value
  ) {
    const date = timeValue3.value;
    targetSeconds =
      date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  if (targetSeconds > 0 && remainingTime.value === 0) {
    remainingTime.value = targetSeconds;
  }

  if (valueType.value === "正计时" || remainingTime.value > 0) {
    timer.value = setInterval(() => {
      if (valueType.value === "正计时") {
        remainingTime.value++;
      } else if (remainingTime.value > 0) {
        remainingTime.value--;
      } else {
        stopTimer();
        handleTimerComplete();
      }
    }, 1000);
  }
};

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  isRunning.value = false;
  
  if (valueType.value !== "番茄钟") {
    const isHighMood = desktopPetStore.moodValue >= 60;
    console.log("========== 计时器停止 ==========", {
      moodValue: desktopPetStore.moodValue,
      isHighMood,
      valueType: valueType.value
    });
    (window as any).ipcRenderer.send("play-timer-end-animation", isHighMood);
  }
};

const resetTimer = () => {
  stopTimer();
  remainingTime.value = 0;
  currentCycle.value = 1;
  isBreak.value = false;

  if (valueType.value === "番茄钟") {
    const isHighMood = desktopPetStore.moodValue >= 60;
    (window as any).ipcRenderer.send("play-timer-end-animation", isHighMood);
  }

  window.close();
};

const completeTimer = async () => {
  stopTimer();

  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  const todoId = route.query.todoId
    ? parseInt(route.query.todoId as string)
    : null;

  if (todoId && userInfo?.token) {
    try {
      await updateFocusTime({
        id: todoId,
        focusTime: remainingTime.value
      });
      message(`计时完成！用时：${formatRemainingTime(remainingTime.value)}`, {
        type: "success"
      });
    } catch (error) {
      console.error("更新专注时间失败:", error);
      message(`计时完成！用时：${formatRemainingTime(remainingTime.value)}`, {
        type: "success"
      });
    }
  } else {
    message(`计时完成！用时：${formatRemainingTime(remainingTime.value)}`, {
      type: "success"
    });
  }

  remainingTime.value = 0;
  isCompleted.value = true;

  setTimeout(() => {
    window.close();
  }, 2000);
};

const handleTimerComplete = async () => {
  stopTimer();

  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  const todoId = route.query.todoId
    ? parseInt(route.query.todoId as string)
    : null;

  const updateFocusTimeToBackend = async (focusTime: number) => {
    if (todoId && userInfo?.token) {
      try {
        await updateFocusTime({
          id: todoId,
          focusTime: focusTime
        });
      } catch (error) {
        console.error("更新专注时间失败:", error);
      }
    }
  };

  if (valueType.value === "番茄钟" && !isBreak.value) {
    const focusTimeSeconds =
      timeValue2.value.getHours() * 3600 +
      timeValue2.value.getMinutes() * 60 +
      timeValue2.value.getSeconds();
    await updateFocusTimeToBackend(focusTimeSeconds);

    if (currentCycle.value < timeValue4.value) {
      message(`第${currentCycle.value}个番茄钟完成，开始休息`, {
        type: "success"
      });
      isBreak.value = true;
      startTimer();
    } else {
      message(`第${currentCycle.value}个番茄钟完成，开始休息`, {
        type: "success"
      });
      isBreak.value = true;
      startTimer();
    }
  } else if (valueType.value === "番茄钟" && isBreak.value) {
    if (currentCycle.value < timeValue4.value) {
      message(`休息完成，开始第${currentCycle.value + 1}个番茄钟`, {
        type: "success"
      });
      isBreak.value = false;
      currentCycle.value++;
      startTimer();
    } else {
      message(`所有番茄钟完成！`, { type: "success" });
      remainingTime.value = 0;
      isCompleted.value = true;

      const isHighMood = desktopPetStore.moodValue >= 60;
      (window as any).ipcRenderer.send("play-timer-end-animation", isHighMood);
    }
  } else if (valueType.value === "倒计时") {
    const countdownSeconds =
      timeValue1.value.getHours() * 3600 +
      timeValue1.value.getMinutes() * 60 +
      timeValue1.value.getSeconds();
    await updateFocusTimeToBackend(countdownSeconds);
    message(`计时完成！`, { type: "success" });
    remainingTime.value = 0;
    isCompleted.value = true;
  } else {
    message(`计时完成！`, { type: "success" });
    remainingTime.value = 0;
    isCompleted.value = true;
  }
};

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div class="timer-container">
    <div class="timer-display">
      <div class="time-text">{{ formatRemainingTime(remainingTime) }}</div>
      <div class="timer-info">
        <span v-if="isCompleted">此次计时已累计</span>
        <span v-if="!isCompleted && valueType === '番茄钟'"
          >第 {{ currentCycle }} 个番茄钟</span
        >
        <span v-if="!isCompleted && valueType === '番茄钟' && isBreak"
          >休息中</span
        >
        <span v-if="!isCompleted && valueType === '番茄钟' && !isBreak"
          >专注中</span
        >
        <span v-if="!isCompleted && valueType === '倒计时'">倒计时</span>
        <span v-if="!isCompleted && valueType === '正计时'">正计时</span>
      </div>
      <div v-if="todoTitle" class="todo-title">
        {{ todoTitle }}
      </div>
    </div>

    <div v-if="!isCompleted" class="timer-controls">
      <el-button
        v-if="valueType === '正计时'"
        type="success"
        @click="completeTimer"
      >
        完成
      </el-button>
      <el-button
        v-if="isRunning || remainingTime > 0"
        type="danger"
        @click="resetTimer"
      >
        放弃
      </el-button>
    </div>

    <div v-if="valueType === '番茄钟'" class="timer-details">
      <div class="detail-item">
        <span>专注时长：</span>
        <span>{{ formatTime(timeValue2) }}</span>
      </div>
      <div class="detail-item">
        <span>休息时长：</span>
        <span>{{ formatTime(timeValue3) }}</span>
      </div>
      <div class="detail-item">
        <span>循环次数：</span>
        <span>{{ timeValue4 }}</span>
      </div>
    </div>

    <div v-if="valueType === '倒计时'" class="timer-details">
      <div class="detail-item">
        <span>倒计时时长：</span>
        <span>{{ formatTime(timeValue1) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

.timer-display {
  text-align: center;
  margin-bottom: 30px;
}

.time-text {
  font-size: 56px;
  font-weight: bold;
  color: #000000;
  font-family: monospace;
}

.timer-info {
  font-size: 16px;
  color: var(--el-text-color-regular);
  margin-top: 8px;
}

.todo-title {
  font-size: 14px;
  color: #909399;
  margin-top: 12px;
  font-weight: 500;
}

.timer-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.timer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.detail-item {
  display: flex;
  gap: 6px;
}
</style>
