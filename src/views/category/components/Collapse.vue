<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getCategoryList } from "@/api/category";
import { getTodoListByCategoryOrTag } from "@/api/todo";
import TodoList from "@/components/TodoList.vue";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  startDate?: string;
  endDate?: string;
  status: number;
  priority?: number;
  color?: string;
}

interface Category {
  id: number;
  name: string;
}

interface CategoryTodos {
  categoryId: number;
  categoryName: string;
  activities: Activity[];
  originalTodoList: any[];
}

defineOptions({
  name: "CategoryCollapse"
});

const router = useRouter();

const categories = ref<Category[]>([]);
const categoryTodosMap = ref<Map<number, CategoryTodos>>(new Map());
const loading = ref(false);

const categoryTodosList = computed(() => {
  return Array.from(categoryTodosMap.value.values());
});

const loadCategories = async () => {
  try {
    loading.value = true;
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载分类");
      return;
    }

    const systemResponse = await getCategoryList(0);
    const userResponse = await getCategoryList(userInfo.id);

    const systemCategories =
      systemResponse.code === 200 ? systemResponse.data : [];
    const userCategories = userResponse.code === 200 ? userResponse.data : [];

    const showWork = localStorage.getItem("showWork") !== "false";
    const showStudy = localStorage.getItem("showStudy") !== "false";
    const showEntertainment =
      localStorage.getItem("showEntertainment") !== "false";

    const allCategories = [...systemCategories, ...userCategories].filter(
      cat => {
        if (cat.name === "工作") {
          return showWork;
        } else if (cat.name === "学习") {
          return showStudy;
        } else if (cat.name === "娱乐") {
          return showEntertainment;
        }
        return true;
      }
    );

    categories.value = allCategories;

    for (const category of categories.value) {
      await loadCategoryTodos(category.id, category.name);
    }
  } catch (error) {
    console.error("加载分类列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const loadCategoryTodos = async (categoryId: number, categoryName: string) => {
  try {
    const valueCompleted = localStorage.getItem("valueCompleted") !== "false";
    console.log(
      `========== 加载分类 ${categoryName} 的待办，valueCompleted: ${valueCompleted} ==========`
    );
    const params: any = {
      categoryIdList: [categoryId]
    };

    if (!valueCompleted) {
      params.statusList = [1];
      console.log(
        "========== 添加 statusList: [1] 只查询未完成待办 =========="
      );
    } else {
      console.log("========== 不添加 statusList，查询所有待办 ==========");
    }

    const response = await getTodoListByCategoryOrTag(params);
    const originalTodoList = response.data || [];

    const activities = originalTodoList.map(todo => ({
      id: todo.id,
      title: todo.title,
      content: todo.content,
      timestamp: todo.startDate || "",
      startDate: todo.startDate,
      endDate: todo.endDate,
      status: todo.status,
      priority: todo.priority,
      color: undefined
    }));

    categoryTodosMap.value.set(categoryId, {
      categoryId,
      categoryName,
      activities,
      originalTodoList
    });
  } catch (error) {
    console.error(`加载分类 ${categoryName} 的待办失败:`, error);
  }
};

function handleTodoClick(categoryId: number, activity: Activity) {
  console.log("待办项被点击:", activity);

  const categoryTodos = categoryTodosMap.value.get(categoryId);
  if (categoryTodos) {
    const todo = categoryTodos.originalTodoList.find(t => t.id === activity.id);
    if (todo) {
      todo.status = activity.status;
    }
  }
}

function handleTextClick(activity: Activity) {
  console.log("文字被点击:", activity);
  router.push(`/todo/detail/${activity.id}`);
}

const handleSearchSettingsChanged = (event: any) => {
  console.log(
    "========== Collapse 收到 searchSettingsChanged 事件 ==========",
    event
  );
  if (event.detail?.type === "status") {
    console.log("========== 重新加载分类待办 ==========");
    loadCategories();
  }
};

onMounted(() => {
  console.log("========== Collapse 组件已挂载，添加事件监听 ==========");
  loadCategories();
  window.addEventListener("searchSettingsChanged", handleSearchSettingsChanged);
});

onUnmounted(() => {
  console.log("========== Collapse 组件卸载，移除事件监听 ==========");
  window.removeEventListener(
    "searchSettingsChanged",
    handleSearchSettingsChanged
  );
});
</script>

<template>
  <div v-loading="loading">
    <el-collapse expand-icon-position="left">
      <el-collapse-item
        v-for="categoryTodos in categoryTodosList"
        :key="categoryTodos.categoryId"
        :title="categoryTodos.categoryName"
        :name="categoryTodos.categoryId"
      >
        <TodoList
          :activities="categoryTodos.activities"
          :originalTodoList="categoryTodos.originalTodoList"
          @click="
            (activity: Activity) =>
              handleTodoClick(categoryTodos.categoryId, activity)
          "
          @textClick="handleTextClick"
          @refresh="
            () =>
              loadCategoryTodos(
                categoryTodos.categoryId,
                categoryTodos.categoryName
              )
          "
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
