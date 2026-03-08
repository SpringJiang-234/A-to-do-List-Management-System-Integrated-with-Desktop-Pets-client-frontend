<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getCategoryList } from "@/api/category";
import { getTodoList } from "@/api/todo";
import TodoList from "@/components/TodoList.vue";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
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

    const systemCategories = systemResponse.code === 200 ? systemResponse.data : [];
    const userCategories = userResponse.code === 200 ? userResponse.data : [];

    categories.value = [...systemCategories, ...userCategories];

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
    const response = await getTodoList({
      categoryId: categoryId
    });
    const originalTodoList = response.data || [];

    const activities = originalTodoList.map(todo => ({
      id: todo.id,
      title: todo.title,
      content: todo.content,
      timestamp: todo.startTime || "",
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

onMounted(() => {
  loadCategories();
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
          @click="(activity: Activity) => handleTodoClick(categoryTodos.categoryId, activity)"
          @textClick="handleTextClick"
          @refresh="() => loadCategoryTodos(categoryTodos.categoryId, categoryTodos.categoryName)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
