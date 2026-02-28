<template>
  <div class="select-container">
    <Select
      v-model="selectedCategories"
      :options="categories"
      placeholder="请选择分类"
      all-text="全选"
      :max-collapse-tags="1"
      width="240px"
    />
    <Select
      v-model="selectedTags"
      :options="tags"
      placeholder="请选择标签"
      all-text="全选"
      :max-collapse-tags="1"
      width="240px"
    />
    <Select
      v-model="selectedTimeRule"
      :options="timeRules"
      :multiple="false"
      placeholder="请选择视图"
      all-text="全选"
      :max-collapse-tags="1"
      width="240px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/Select.vue";

defineOptions({
  name: "Select"
});

const selectedCategories = ref<string[]>([]);
const categories = [
  {
    value: "1",
    label: "学习"
  },
  {
    value: "2",
    label: "工作"
  },
  {
    value: "3",
    label: "生活"
  },
  {
    value: "4",
    label: "娱乐"
  },
  {
    value: "5",
    label: "健康"
  }
];

const selectedTags = ref<string[]>([]);
const tags = [
  {
    value: "1",
    label: "重要"
  },
  {
    value: "2",
    label: "紧急"
  },
  {
    value: "3",
    label: "待处理"
  },
  {
    value: "4",
    label: "已完成"
  },
  {
    value: "5",
    label: "已归档"
  }
];

const selectedTimeRule = ref<string[]>([]);
const timeRules = [
  {
    value: "1",
    label: "日视图"
  },
  {
    value: "2",
    label: "周视图"
  },
  {
    value: "3",
    label: "月视图"
  },
  {
    value: "4",
    label: "年视图"
  }
];
</script>

<style scoped>
.select-container {
  display: flex;
  gap: 16px;
}
</style>
