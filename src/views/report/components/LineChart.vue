<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getSeriesColor } from "./color";

const props = defineProps<{
  xAxisData: string[];
  series: Array<{ name: string; data: number[] }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: props.xAxisData },
  yAxis: { type: "value" },
  series: props.series.map((s, seriesIndex) => ({
    name: s.name,
    type: "line",
    data: s.data,
    smooth: true,
    itemStyle: {
      color: getSeriesColor("light", seriesIndex)
    },
    lineStyle: {
      color: getSeriesColor("light", seriesIndex)
    }
  })),
  grid: { containLabel: true }
}));
</script>