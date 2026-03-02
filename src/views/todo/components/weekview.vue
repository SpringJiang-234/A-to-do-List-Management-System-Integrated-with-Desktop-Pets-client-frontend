<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import Segmented, { type OptionsType } from "@/components/ReSegmented";

defineOptions({
  name: "WeekView"
});

// 日期选择器
const value = ref("");

/** 分段控制器选项,block：将宽度调整为父元素宽度 */
const optionsBlock: Array<OptionsType> = [
  {
    label: "周日",
    value: 0
  },
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5
  },
  {
    label: "周六",
    value: 6
  }
];

/** change 事件 */
function onChange({ index, option }) {
  const { label, value } = option;
  message(`当前选中项索引为：${index}，名字为${label}，值为${value}`, {
    type: "success"
  });
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <span class="font-medium">待办-周视图</span>
          <el-date-picker
            v-model="value"
            type="week"
            format="[Week] ww"
            placeholder="选择周"
          />
        </div>
      </div>
    </template>
    <!-- 分段控制器：周一到周日 选择 -->
    <Segmented
      :options="optionsBlock"
      block
      size="default"
      @change="onChange"
    />
    <el-card style="margin-top: 20px" shadow="hover">
      <!-- 放圆点（12×12）、标题、时间和一小行灰色内容 -->
    </el-card>
  </el-card>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
