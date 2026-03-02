<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/Select.vue";

export interface FormProps {
  formInline?: {
    timeRule: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ timeRule: "" })
});

const newFormInline = ref(props.formInline);

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
  }
];
</script>

<template>
  <el-form :model="newFormInline">
    <el-form-item label="视图">
      <Select
        v-model="newFormInline.timeRule"
        :options="timeRules"
        :multiple="false"
        placeholder="请选择视图"
        all-text="全选"
        :max-collapse-tags="1"
        width="240px"
      />
    </el-form-item>
  </el-form>
</template>
