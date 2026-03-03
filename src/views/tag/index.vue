<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Collapse from "@/views/tag/components/Collapse.vue";
import SingleTag from "@/views/tag/components/SingleTag.vue";

defineOptions({
  name: "Tag"
});

const route = useRoute();
const tagName = computed(() => {
  return (route.meta?.title as string) || "全部";
});

const isAllTag = computed(() => {
  return route.name === "Tag";
});
</script>

<template>
  <div>
    <!-- 将会有动态二级目录
  全部
  标签123
  
  全部中使用折叠面板展示每个标签
  设置中可以设置隐藏系统标签、管理标签（增加、删除、修改）
  添加待办时也可以添加标签-->
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>{{ tagName }}</h3>
        </div>
      </template>
      <Collapse v-if="isAllTag" />
      <SingleTag v-else />
    </el-card>
  </div>
</template>
