<template>
  <el-date-picker
    v-model="value"
    type="date"
    placeholder="Pick a day"
    size="default"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref("");
</script>
