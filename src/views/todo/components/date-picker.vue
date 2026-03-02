<template>
  <el-date-picker
    v-model="value"
    type="date"
    placeholder="选择日期"
    size="default"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref("");
</script>
