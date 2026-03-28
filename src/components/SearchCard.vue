<script lang="ts" setup>
import { reactive, computed, ref, onMounted } from "vue";
import Select from "@/components/Select.vue";
import IconamoonSearchLight from "~icons/iconamoon/search-light";
import HeroiconsArrowPath from "~icons/heroicons/arrow-path";
import { useTodoStoreHook } from "@/store/modules/todo";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { getTodoList } from "@/api/todo";
import { storageLocal } from "@pureadmin/utils";
import { userKey, type DataInfo } from "@/utils/auth";

interface Props {
  showTimeViewButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTimeViewButton: true
});

const todoStore = useTodoStoreHook();

const loading = ref(false);

const categories = ref<any[]>([]);
const tags = ref<any[]>([]);

const loadCategoriesAndTags = async () => {
  try {
    loading.value = true;
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载分类和标签");
      return;
    }

    const systemCategoryResponse = await getCategoryList(0);
    const userCategoryResponse = await getCategoryList(userInfo.id);

    const systemCategories =
      systemCategoryResponse.code === 200 ? systemCategoryResponse.data : [];
    const userCategories =
      userCategoryResponse.code === 200 ? userCategoryResponse.data : [];

    categories.value = [...systemCategories, ...userCategories].map(
      (item: any) => ({
        value: item.id.toString(),
        label: item.name
      })
    );

    const systemTagResponse = await getTagList(0);
    const userTagResponse = await getTagList(userInfo.id);

    const systemTags =
      systemTagResponse.code === 200 ? systemTagResponse.data : [];
    const userTags = userTagResponse.code === 200 ? userTagResponse.data : [];

    tags.value = [...systemTags, ...userTags].map((item: any) => ({
      value: item.id.toString(),
      label: item.name
    }));
  } catch (error) {
    console.error("加载分类和标签失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCategoriesAndTags();

  const valueCompleted = localStorage.getItem("valueCompleted") !== "false";
  const savedTime = localStorage.getItem("searchTime");
  const savedStatus = localStorage.getItem("searchStatus");

  console.log("savedTime:", savedTime);
  console.log("savedStatus:", savedStatus);

  if (savedTime) {
    formInline.time = savedTime;
    todoStore.filter.timeRule = savedTime;
  } else {
    const defaultView = localStorage.getItem("defaultView");
    const time = defaultView || "0";
    formInline.time = time;
    todoStore.filter.timeRule = time;
    console.log("使用默认视图:", time);
  }

  console.log("最终 todoStore.filter.timeRule:", todoStore.filter.timeRule);

  if (savedStatus) {
    try {
      formInline.status = JSON.parse(savedStatus);
    } catch (e) {
      console.error("解析 savedStatus 失败:", e);
    }
  } else if (!valueCompleted) {
    formInline.status = ["1"];
  }

  window.addEventListener("searchSettingsChanged", (e: any) => {
    if (e.detail.type === "time") {
      formInline.time = e.detail.value;
      todoStore.filter.timeRule = e.detail.value;
      console.log("检测到视图设置变化:", e.detail.value);
      onSubmit();
    }
    if (e.detail.type === "status") {
      try {
        formInline.status = JSON.parse(e.detail.value);
        console.log("检测到状态设置变化:", e.detail.value);
        onSubmit();
      } catch (err) {
        console.error("解析 searchStatus 失败:", err);
      }
    }
  });
});

const handleTimeRuleChange = (value: string) => {
  localStorage.setItem("searchTime", value);

  todoStore.setFilter({
    title: todoStore.filter.title,
    content: todoStore.filter.content,
    categories: todoStore.filter.categories,
    tags: todoStore.filter.tags,
    priorities: todoStore.filter.priorities,
    isContinuous: todoStore.filter.isContinuous,
    time: todoStore.filter.time,
    startDate: todoStore.filter.startDate,
    endDate: todoStore.filter.endDate,
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
  formInline.startDate = "";
  formInline.endDate = "";
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
  startDate: "",
  endDate: "",
  status: [],
  isTop: []
});

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
    label: "列表视图"
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

const onSubmit = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过搜索");
      return;
    }

    const params: any = {
      userId: userInfo.id
    };

    if (formInline.title) {
      params.title = formInline.title;
    }

    if (formInline.content) {
      params.content = formInline.content;
    }

    if (
      formInline.categories &&
      formInline.categories.length > 0 &&
      formInline.categories.length < categories.value.length
    ) {
      params.categoryIdList = formInline.categories.map((cat: string) =>
        parseInt(cat)
      );
    }

    if (
      formInline.tags &&
      formInline.tags.length > 0 &&
      formInline.tags.length < tags.value.length
    ) {
      params.tagIdList = formInline.tags.map((tag: string) => parseInt(tag));
    }

    if (
      formInline.priorities &&
      formInline.priorities.length > 0 &&
      formInline.priorities.length < priorities.length
    ) {
      params.priorityList = formInline.priorities.map((prio: string) =>
        parseInt(prio)
      );
    }

    if (formInline.time) {
      params.time = formInline.time;
    }

    if (formInline.startDate) {
      params.startDate = formInline.startDate;
    }

    if (formInline.endDate) {
      params.endDate = formInline.endDate;
    }

    if (
      formInline.status &&
      formInline.status.length > 0 &&
      formInline.status.length < statusOptions.length
    ) {
      params.statusList = formInline.status.map((stat: string) =>
        parseInt(stat)
      );
    }

    if (
      formInline.isTop &&
      formInline.isTop.length > 0 &&
      formInline.isTop.length < topOptions.length
    ) {
      params.isTopList = formInline.isTop.map((top: string) => parseInt(top));
    }

    console.log("搜索参数:", params);

    localStorage.setItem("searchTime", formInline.time || "");
    localStorage.setItem("searchStatus", JSON.stringify(formInline.status));

    const response = await getTodoList(params);

    if (response.code === 200) {
      todoStore.setFilter({
        title: formInline.title,
        content: formInline.content,
        categories: formInline.categories,
        tags: formInline.tags,
        priorities: formInline.priorities,
        isContinuous: formInline.isContinuous,
        time: formInline.time,
        startDate: formInline.startDate,
        endDate: formInline.endDate,
        status: formInline.status,
        isTop: formInline.isTop,
        timeRule: todoStore.filter.timeRule
      });

      console.log("搜索结果:", response.data);
    } else {
      console.error("搜索失败:", response.msg);
    }
  } catch (error) {
    console.error("搜索出错:", error);
  }
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
                      effect="dark"
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
