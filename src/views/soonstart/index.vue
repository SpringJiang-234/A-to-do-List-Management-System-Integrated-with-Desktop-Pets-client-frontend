<script setup lang="ts">
import { message } from "@/utils/message";
import Countdown from "@/views/soonstart/components/CountDown.vue";
import { ref } from "vue";
import SearchCard from "@/components/SearchCard.vue";
import GameIconsTomato from "~icons/game-icons/tomato?width=16px&height=16px";
import StreamlineSharpResetClockSolid from "~icons/streamline-sharp/reset-clock-solid?width=16px&height=16px";
import MeteorIconsClockRotate from "~icons/meteor-icons/clock-rotate?width=16px&height=16px";

defineOptions({
  name: "Soonstart"
});

const valueType = ref("番茄钟"); //选择计时方式:番茄钟、正计时、倒计时
const timeValue1 = ref(new Date("1970-01-01T02:00:00")); //倒计时时长
const timeValue2 = ref(new Date("1970-01-01T00:25:00")); //专注时长
const timeValue3 = ref(new Date("1970-01-01T00:05:00")); //休息时长
const timeValue4 = ref(4); //循环次数

const formatTime = (timeValue: string | Date): string => {
  if (!timeValue) return "0小时0分钟";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}小时${minutes}分钟`;
};

const handleConfirm = () => {
  if (valueType.value === "倒计时") {
    message(`倒计时时长：${formatTime(timeValue1.value)}`);
  } else if (valueType.value === "番茄钟") {
    message(
      `专注时长：${formatTime(timeValue2.value)}，休息时长：${formatTime(timeValue3.value)}，循环次数：${timeValue4.value}`
    );
  }
};

const handleIconClick = (type: string) => {
  valueType.value = type;
  message(`已选择：${type}`);
};

const options = [
  {
    value: "番茄钟",
    label: "番茄钟"
  },
  {
    value: "正计时",
    label: "正计时"
  },
  {
    value: "倒计时",
    label: "倒计时"
  }
];
</script>

<template>
  <div class="soonstart-container">
    <el-card shadow="never">
      <h1>快速开始番茄钟、正计时或倒计时</h1>
      <!-- 要实现可能需要todo加一个计时字段 -->
      <!-- 根据选择的计时类型弹出新的窗口用于计时 -->
      <div class="icon-container">
        <GameIconsTomato
          width="64"
          height="64"
          @click="handleIconClick('番茄钟')"
        />
        <StreamlineSharpResetClockSolid
          width="64"
          height="64"
          @click="handleIconClick('正计时')"
        />
        <MeteorIconsClockRotate
          width="64"
          height="64"
          @click="handleIconClick('倒计时')"
        />
      </div>
    </el-card>
    <SearchCard :show-time-view-button="false" />
    <!-- 直接放待办卡片 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <span class="font-medium">选择计时方式</span>
          </div>
        </div>
      </template>
      <el-select
        v-model="valueType"
        placeholder="选择计时方式"
        style="width: 220px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="time-pickers">
        <!-- 如果是正计时，只需要按钮开始 -->
        <div v-if="valueType === '正计时'">
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>

        <div v-if="valueType === '倒计时'" class="time-picker-wrapper">
          <span class="font-small">倒计时时长：</span>
          <el-time-picker v-model="timeValue1" placeholder="选择时长" />
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>

        <div v-if="valueType === '番茄钟'" class="time-pickers-wrapper">
          <span class="font-small">专注时长：</span>
          <el-time-picker v-model="timeValue2" placeholder="专注时长" />
          <span class="font-small">休息时长：</span>
          <el-time-picker v-model="timeValue3" placeholder="休息时长" />
          <div class="font-small">循环次数：</div>
          <el-input-number v-model="timeValue4" placeholder="循环次数" />
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.soonstart-container :deep(.el-card) {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.icon-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.large-icon {
  font-size: 64px !important;
  width: 64px;
  height: 64px;
}

.date-picker-wrapper {
  margin-right: 20px;
}

.time-pickers {
  margin-top: 20px;
}

.time-picker-wrapper,
.time-pickers-wrapper {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.font-small {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}
</style>
