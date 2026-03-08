<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getTodoDetails } from "@/api/todo";

defineOptions({
  name: "TodoDetail"
});

const route = useRoute();
const todoId = ref<number>(0);
const todoDetails = ref<any>(null);
const loading = ref(false);

const fetchTodoDetails = async () => {
  if (!todoId.value || todoId.value === 0) {
    console.warn("待办 ID 无效，跳过获取详情");
    return;
  }
  
  try {
    loading.value = true;
    const response = await getTodoDetails(todoId.value);
    todoDetails.value = response.data;
  } catch (error) {
    console.error("获取待办详情失败:", error);
  } finally {
    loading.value = false;
  }
};

const statusText = computed(() => {
  if (!todoDetails.value) return "";
  return todoDetails.value.status === "1" 
    ? "未完成" 
    : todoDetails.value.status === "2" 
    ? "已完成" 
    : "已放弃";
});

const priorityText = computed(() => {
  if (!todoDetails.value) return "";
  return todoDetails.value.priority === 1 
    ? "非常低" 
    : todoDetails.value.priority === 2 
    ? "低" 
    : todoDetails.value.priority === 3 
    ? "中" 
    : "高";
});

const isTopText = computed(() => {
  if (!todoDetails.value) return "";
  return todoDetails.value.isTop === "1" ? "是" : "否";
});

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId);
    if (id && !isNaN(id)) {
      todoId.value = id;
      fetchTodoDetails();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="todo-detail-container">
    <el-card shadow="never">
      <template #header>
        <div>待办详情</div>
      </template>
      <el-empty v-if="!todoId" description="待办 ID 无效，请从待办列表点击查看详情" />
      <div v-else v-loading="loading">
        <el-form v-if="todoDetails" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="todoDetails.title" readonly />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="todoDetails.content" type="textarea" readonly />
          </el-form-item>
          <el-form-item label="类别">
            <el-input v-model="todoDetails.categoryName" readonly />
          </el-form-item>
          <el-form-item label="优先级">
            <el-input :value="priorityText" readonly />
          </el-form-item>
          <el-form-item label="状态">
            <el-input :value="statusText" readonly />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-input :value="formatDateTime(todoDetails.startTime)" readonly />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-input :value="formatDateTime(todoDetails.endTime)" readonly />
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-input :value="isTopText" readonly />
          </el-form-item>
          <el-form-item label="标签" v-if="todoDetails.tags && todoDetails.tags.length > 0">
            <div class="tags-container">
              <el-tag 
                v-for="tag in todoDetails.tags" 
                :key="tag.id"
                :color="tag.color"
                class="tag-item"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
        <el-empty v-else-if="!loading" description="未找到待办详情" />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.todo-detail-container {
  padding: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  margin: 0;
}
</style>
