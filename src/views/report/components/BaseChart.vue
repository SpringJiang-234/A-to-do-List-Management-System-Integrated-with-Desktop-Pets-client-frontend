<template>
  <div ref="chartRef" :style="{ width, height }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from "vue";
import echarts, { type ECOption } from "@/utils/echarts";

const props = defineProps<{
  options: ECOption; // 图表配置
  width?: string; // 容器宽度，默认 100%
  height?: string; // 容器高度，默认 400px
  theme?: string | object; // 主题，可选
}>();

const chartRef = ref<HTMLElement>();
const chartInstance = shallowRef<echarts.ECharts | null>(null); // 使用 shallowRef 避免深度监听

// 渲染图表
const renderChart = () => {
  if (chartRef.value) {
    if (!chartInstance.value) {
      chartInstance.value = echarts.init(chartRef.value, props.theme);
    }
    chartInstance.value.setOption(props.options, { notMerge: false });
  }
};

// 监听 options 变化（深度监听，但可优化为只监听必要字段）
watch(() => props.options, renderChart, { deep: true });

// 监听容器大小变化
const handleResize = () => {
  chartInstance.value?.resize();
};

onMounted(() => {
  renderChart();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance.value?.dispose();
  chartInstance.value = null;
});
</script>