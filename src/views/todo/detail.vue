<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTodoDetails, updateTodo } from "@/api/todo";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { message } from "@/utils/message";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import { Close } from "@element-plus/icons-vue";

defineOptions({
  name: "TodoDetail"
});

const route = useRoute();
const router = useRouter();

const todoId = ref<number>(0);
const todoForm = ref({
  id: 0,
  userId: 0,
  title: "",
  content: "",
  categoryId: undefined as number | undefined,
  categoryName: "" as string,
  priority: 1 as number,
  status: 1 as number,
  isTop: 1 as number,
  tagIdList: [] as number[],
  startTime: "",
  endTime: ""
});
const loading = ref(false);
const submitting = ref(false);
const isEditMode = ref(false);

const categories = ref<any[]>([]);
const tags = ref<any[]>([]);

const statusText = computed(() => {
  if (!todoForm.value) return "";
  return todoForm.value.status === 1 
    ? "未完成" 
    : todoForm.value.status === 2 
    ? "已完成" 
    : "已放弃";
});

const priorityText = computed(() => {
  if (!todoForm.value) return "";
  return todoForm.value.priority === 1 
    ? "不重要不紧急" 
    : todoForm.value.priority === 2 
    ? "不重要但紧急" 
    : todoForm.value.priority === 3 
    ? "重要不紧急" 
    : "重要且紧急";
});

const isTopText = computed(() => {
  if (!todoForm.value) return "";
  return todoForm.value.isTop === 1 ? "是" : "否";
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

const loadCategories = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (userInfo?.id) {
      const systemResponse = await getCategoryList(0);
      const userResponse = await getCategoryList(userInfo.id);
      
      const systemCategories = systemResponse.code === 200 ? systemResponse.data : [];
      const userCategories = userResponse.code === 200 ? userResponse.data : [];
      
      const allCategories = [
        ...systemCategories.map(cat => ({ value: cat.id, label: cat.name })),
        ...userCategories.map(cat => ({ value: cat.id, label: cat.name }))
      ];
      
      categories.value = allCategories;
    }
  } catch (error) {
    console.error("加载类别列表失败:", error);
  }
};

const loadTags = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (userInfo?.id) {
      const systemResponse = await getTagList(0);
      const userResponse = await getTagList(userInfo.id);
      
      const systemTags = systemResponse.code === 200 ? systemResponse.data : [];
      const userTags = userResponse.code === 200 ? userResponse.data : [];
      
      const allTags = [
        ...systemTags.map(tag => ({ value: tag.id, label: tag.name })),
        ...userTags.map(tag => ({ value: tag.id, label: tag.name }))
      ];
      
      tags.value = allTags;
    }
  } catch (error) {
    console.error("加载标签列表失败:", error);
  }
};

const fetchTodoDetails = async () => {
  if (!todoId.value || todoId.value === 0) {
    console.warn("待办 ID 无效，跳过获取详情");
    return;
  }
  
  try {
    loading.value = true;
    const response = await getTodoDetails(todoId.value);
    const data = response.data;
    todoForm.value = {
      id: data.id,
      userId: data.userId,
      title: data.title,
      content: data.content,
      categoryId: undefined,
      categoryName: data.categoryName || "",
      priority: data.priority || 1,
      status: parseInt(data.status) || 1,
      isTop: parseInt(data.isTop) || 1,
      tagIdList: data.tags ? data.tags.map((tag: any) => tag.id) : [],
      startTime: formatDateTime(data.startTime),
      endTime: formatDateTime(data.endTime)
    };
    
    await loadCategories();
    await loadTags();
    
    const category = categories.value.find(cat => cat.label === data.categoryName);
    if (category) {
      todoForm.value.categoryId = category.value;
    }
  } catch (error) {
    console.error("获取待办详情失败:", error);
    message("获取待办详情失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  isEditMode.value = false;
  fetchTodoDetails();
};

const handleClose = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!todoForm.value.title.trim()) {
    message("请输入待办标题", { type: "warning" });
    return;
  }

  try {
    submitting.value = true;
    await updateTodo(todoForm.value);
    message("修改成功", { type: "success" });
    router.back();
  } catch (error) {
    console.error("修改待办失败:", error);
    message("修改失败，请重试", { type: "error" });
  } finally {
    submitting.value = false;
  }
};

watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId);
    if (id && !isNaN(id)) {
      todoId.value = id;
      isEditMode.value = route.query.edit === 'true';
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
        <div class="header-content">
          <div>待办详情</div>
          <div class="header-actions">
            <el-switch 
              v-model="isEditMode" 
              active-text="可修改" 
              inactive-text="只读"
              @change="isEditMode ? loadCategories() : null"
            />
            <el-button 
              type="primary" 
              circle 
              size="small" 
              @click="handleClose"
              class="close-button"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <el-empty v-if="!todoId" description="待办 ID 无效，请从待办列表点击查看详情" />
      <div v-else v-loading="loading">
        <el-form v-if="todoForm.id !== 0" label-width="100px">
          <el-form-item label="标题">
            <el-input v-if="isEditMode" v-model="todoForm.title" placeholder="请输入待办标题" />
            <el-input v-else :value="todoForm.title" readonly />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-if="isEditMode" v-model="todoForm.content" type="textarea" placeholder="请输入待办内容" />
            <el-input v-else :value="todoForm.content" type="textarea" readonly />
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-if="isEditMode" v-model="todoForm.categoryId" placeholder="请选择类别" clearable>
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-else :value="todoForm.categoryName" readonly />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-if="isEditMode"
              v-model="todoForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <el-input v-else :value="formatDateTime(todoForm.startTime)" readonly />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-if="isEditMode"
              v-model="todoForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <el-input v-else :value="formatDateTime(todoForm.endTime)" readonly />
          </el-form-item>
          <el-form-item label="优先级">
            <el-select v-if="isEditMode" v-model="todoForm.priority" placeholder="请选择优先级">
              <el-option label="不重要不紧急" :value="1" />
              <el-option label="不重要但紧急" :value="2" />
              <el-option label="重要不紧急" :value="3" />
              <el-option label="重要且紧急" :value="4" />
            </el-select>
            <el-input v-else :value="priorityText" readonly />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-if="isEditMode" v-model="todoForm.status" placeholder="请选择状态">
              <el-option label="未完成" :value="1" />
              <el-option label="完成" :value="2" />
              <el-option label="放弃" :value="3" />
            </el-select>
            <el-input v-else :value="statusText" readonly />
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-switch v-if="isEditMode" v-model="todoForm.isTop" :active-value="2" :inactive-value="1" />
            <el-input v-else :value="isTopText" readonly />
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-if="isEditMode" v-model="todoForm.tagIdList" multiple placeholder="请选择标签">
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div v-else-if="todoForm.tagIdList && todoForm.tagIdList.length > 0" class="tags-container">
              <el-tag 
                v-for="tag in tags.filter(t => todoForm.tagIdList.includes(t.value))" 
                :key="tag.value"
                class="tag-item"
              >
                {{ tag.label }}
              </el-tag>
            </div>
            <el-input v-else value="无标签" readonly />
          </el-form-item>
          <el-form-item v-if="isEditMode">
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
              确定
            </el-button>
            <el-button @click="handleCancel">
              取消
            </el-button>
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.close-button {
  padding: 4px;
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
