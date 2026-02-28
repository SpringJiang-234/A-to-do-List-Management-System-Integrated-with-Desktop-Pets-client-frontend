<script setup lang="ts">
import Select from "@/views/todo/components/select.vue";
import DialogPage from "@/views/todo/components/dialog.vue";

defineOptions({
  name: "Todo"
});
</script>

<template>
  <Select />
  <DialogPage />
</template>
