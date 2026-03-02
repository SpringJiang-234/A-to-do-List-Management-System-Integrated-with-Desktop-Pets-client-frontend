<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Collapse from "@/views/category/components/Collapse.vue";
import SingleCategory from "@/views/category/components/SingleCategory.vue";

defineOptions({
  name: "Category"
});

const route = useRoute();
const categoryName = computed(() => {
  return (route.meta?.title as string) || "全部";
});

const isAllCategory = computed(() => {
  return route.name === "Category";
});
</script>

<template>
  <div>
    <!-- 将会有动态二级目录
  全部
  未分类
  分类123（包括系统分类和用户分类）
  
  设置中可以设置隐藏系统分类、管理分类（增加、删除、修改）
  添加待办时也可以添加分类-->
    <el-card shadow="never">
      <template #header>
        <span>{{ categoryName }}</span>
      </template>
      <Collapse v-if="isAllCategory" />
      <SingleCategory v-else />
    </el-card>
  </div>
</template>
