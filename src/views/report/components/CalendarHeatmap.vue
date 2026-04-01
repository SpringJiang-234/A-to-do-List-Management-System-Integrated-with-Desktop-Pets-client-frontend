<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getHeatmapColors, ThemeType } from "./color";

const props = defineProps<{
  data: Array<[string, number]>;
  range?: [string, string];
  title?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
}>();

const chartOptions = computed<ECOption>(() => {
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const dates = props.data.map(item => item[0]);
  const minDate = dates.length
    ? dates.reduce((a, b) => (a < b ? a : b))
    : yearStart;
  const maxDate = dates.length
    ? dates.reduce((a, b) => (a > b ? a : b))
    : yearEnd;

  const colors = getHeatmapColors("light");

  return {
    title: props.title ? { text: props.title, left: "center" } : undefined,
    tooltip: {
      position: 'top',
      formatter: function (params: any) {
        return `${params.value[0]}<br/>待办数量: ${params.value[1]}`;
      }
    },
    visualMap: {
      min: 0,
      max: Math.max(...props.data.map(item => item[1]), 1),
      calculable: true,
      orient: "horizontal",
      left: "center",
      inRange: {
        color: colors
      }
    },
    calendar: {
      range: props.range || [yearStart, yearEnd],
      cellSize: ["auto", 20],
      top: 60,
      left: 30,
      right: 30,
      bottom: 60
    },
    series: [
      {
        name: props.title || "日历热力图",
        type: "heatmap",
        coordinateSystem: "calendar",
        data: props.data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    backgroundColor: props.backgroundColor
  };
});
</script>