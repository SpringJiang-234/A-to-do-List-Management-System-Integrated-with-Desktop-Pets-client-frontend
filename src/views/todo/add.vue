<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { insertTodo } from "@/api/todo";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { message } from "@/utils/message";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import { Close } from "@element-plus/icons-vue";
import Vditor from "./components/Vditor.vue";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";

defineOptions({
  name: "TodoAdd"
});

const router = useRouter();
const desktopPetStore = useDesktopPetStoreHook();

const todoForm = ref({
  title: "",
  content: "",
  categoryId: undefined as number | undefined,
  categoryName: "" as string,
  priority: 1 as number,
  status: 1 as number,
  isTop: 1 as number,
  tagIdList: [] as number[],
  startDate: "",
  endDate: ""
});
const loading = ref(false);
const submitting = ref(false);

const categories = ref<any[]>([]);
const tags = ref<any[]>([]);

const priorities = [
  { value: 1, label: "不重要不紧急" },
  { value: 2, label: "不重要但紧急" },
  { value: 3, label: "重要不紧急" },
  { value: 4, label: "重要且紧急" }
];

const topOptions = [
  { value: 1, label: "未置顶" },
  { value: 2, label: "置顶" }
];

const statusOptions = [
  { value: 1, label: "未完成" },
  { value: 2, label: "完成" },
  { value: 3, label: "放弃" }
];

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
        ...systemTags.map(tag => ({ value: tag.id, label: tag.name, color: tag.color })),
        ...userTags.map(tag => ({ value: tag.id, label: tag.name, color: tag.color }))
      ];
      
      tags.value = allTags;
    }
  } catch (error) {
    console.error("加载标签列表失败:", error);
  }
};

const convertToRgbaWithOpacity = (hexColor: string, opacity: number = 0.3): string => {
  if (!hexColor || !hexColor.startsWith('#')) {
    return hexColor;
  }
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const activeNames = ref<string[]>(["1"]);

const handleCancel = () => {
  router.back();
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
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      message("用户信息不存在，请重新登录", { type: "error" });
      return;
    }
    await insertTodo({
      userId: userInfo.id,
      title: todoForm.value.title,
      content: todoForm.value.content,
      categoryId: todoForm.value.categoryId,
      priority: todoForm.value.priority,
      startDate: todoForm.value.startDate,
      endDate: todoForm.value.endDate,
      isTop: todoForm.value.isTop,
      tagIdList: todoForm.value.tagIdList
    });
    await desktopPetStore.loadDesktopPetInfo();
    message("添加成功", { type: "success" });
    router.back();
  } catch (error) {
    console.error("添加待办失败:", error);
    message("添加失败，请重试", { type: "error" });
  } finally {
    submitting.value = false;
  }
};

loadCategories();
loadTags();
</script>

<template>
  <div class="todo-add-container">
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>添加待办</h3>
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
      </template>
      <div class="detail-content">
        <div class="todo-section">
          <div class="section-title">
            <el-input v-model="todoForm.title" placeholder="请输入待办标题" />
          </div>
          <div class="todo-content">
            <Vditor
              v-model="todoForm.content"
              :options="{
                height: 300,
                placeholder: '请输入待办内容',
                counter: {
                  enable: true
                }
              }"
            />
          </div>
        </div>
        
        <el-collapse v-model="activeNames" class="options-collapse">
          <el-collapse-item title="其他选项" name="1">
            <el-form label-width="100px">
              <el-form-item label="是否置顶">
                <el-switch v-model="todoForm.isTop" :active-value="2" :inactive-value="1" />
              </el-form-item>
              <el-form-item label="类别">
                <el-select v-model="todoForm.categoryId" placeholder="请选择类别" clearable>
                  <el-option
                    v-for="item in categories"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="标签">
                <el-select v-model="todoForm.tagIdList" multiple placeholder="请选择标签">
                  <el-option
                    v-for="item in tags"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <el-tag :style="{ backgroundColor: convertToRgbaWithOpacity(item.color), borderColor: convertToRgbaWithOpacity(item.color), color: '#000000' }">{{ item.label }}</el-tag>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="优先级">
                  <el-select v-model="todoForm.priority" placeholder="请选择优先级">
                    <el-option label="不重要不紧急" :value="1" />
                    <el-option label="不重要但紧急" :value="2" />
                    <el-option label="重要不紧急" :value="3" />
                    <el-option label="重要且紧急" :value="4" />
                  </el-select>
                </el-form-item>
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="todoForm.startDate"
                  type="date"
                  placeholder="选择开始日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="结束日期">
                <el-date-picker
                  v-model="todoForm.endDate"
                  type="date"
                  placeholder="选择结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        
        <div class="button-actions">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.todo-add-container {
  padding: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  padding: 4px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.todo-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--el-border-color);
}

.section-title :deep(.el-input__wrapper) {
  padding: 0;
  box-shadow: none;
}

.section-title :deep(.el-input__inner) {
  border: none;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.6;
}

.section-title :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.section-title :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
}

.todo-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-title :deep(.el-input__wrapper) {
  padding: 0;
  box-shadow: none;
}

.todo-title :deep(.el-input__inner) {
  border: none;
  padding: 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
}

.todo-title :deep(.el-input__wrapper:hover) {
  box-shadow: none;
}

.todo-title :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-bottom: 2px solid var(--el-color-primary);
}

.todo-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-content :deep(.el-textarea__wrapper) {
  padding: 0 !important;
  box-shadow: none !important;
}

.todo-content :deep(.el-textarea__inner) {
  border: 0px !important;
  outline: none !important;
  padding: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.todo-content :deep(.el-textarea__wrapper:hover) {
  box-shadow: none !important;
}

.todo-content :deep(.el-textarea__wrapper.is-focus) {
  box-shadow: none !important;
}

.options-collapse {
  border: none;
  border-radius: 4px;
  overflow: hidden;
}

.options-collapse :deep(.el-collapse-item__header) {
  border-bottom: none;
  font-size: 16px;
  font-weight: 600;
}

.options-collapse :deep(.el-collapse-item__wrap) {
  border: none;
}

.collapse-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.option-label {
  font-weight: 500;
  color: var(--el-text-color-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.option-value {
  flex: 1;
}

.button-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}
</style>
