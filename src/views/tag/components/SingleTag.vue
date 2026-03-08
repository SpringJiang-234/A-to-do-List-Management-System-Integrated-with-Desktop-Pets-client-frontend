<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTodoList } from "@/api/todo";
import TodoList from "@/components/TodoList.vue";

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  status: number;
  color?: string;
}

defineOptions({
  name: "SingleTag"
});

const route = useRoute();
const router = useRouter();

const originalTodoList = ref<any[]>([]);
const loading = ref(false);

const tagId = computed(() => {
  return (route.meta?.tagId as number) || 0;
});

const activities = computed(() => {
  return originalTodoList.value.map(todo => ({
    id: todo.id,
    title: todo.title,
    content: todo.content,
    timestamp: todo.startTime || todo.createTime || "",
    status: todo.status,
    color: undefined
  }));
});

const loadTodoList = async () => {
  if (!tagId.value) {
    console.warn("标签 ID 无效，跳过加载待办列表");
    return;
  }

  try {
    loading.value = true;
    const response = await getTodoList({
      tagIdList: [tagId.value]
    });
    originalTodoList.value = response.data || [];
  } catch (error) {
    console.error("加载待办列表失败:", error);
  } finally {
    loading.value = false;
  }
};

function handleTodoClick(activity: Activity) {
  console.log("待办项被点击:", activity);
  
  const todo = originalTodoList.value.find(t => t.id === activity.id);
  if (todo) {
    todo.status = activity.status;
  }
}

function handleTextClick(activity: Activity) {
  console.log("文字被点击:", activity);
  router.push(`/todo/detail/${activity.id}`);
}

watch(
  () => route.meta?.tagId,
  (newTagId) => {
    const id = Number(newTagId);
    if (id && !isNaN(id)) {
      loadTodoList();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-loading="loading">
    <TodoList 
      :activities="activities" 
      :originalTodoList="originalTodoList"
      @click="handleTodoClick"
      @textClick="handleTextClick"
      @refresh="loadTodoList"
    />
  </div>
</template>
