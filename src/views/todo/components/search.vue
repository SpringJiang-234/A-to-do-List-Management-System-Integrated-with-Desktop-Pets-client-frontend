<script lang="ts" setup>
import { reactive } from "vue";

const resetForm = () => {
  formInline.title = "";
};
import IconamoonSearchLight from "~icons/iconamoon/search-light";
import HeroiconsArrowPath from "~icons/heroicons/arrow-path";
import DialogPage from "@/views/todo/components/Dialog.vue";

const formInline = reactive({
  title: ""
});

const onSubmit = () => {
  console.log(formInline);
};
</script>

<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item>
      <el-input v-model="formInline.title" placeholder="搜索标题" />
    </el-form-item>
    <el-form-item>
      <el-button
        :icon="HeroiconsArrowPath"
        circle
        type="primary"
        @click="resetForm"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        :icon="IconamoonSearchLight"
        circle
        type="primary"
        @click="onSubmit"
      />
    </el-form-item>
    <el-form-item>
      <DialogPage />
    </el-form-item>
  </el-form>
</template>
