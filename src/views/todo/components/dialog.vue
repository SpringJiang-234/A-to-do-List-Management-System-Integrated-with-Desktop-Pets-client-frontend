<script setup lang="tsx">
import { message } from "@/utils/message";
import forms, { type FormProps } from "./form.vue";
import { addDialog } from "@/components/ReDialog";
import Setting from "~icons/ri/settings-3-line";
import { useTodoStoreHook } from "@/store/modules/todo";

defineOptions({
  name: "DialogPage"
});

const todoStore = useTodoStoreHook();

// 结合Form表单（第一种方式，弹框关闭立刻恢复初始值）通过 props 属性接收子组件的 prop 并赋值
function onFormOneClick() {
  addDialog({
    width: "30%",
    title: "筛选待办",
    contentRenderer: () => forms,
    props: {
      // 赋默认值
      formInline: {
        categories: todoStore.filter.categories,
        tags: todoStore.filter.tags,
        timeRule: todoStore.filter.timeRule
      }
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as FormProps;
      const text = `类别：${formInline.categories} 标签：${formInline.tags} 视图：${formInline.timeRule}`;
      if (args?.command === "cancel") {
        // 您点击了取消按钮
        message(`您点击了取消按钮，当前表单数据为 ${text}`);
      } else if (args?.command === "sure") {
        // 保存筛选条件到 store
        todoStore.setFilter({
          categories: formInline.categories,
          tags: formInline.tags,
          timeRule: formInline.timeRule
        });
        message(`您点击了确定按钮，当前表单数据为 ${text}`);
      } else {
        message(
          `您点击了右上角关闭按钮或空白页或按下了esc键，当前表单数据为 ${text}`
        );
      }
    }
  });
}
</script>

<template>
  <el-button :icon="Setting" @click="onFormOneClick" circle> </el-button>
</template>
