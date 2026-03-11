<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getTagList } from "@/api/tag";
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

interface Tag {
  id: number;
  name: string;
}

interface TagTodos {
  tagId: number;
  tagName: string;
  activities: Activity[];
  originalTodoList: any[];
}

defineOptions({
  name: "TagCollapse"
});

const router = useRouter();

const tags = ref<Tag[]>([]);
const tagTodosMap = ref<Map<number, TagTodos>>(new Map());
const loading = ref(false);

const tagTodosList = computed(() => {
  return Array.from(tagTodosMap.value.values());
});

const loadTags = async () => {
  try {
    loading.value = true;
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载标签");
      return;
    }

    const systemResponse = await getTagList(0);
    const userResponse = await getTagList(userInfo.id);

    const systemTags = systemResponse.code === 200 ? systemResponse.data : [];
    const userTags = userResponse.code === 200 ? userResponse.data : [];

    tags.value = [...systemTags, ...userTags];

    for (const tag of tags.value) {
      await loadTagTodos(tag.id, tag.name);
    }
  } catch (error) {
    console.error("加载标签列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const loadTagTodos = async (tagId: number, tagName: string) => {
  try {
    const valueCompleted = localStorage.getItem('valueCompleted') !== 'false';
    const params: any = {
      tagIdList: [tagId]
    };
    
    if (!valueCompleted) {
      params.statusList = [1];
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

    tagTodosMap.value.set(tagId, {
      tagId,
      tagName,
      activities,
      originalTodoList
    });
  } catch (error) {
    console.error(`加载标签 ${tagName} 的待办失败:`, error);
  }
};

function handleTodoClick(tagId: number, activity: Activity) {
  console.log("待办项被点击:", activity);
  
  const tagTodos = tagTodosMap.value.get(tagId);
  if (tagTodos) {
    const todo = tagTodos.originalTodoList.find(t => t.id === activity.id);
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
  if (event.detail?.type === 'status') {
    loadTags();
  }
};

onMounted(() => {
  loadTags();
  window.addEventListener('searchSettingsChanged', handleSearchSettingsChanged);
});

onUnmounted(() => {
  window.removeEventListener('searchSettingsChanged', handleSearchSettingsChanged);
});
</script>

<template>
  <div v-loading="loading">
    <el-collapse expand-icon-position="left">
      <el-collapse-item
        v-for="tagTodos in tagTodosList"
        :key="tagTodos.tagId"
        :title="tagTodos.tagName"
        :name="tagTodos.tagId"
      >
        <TodoList
          :activities="tagTodos.activities"
          :originalTodoList="tagTodos.originalTodoList"
          @click="(activity: Activity) => handleTodoClick(tagTodos.tagId, activity)"
          @textClick="handleTextClick"
          @refresh="() => loadTagTodos(tagTodos.tagId, tagTodos.tagName)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
