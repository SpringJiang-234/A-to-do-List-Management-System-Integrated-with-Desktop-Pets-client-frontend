<script setup lang="ts">
import DialogPage from "@/views/todo/components/dialog.vue";
import Search from "@/views/todo/components/search.vue";
import { useTodoStoreHook } from "@/store/modules/todo";

defineOptions({
  name: "Todo"
});

const todoStore = useTodoStoreHook();
// 可以在 index 页面中使用 todoStore.filter 来获取 DialogPage 中设置的筛选条件
console.log("筛选条件:", todoStore.filter);
</script>

<template>
  <el-container>
    <el-header>
      <Search />
    </el-header>
    <el-main> </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<style scoped lang="scss"></style>
