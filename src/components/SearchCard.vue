<script lang="ts" setup>
import { reactive, computed } from "vue";
import Select from "@/components/Select.vue";
import IconamoonSearchLight from "~icons/iconamoon/search-light";
import HeroiconsArrowPath from "~icons/heroicons/arrow-path";
import { useTodoStoreHook } from "@/store/modules/todo";

interface Props {
  showTimeViewButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTimeViewButton: true
});

const todoStore = useTodoStoreHook();

const handleTimeRuleChange = (value: string) => {
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
    timeRule: value
  });
};

const resetForm = () => {
  formInline.title = "";
  formInline.content = "";
  formInline.categories = [];
  formInline.tags = [];
  formInline.priorities = [];
  formInline.isContinuous = [];
  formInline.time = "";
  formInline.startTime = "";
  formInline.endTime = "";
  formInline.status = [];
  formInline.isTop = [];
};

const formInline = reactive({
  title: "",
  content: "",
  categories: [],
  tags: [],
  priorities: [],
  isContinuous: [],
  time: "",
  startTime: "",
  endTime: "",
  status: [],
  isTop: []
});

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

const priorities = [
  {
    value: "4",
    label: "重要且紧急"
  },
  {
    value: "3",
    label: "重要不紧急"
  },
  {
    value: "2",
    label: "不重要但紧急"
  },
  {
    value: "1",
    label: "不重要不紧急"
  }
];

const continuousOptions = [
  {
    value: "1",
    label: "是"
  },
  {
    value: "2",
    label: "否"
  }
];

const statusOptions = [
  {
    value: "1",
    label: "未完成"
  },
  {
    value: "2",
    label: "已完成"
  }
];

const topOptions = [
  {
    value: "1",
    label: "置顶"
  },
  {
    value: "2",
    label: "不置顶"
  }
];

const timeRules = [
  {
    value: "0",
    label: "列表"
  },
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

const isContinuousTask = computed(() => {
  return formInline.isContinuous.includes("1");
});

const isNonContinuousTask = computed(() => {
  return formInline.isContinuous.includes("2");
});

const onSubmit = () => {
  console.log(formInline);
};
</script>

<template>
  <el-card shadow="never">
    <el-collapse expand-icon-position="left">
      <el-collapse-item title="搜索筛选待办">
        <template #default>
          <el-collapse>
            <el-collapse-item title="文本搜索" name="text">
              <template #default>
                <el-form
                  :inline="true"
                  :model="formInline"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-input
                      v-model="formInline.title"
                      placeholder="请输入标题"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-input
                      v-model="formInline.content"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-collapse-item>
            <el-collapse-item title="筛选条件" name="filter">
              <template #default>
                <el-form
                  :inline="true"
                  :model="formInline"
                  class="demo-form-inline"
                >
                  <el-form-item v-if="showTimeViewButton">
                    <Select
                      :model-value="todoStore.filter.timeRule"
                      :options="timeRules"
                      :multiple="false"
                      placeholder="请选择视图"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                      @update:model-value="handleTimeRuleChange"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.categories"
                      :options="categories"
                      placeholder="请选择类别"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.tags"
                      :options="tags"
                      placeholder="请选择标签"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.priorities"
                      :options="priorities"
                      placeholder="请选择优先级"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.isContinuous"
                      :options="continuousOptions"
                      placeholder="请选择是否为连续任务"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                  <el-form-item v-if="isNonContinuousTask">
                    <el-date-picker
                      v-model="formInline.time"
                      type="date"
                      placeholder="请选择非连续任务的日期"
                    />
                  </el-form-item>
                  <el-form-item v-if="isContinuousTask">
                    <el-date-picker
                      v-model="formInline.startTime"
                      type="date"
                      placeholder="请选择连续任务的开始日期"
                    />
                  </el-form-item>
                  <el-form-item v-if="isContinuousTask">
                    <el-date-picker
                      v-model="formInline.endTime"
                      type="date"
                      placeholder="请选择连续任务的结束日期"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.status"
                      :options="statusOptions"
                      placeholder="请选择状态"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                  <el-form-item>
                    <Select
                      v-model="formInline.isTop"
                      :options="topOptions"
                      placeholder="请选择是否置顶"
                      all-text="全选"
                      :max-collapse-tags="1"
                      width="240px"
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-collapse-item>
            <el-collapse-item title="操作" name="action">
              <template #default>
                <el-form
                  :inline="true"
                  :model="formInline"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-tooltip
                      content="重置除时间视图外的条件"
                      placement="top"
                      effect="light"
                    >
                      <el-button
                        :icon="HeroiconsArrowPath"
                        circle
                        type="primary"
                        @click="resetForm"
                      />
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      :icon="IconamoonSearchLight"
                      circle
                      type="primary"
                      @click="onSubmit"
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
