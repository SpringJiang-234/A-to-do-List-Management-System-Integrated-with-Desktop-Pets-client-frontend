<script setup lang="ts">
import DialogPage from "@/views/todo/components/dialog.vue";
import Search from "@/views/todo/components/search.vue";

defineOptions({
  name: "Todo"
});
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
