<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "DayView"
});

const value = ref("");
const { lastBuildTime } = __APP_INFO__;
const activities = [
  {
    content: "支持默认颜色测试测试测试",
    timestamp: lastBuildTime
  },
  {
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    color: "#F56C6C"
  }
];
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <span class="font-medium">待办-日视图</span>
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            size="default"
          />
        </div>
      </div>
    </template>
    <div class="flex">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :color="activity.color"
          :timestamp="activity.timestamp"
        >
          <!-- 这里增加链接，点击即可跳到待办详情页，activity.content展示待办的标题
          上几行的timestamp展示待办的时间 -->
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.message {
  position: relative;
  box-sizing: border-box;
  width: 200px;
  padding: 5px 12px;
  line-height: 18px;
  color: #fff;
  word-break: break-all;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  border-radius: 6px;
}
.message::after {
  position: absolute;
  top: 8px;
  left: -10px;
  width: 0;
  height: 0;
  overflow: hidden;
  content: "";
  border-color: var(--el-color-primary) transparent transparent;
  border-style: solid dashed dashed;
  border-width: 10px;
}
</style>
