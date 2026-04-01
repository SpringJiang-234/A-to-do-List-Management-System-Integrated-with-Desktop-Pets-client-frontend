<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getSeriesColor } from "./color";

const props = defineProps<{
  data: Array<{ name: string; value: number }>;
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => ({
  title: props.title ? { text: props.title, left: "center" } : undefined,
  tooltip: { trigger: "item" },
  series: [
    {
      name: props.title || "饼图",
      type: "pie",
      radius: "50%",
      data: props.data.map((item, index) => ({
        ...item,
        itemStyle: {
          color: getSeriesColor("light", index)
        }
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}));
</script>