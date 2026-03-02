<script setup lang="tsx">
import { message } from "@/utils/message";
import forms, { type FormProps } from "./Form.vue";
import { addDialog } from "@/components/ReDialog";
import MingcuteTimeLine from "~icons/mingcute/time-line?width=16px&height=16px";
import { useTodoStoreHook } from "@/store/modules/todo";

defineOptions({
  name: "DialogPage"
});

const todoStore = useTodoStoreHook();

// 结合Form表单（第一种方式，弹框关闭立刻恢复初始值）通过 props 属性接收子组件的 prop 并赋值
function onFormOneClick() {
  addDialog({
    width: "30%",
    title: "时间视图",
    contentRenderer: () => forms,
    props: {
      formInline: {
        timeRule: todoStore.filter.timeRule
      }
    },
    closeCallBack: ({ options, args }) => {
      const { formInline } = options.props as FormProps;
      const text = `视图：${formInline.timeRule}`;
      if (args?.command === "cancel") {
        message(`您点击了取消按钮，当前表单数据为 ${text}`);
      } else if (args?.command === "sure") {
        todoStore.setFilter({
          title: todoStore.filter.title,
          content: todoStore.filter.content,
          categories: todoStore.filter.categories,
          tags: todoStore.filter.tags,
          priorities: todoStore.filter.priorities,
          isContinuous: todoStore.filter.isContinuous,
          time: todoStore.filter.time,
          startTime: todoStore.filter.startTime,
          endTime: todoStore.filter.endTime,
          status: todoStore.filter.status,
          isTop: todoStore.filter.isTop,
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
  <el-button :icon="MingcuteTimeLine" @click="onFormOneClick" circle>
  </el-button>
</template>
