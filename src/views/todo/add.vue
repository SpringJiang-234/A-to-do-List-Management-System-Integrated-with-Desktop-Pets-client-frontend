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

defineOptions({
  name: "TodoAdd"
});

const router = useRouter();

const todoForm = ref({
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

const categories = ref<any[]>([]);
const tags = ref<any[]>([]);

const priorities = [
  { value: 1, label: "非常低" },
  { value: 2, label: "低" },
  { value: 3, label: "中" },
  { value: 4, label: "高" }
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
        ...systemTags.map(tag => ({ value: tag.id, label: tag.name })),
        ...userTags.map(tag => ({ value: tag.id, label: tag.name }))
      ];
      
      tags.value = allTags;
    }
  } catch (error) {
    console.error("加载标签列表失败:", error);
  }
};

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
      startTime: todoForm.value.startTime,
      endTime: todoForm.value.endTime,
      isTop: todoForm.value.isTop,
      tagIdList: todoForm.value.tagIdList
    });
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
          <div>添加待办</div>
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
      <el-form label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="todoForm.title" placeholder="请输入待办标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="todoForm.content" type="textarea" placeholder="请输入待办内容" />
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
        <el-form-item label="优先级">
          <el-select v-model="todoForm.priority" placeholder="请选择优先级">
            <el-option label="非常低" :value="1" />
            <el-option label="低" :value="2" />
            <el-option label="中" :value="3" />
            <el-option label="高" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="todoForm.status" placeholder="请选择状态">
            <el-option label="未完成" :value="1" />
            <el-option label="完成" :value="2" />
            <el-option label="放弃" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="todoForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="todoForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="是否置顶">
          <el-switch v-model="todoForm.isTop" :active-value="2" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="todoForm.tagIdList" multiple placeholder="请选择标签">
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
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
</style>
