<script setup lang="tsx">
import { ref } from "vue";
import { message } from "@/utils/message";
import { addDialog, closeDialog } from "@/components/ReDialog";
import MingcuteTimeLine from "~icons/mingcute/time-line?width=16px&height=16px";
import Select from "@/components/Select.vue";
import { useTodoStoreHook } from "@/store/modules/todo";

defineOptions({
  name: "DialogPage"
});

const todoStore = useTodoStoreHook();

const formInline = ref({
  timeRule: todoStore.filter.timeRule
});

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

function onFormOneClick() {
  addDialog({
    plain: false,
    width: "500",
    title: "时间视图",
    footerButtons: [
      {
        label: "取消",
        text: true,
        bg: true,
        btnClick: ({ dialog: { options, index } }) => {
          closeDialog(options, index, { command: "cancel" });
        }
      },
      {
        label: "确定",
        type: "primary",
        btnClick: ({ dialog: { options, index } }) => {
          closeDialog(options, index, { command: "sure" });
        }
      }
    ],
    contentRenderer: () => (
      <el-form model={formInline.value}>
        <el-form-item label="视图">
          <Select
            v-model={formInline.value.timeRule}
            options={timeRules}
            multiple={false}
            placeholder="请选择视图"
            all-text="全选"
            max-collapse-tags={1}
            width="240px"
          />
        </el-form-item>
      </el-form>
    ),
    closeCallBack: ({ args }) => {
      const text = `视图：${formInline.value.timeRule}`;
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
          timeRule: formInline.value.timeRule
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
