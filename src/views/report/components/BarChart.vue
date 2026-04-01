<template>
  <BaseChart :options="chartOptions" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseChart from "./BaseChart.vue";
import type { ECOption } from "@/utils/echarts";
import { getSeriesColor } from "./color";

const props = defineProps<{
  data: Array<Record<string, any>>;
  title?: string;
  width?: string;
  height?: string;
}>();

const chartOptions = computed<ECOption>(() => {
  if (!props.data || props.data.length === 0) {
    return {
      title: props.title ? { text: props.title, left: "center" } : undefined,
      graphic: {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "暂无数据",
          fontSize: 16,
          fill: "#999"
        }
      }
    };
  }

  // 获取所有类别名称（排除 category 和 value 字段）
  const categoryNames = new Set<string>();
  props.data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== "category" && key !== "value") {
        categoryNames.add(key);
      }
    });
  });

  const categories = Array.from(categoryNames);

  return {
    title: props.title ? { text: props.title, left: "center" } : undefined,
    tooltip: { trigger: "axis" },
    legend: {
      data: categories,
      bottom: 0
    },
    xAxis: {
      type: "category",
      data: props.data.map(item => item.category)
    },
    yAxis: { type: "value" },
    series: categories.map((category, index) => ({
      name: category,
      type: "bar",
      data: props.data.map(item => item[category] || 0),
      itemStyle: {
        color: getSeriesColor("light", index)
      }
    })),
    grid: { containLabel: true, bottom: 60 }
  };
});
</script>