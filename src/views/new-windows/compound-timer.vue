<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";

defineOptions({
  name: "CompoundTimer"
});

const route = useRoute();

const valueType = ref(route.query.valueType as string || "番茄钟");
const timeValue1 = ref(route.query.timeValue1 ? new Date(route.query.timeValue1 as string) : new Date("1970-01-01T02:00:00"));
const timeValue2 = ref(route.query.timeValue2 ? new Date(route.query.timeValue2 as string) : new Date("1970-01-01T00:25:00"));
const timeValue3 = ref(route.query.timeValue3 ? new Date(route.query.timeValue3 as string) : new Date("1970-01-01T00:05:00"));
const timeValue4 = ref(route.query.timeValue4 ? parseInt(route.query.timeValue4 as string) : 4);

const formatTime = (timeValue: string | Date): string => {
  if (!timeValue) return "0小时0分钟";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}小时${minutes}分钟`;
};

const formatTimeForDisplay = (timeValue: string | Date): string => {
  if (!timeValue) return "00:00:00";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const remainingTime = ref(0);
const isRunning = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);
const currentCycle = ref(1);
const isBreak = ref(false);

onMounted(() => {
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
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const startTimer = () => {
  if (isRunning.value) return;
  
  isRunning.value = true;
  isBreak.value = false;
  
  let targetSeconds = 0;
  
  if (valueType.value === "倒计时" && timeValue1.value) {
    const date = timeValue1.value;
    targetSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  } else if (valueType.value === "番茄钟" && timeValue2.value) {
    const date = timeValue2.value;
    targetSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  } else if (valueType.value === "番茄钟" && isBreak.value && timeValue3.value) {
    const date = timeValue3.value;
    targetSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }
  
  if (targetSeconds > 0) {
    remainingTime.value = targetSeconds;
    
    timer.value = setInterval(() => {
      if (remainingTime.value > 0) {
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
};

const resetTimer = () => {
  stopTimer();
  remainingTime.value = 0;
  currentCycle.value = 1;
  isBreak.value = false;
};

const handleTimerComplete = () => {
  stopTimer();
  
  if (valueType.value === "番茄钟" && !isBreak.value && timeValue4.value && timeValue4.value > 1) {
    if (currentCycle.value < timeValue4.value) {
      message(`第${currentCycle.value}个番茄钟完成，开始休息`, { type: "success" });
      isBreak.value = true;
      currentCycle.value++;
      startTimer();
    } else {
      message(`所有番茄钟完成！`, { type: "success" });
    }
  } else if (valueType.value === "番茄钟" && isBreak.value) {
    message(`休息完成，开始第${currentCycle.value}个番茄钟`, { type: "success" });
    isBreak.value = false;
    startTimer();
  } else {
    message(`计时完成！`, { type: "success" });
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
        <span v-if="valueType === '番茄钟'">第 {{ currentCycle }} 个番茄钟</span>
        <span v-if="valueType === '番茄钟' && isBreak">休息中</span>
        <span v-if="valueType === '番茄钟' && !isBreak">专注中</span>
        <span v-if="valueType === '倒计时'">倒计时</span>
        <span v-if="valueType === '正计时'">正计时</span>
      </div>
    </div>
    
    <div class="timer-controls">
      <el-button v-if="!isRunning" type="primary" @click="startTimer">
        开始
      </el-button>
      <el-button v-if="isRunning" type="warning" @click="stopTimer">
        暂停
      </el-button>
      <el-button v-if="isRunning || remainingTime > 0" type="danger" @click="resetTimer">
        重置
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
