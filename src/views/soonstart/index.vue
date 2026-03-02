<script setup lang="ts">
import { message } from "@/utils/message";
import Countdown from "@/views/soonstart/components/CountDown.vue";
import { ref } from "vue";
import SearchCard from "@/components/SearchCard.vue";

defineOptions({
  name: "Soonstart"
});

const valueTime = ref("");
const valueType = ref("");
const timeValue1 = ref("0");
const timeValue2 = ref("0");
const timeValue3 = ref("0");
const timeValue4 = ref(0);

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
const handleChangeDate = (date: string) => {
  message(`选择的日期是：${date}`);
};
</script>

<template>
  <div>
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
        <div v-if="valueType === '倒计时'" class="time-picker-wrapper">
          <span class="font-small">倒计时时长：</span>
          <el-time-picker v-model="timeValue1" placeholder="选择时长" />
        </div>

        <div v-if="valueType === '番茄钟'" class="time-pickers-wrapper">
          <span class="font-small">专注时长：</span>
          <el-time-picker v-model="timeValue2" placeholder="专注时长" />
          <span class="font-small">休息时长：</span>
          <el-time-picker v-model="timeValue3" placeholder="休息时长" />
          <div class="font-small">循环次数：</div>
          <el-input-number v-model="timeValue4" placeholder="循环次数" />
        </div>
      </div>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <span class="font-medium">选择待办</span>
          </div>
        </div>
      </template>
      <SearchCard :show-time-view-button="false" />
    </el-card>
    <el-card shadow="never">
      <h1>快速开始番茄钟、正计时或倒计时</h1>
      <!-- 要实现可能需要todo加一个计时字段 -->
      <template #header>
        <div class="card-header">
          <div class="header-content"></div>
        </div>
      </template>

      <Countdown />
    </el-card>
  </div>
</template>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
}

.date-picker-wrapper {
  margin-right: 20px;
}

.time-pickers {
  margin-top: 20px;
}

.time-picker-wrapper {
  width: 100%;
}

.time-pickers-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.font-small {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}
</style>
