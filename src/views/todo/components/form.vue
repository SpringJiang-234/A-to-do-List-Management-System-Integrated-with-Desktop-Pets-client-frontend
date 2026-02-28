<script setup lang="ts">
import { ref } from "vue";
import Select from "@/components/Select.vue";

// 声明 props 类型
export interface FormProps {
  formInline?: {
    categories: string[];
    tags: string[];
    timeRule: string;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ categories: [], tags: [], timeRule: "" })
});

// vue 规定所有的 prop 都遵循着单向绑定原则，直接修改 prop 时，Vue 会抛出警告。此处的写法仅仅是为了消除警告。
// 因为对一个 reactive 对象执行 ref，返回 Ref 对象的 value 值仍为传入的 reactive 对象，
// 即 newFormInline === props.formInline 为 true，所以此处代码的实际效果，仍是直接修改 props.formInline。
// 但该写法仅适用于 props.formInline 是一个对象类型的情况，原始类型需抛出事件
// 推荐阅读：https://cn.vuejs.org/guide/components/props.html#one-way-data-flow
const newFormInline = ref(props.formInline);

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

<template>
  <el-form :model="newFormInline">
    <el-form-item label="分类">
      <Select
        v-model="newFormInline.categories"
        :options="categories"
        placeholder="请选择分类"
        all-text="全选"
        :max-collapse-tags="1"
        width="240px"
      />
    </el-form-item>
    <el-form-item label="标签">
      <Select
        v-model="newFormInline.tags"
        :options="tags"
        placeholder="请选择标签"
        all-text="全选"
        :max-collapse-tags="1"
        width="240px"
    /></el-form-item>
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
