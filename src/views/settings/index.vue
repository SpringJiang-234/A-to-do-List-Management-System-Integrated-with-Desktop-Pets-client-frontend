<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { router, constantRoutes } from "@/router";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { emitter } from "@/utils/mitt";
import { VueDraggable } from "vue-draggable-plus";
import {
  getCategoryList,
  insertCategory,
  updateCategory,
  deleteCategory
} from "@/api/category";
import { getTagList, insertTag, updateTag, deleteTag } from "@/api/tag";
import { getToken } from "@/utils/auth";
import { ElMessage, ElMessageBox } from "element-plus";
defineOptions({
  name: "Settings"
});

const valueCategory = ref(localStorage.getItem("valueCategory") !== "false");
const valueTag = ref(localStorage.getItem("valueTag") !== "false");
const valuePriority = ref(localStorage.getItem("valuePriority") !== "false");
const valueStartTimer = ref(
  localStorage.getItem("valueStartTimer") !== "false"
);
const valueReport = ref(localStorage.getItem("valueReport") !== "false");
const valueAnnouncement = ref(
  localStorage.getItem("valueAnnouncement") !== "false"
);
const valueFeedback = ref(localStorage.getItem("valueFeedback") !== "false");
const valueCompleted = ref(localStorage.getItem("valueCompleted") === "true");
const defaultView = ref(localStorage.getItem("defaultView") || "0");

const showWork = ref(localStorage.getItem("showWork") !== "false");
const showStudy = ref(localStorage.getItem("showStudy") !== "false");
const showEntertainment = ref(
  localStorage.getItem("showEntertainment") !== "false"
);

const categoryList = ref<any[]>([]);
const tagList = ref<any[]>([]);
const newCategoryName = ref("");
const newTagName = ref("");
const newTagColor = ref("rgba(64, 158, 255, 0.3)");

const userId = ref<number>(0);

onMounted(() => {
  const userInfo = getToken();
  if (userInfo) {
    userId.value = userInfo.id;
    loadCategories();
    loadTags();
  }
});

async function loadCategories() {
  try {
    const res = await getCategoryList(userId.value);
    if (res.code === 200) {
      categoryList.value = (res.data || []).sort(
        (a, b) => b.sortOrder - a.sortOrder
      );
    }
  } catch (error) {
    console.error("加载分类失败:", error);
  }
}

async function loadTags() {
  try {
    const res = await getTagList(userId.value);
    if (res.code === 200) {
      tagList.value = (res.data || []).sort(
        (a, b) => b.sortOrder - a.sortOrder
      );
    }
  } catch (error) {
    console.error("加载标签失败:", error);
  }
}

async function onCategoryUpdate() {
  try {
    const total = categoryList.value.length;
    for (let i = 0; i < total; i++) {
      const category = categoryList.value[i];
      const newSortOrder = total - i;
      if (category.sortOrder !== newSortOrder) {
        category.sortOrder = newSortOrder;
        await updateCategory({
          id: category.id,
          name: category.name,
          sortOrder: category.sortOrder
        });
      }
    }
    ElMessage.success("分类排序更新成功");
    window.location.reload();
  } catch (error) {
    console.error("更新分类排序失败:", error);
    ElMessage.error("更新分类排序失败");
    loadCategories();
  }
}

async function onTagUpdate() {
  try {
    const total = tagList.value.length;
    for (let i = 0; i < total; i++) {
      const tag = tagList.value[i];
      const newSortOrder = total - i;
      if (tag.sortOrder !== newSortOrder) {
        tag.sortOrder = newSortOrder;
        await updateTag({
          id: tag.id,
          name: tag.name,
          color: convertRgbaToHex(tag.color),
          sortOrder: tag.sortOrder
        });
      }
    }
    ElMessage.success("标签排序更新成功");
    window.location.reload();
  } catch (error) {
    console.error("更新标签排序失败:", error);
    ElMessage.error("更新标签排序失败");
    loadTags();
  }
}

async function addCategory() {
  if (!newCategoryName.value.trim()) {
    ElMessage.warning("请输入分类名称");
    return;
  }
  try {
    const maxSortOrder =
      categoryList.value.length > 0 ? categoryList.value[0].sortOrder + 1 : 1;
    const res = await insertCategory({
      name: newCategoryName.value.trim(),
      sortOrder: maxSortOrder
    });
    if (res.code === 200) {
      ElMessage.success("添加分类成功");
      newCategoryName.value = "";
      window.location.reload();
    } else {
      ElMessage.error(res.msg || "添加分类失败");
    }
  } catch (error) {
    console.error("添加分类失败:", error);
    ElMessage.error("添加分类失败");
  }
}

async function deleteCategoryItem(category: any) {
  if (category.isDefault === 1) {
    ElMessage.warning("系统默认分类不允许删除");
    return;
  }
  try {
    await ElMessageBox.confirm(
      "确定要删除这个分类吗？删除后，该分类下的待办事项将归入未分类。",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    const res = await deleteCategory(category.id);
    if (res.code === 200) {
      ElMessage.success("删除分类成功");
      window.location.reload();
    } else {
      ElMessage.error(res.msg || "删除分类失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除分类失败:", error);
      ElMessage.error("删除分类失败");
    }
  }
}

async function addTag() {
  if (!newTagName.value.trim()) {
    ElMessage.warning("请输入标签名称");
    return;
  }
  try {
    const maxSortOrder =
      tagList.value.length > 0 ? tagList.value[0].sortOrder + 1 : 1;
    const res = await insertTag({
      name: newTagName.value.trim(),
      color: convertRgbaToHex(newTagColor.value),
      sortOrder: maxSortOrder
    });
    if (res.code === 200) {
      ElMessage.success("添加标签成功");
      newTagName.value = "";
      window.location.reload();
    } else {
      ElMessage.error(res.msg || "添加标签失败");
    }
  } catch (error) {
    console.error("添加标签失败:", error);
    ElMessage.error("添加标签失败");
  }
}

async function deleteTagItem(tag: any) {
  try {
    await ElMessageBox.confirm("确定要删除这个标签吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    const res = await deleteTag(tag.id);
    if (res.code === 200) {
      ElMessage.success("删除标签成功");
      window.location.reload();
    } else {
      ElMessage.error(res.msg || "删除标签失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除标签失败:", error);
      ElMessage.error("删除标签失败");
    }
  }
}

function convertToRgbaWithOpacity(
  hexColor: string,
  opacity: number = 0.3
): string {
  if (!hexColor || !hexColor.startsWith("#")) {
    return hexColor;
  }

  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function convertRgbaToHex(rgbaColor: string): string {
  if (!rgbaColor) {
    return "#409EFF";
  }

  if (rgbaColor.startsWith("#")) {
    return rgbaColor;
  }

  const rgbaMatch = rgbaColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (!rgbaMatch) {
    return "#409EFF";
  }

  const r = parseInt(rgbaMatch[1]);
  const g = parseInt(rgbaMatch[2]);
  const b = parseInt(rgbaMatch[3]);

  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function updateRouteShowLink() {
  const settings = {
    category: localStorage.getItem("valueCategory") !== "false",
    tag: localStorage.getItem("valueTag") !== "false",
    priority: localStorage.getItem("valuePriority") !== "false",
    soonstart: localStorage.getItem("valueStartTimer") !== "false",
    report: localStorage.getItem("valueReport") !== "false",
    announcement: localStorage.getItem("valueAnnouncement") !== "false",
    feedback: localStorage.getItem("valueFeedback") !== "false"
  };

  const categorySettings = {
    work: localStorage.getItem("showWork") !== "false",
    study: localStorage.getItem("showStudy") !== "false",
    entertainment: localStorage.getItem("showEntertainment") !== "false"
  };

  function updateRoutes(routes: any[]) {
    routes.forEach(route => {
      if (route.path === "/category") {
        route.meta.showLink = settings.category;
      } else if (route.path === "/tag") {
        route.meta.showLink = settings.tag;
      } else if (route.path === "/priority") {
        route.meta.showLink = settings.priority;
      } else if (route.path === "/soonstart") {
        route.meta.showLink = settings.soonstart;
      } else if (route.path === "/report") {
        route.meta.showLink = settings.report;
      } else if (route.path === "/announcement") {
        route.meta.showLink = settings.announcement;
      } else if (route.path === "/feedback") {
        route.meta.showLink = settings.feedback;
      }

      if (route.children) {
        updateRoutes(route.children);
      }
    });
  }

  function updateCategoryRoutes(routes: any[]) {
    routes.forEach(route => {
      if (route.path === "/category" && route.children) {
        route.children.forEach((child: any) => {
          if (child.meta && child.meta.title) {
            const title = child.meta.title;
            if (title === "工作") {
              child.meta.showLink = categorySettings.work;
            } else if (title === "学习") {
              child.meta.showLink = categorySettings.study;
            } else if (title === "娱乐") {
              child.meta.showLink = categorySettings.entertainment;
            }
          }
        });
      }

      if (route.children) {
        updateCategoryRoutes(route.children);
      }
    });
  }

  const permissionStore = usePermissionStoreHook();

  updateRoutes(permissionStore.constantMenus as any[]);
  updateRoutes(router.options.routes as any[]);

  updateCategoryRoutes(permissionStore.constantMenus as any[]);
  updateCategoryRoutes(router.options.routes as any[]);

  permissionStore.handleWholeMenus([]);

  const wholeMenus = permissionStore.wholeMenus;
  updateRoutes(wholeMenus as any[]);
  updateCategoryRoutes(wholeMenus as any[]);

  emitter.emit("menuChange", true);
}

watch(valueCategory, newVal => {
  localStorage.setItem("valueCategory", String(newVal));
  updateRouteShowLink();
});
watch(valueTag, newVal => {
  localStorage.setItem("valueTag", String(newVal));
  updateRouteShowLink();
});
watch(valuePriority, newVal => {
  localStorage.setItem("valuePriority", String(newVal));
  updateRouteShowLink();
});
watch(valueStartTimer, newVal => {
  localStorage.setItem("valueStartTimer", String(newVal));
  updateRouteShowLink();
});
watch(valueReport, newVal => {
  localStorage.setItem("valueReport", String(newVal));
  updateRouteShowLink();
});
watch(valueAnnouncement, newVal => {
  localStorage.setItem("valueAnnouncement", String(newVal));
  updateRouteShowLink();
});
watch(valueFeedback, newVal => {
  localStorage.setItem("valueFeedback", String(newVal));
  updateRouteShowLink();
});
watch(valueCompleted, newVal => {
  console.log("========== 设置：valueCompleted 变化 ==========", newVal);
  localStorage.setItem("valueCompleted", String(newVal));
  if (newVal) {
    localStorage.setItem("searchStatus", "[]");
  } else {
    localStorage.setItem("searchStatus", '["1"]');
  }
  console.log(
    "========== 触发 searchSettingsChanged 事件 ==========",
    newVal ? "[]" : '["1"]'
  );
  window.dispatchEvent(
    new CustomEvent("searchSettingsChanged", {
      detail: { type: "status", value: newVal ? "[]" : '["1"]' }
    })
  );
});
watch(defaultView, newVal => {
  localStorage.setItem("defaultView", String(newVal));
  localStorage.setItem("searchTime", String(newVal));
  window.dispatchEvent(
    new CustomEvent("searchSettingsChanged", {
      detail: { type: "time", value: String(newVal) }
    })
  );
});

watch(showWork, newVal => {
  localStorage.setItem("showWork", String(newVal));
  updateRouteShowLink();
});
watch(showStudy, newVal => {
  localStorage.setItem("showStudy", String(newVal));
  updateRouteShowLink();
});
watch(showEntertainment, newVal => {
  localStorage.setItem("showEntertainment", String(newVal));
  updateRouteShowLink();
});
</script>

<template>
  <div class="settings-container">
    <div>临时区域</div>
    <!-- 细节看一下思考笔记 -->
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>菜单设置</h4>
          </div>
        </div>
      </template>
      <div class="switch-container">
        <el-switch
          v-model="valueCategory"
          class="mb-2"
          active-text="显示分类"
          inactive-text="隐藏分类"
        />
        <el-switch
          v-model="valueTag"
          class="mb-2"
          active-text="显示标签"
          inactive-text="隐藏标签"
        />
        <el-switch
          v-model="valuePriority"
          class="mb-2"
          active-text="显示优先级"
          inactive-text="隐藏优先级"
        />
        <el-switch
          v-model="valueStartTimer"
          class="mb-2"
          active-text="显示开始计时"
          inactive-text="隐藏开始计时"
        />
        <el-switch
          v-model="valueReport"
          class="mb-2"
          active-text="显示报表"
          inactive-text="隐藏报表"
        />
        <el-switch
          v-model="valueAnnouncement"
          class="mb-2"
          active-text="显示公告"
          inactive-text="隐藏公告"
        />
        <el-switch
          v-model="valueFeedback"
          class="mb-2"
          active-text="显示反馈"
          inactive-text="隐藏反馈"
        />
      </div>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>桌宠设置</h4>
          </div>
        </div>
      </template>
      <!-- 
      桌宠模式（单选）：标准、mini、隐藏
  1. 标准模式（标准、弹对话框、有语音或提示音）
  2. mini模式（mini、通知、有语音或提示音）
  3. 隐藏模式（隐藏、有语音或提示音）
  4. 自定义模式（全自定义） -->
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>提醒设置</h4>
          </div>
        </div>
      </template>
      <!-- - 提示方式（多选）：弹对话框、通知、语音或提示音（如果桌宠选4则亮起，否则灰色不可动）-->
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>待办设置</h4>
          </div>
        </div>
      </template>
      <div class="select-container">
        <span class="select-label">默认视图：</span>
        <el-select
          v-model="defaultView"
          placeholder="请选择默认视图"
          style="width: 200px"
        >
          <el-option label="列表视图" value="0" />
          <el-option label="日视图" value="1" />
          <el-option label="周视图" value="2" />
          <el-option label="月视图" value="3" />
        </el-select>
      </div>
      <div class="switch-container">
        <el-switch
          v-model="valueCompleted"
          class="mb-2"
          active-text="显示已完成待办"
          inactive-text="隐藏已完成待办"
        />
      </div>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>分类设置</h4>
          </div>
        </div>
      </template>
      <div class="category-settings">
        <div class="system-category-management">
          <h5>系统分类管理</h5>
          <div class="switch-container">
            <el-switch
              v-model="showWork"
              class="mb-2"
              active-text="显示工作"
              inactive-text="隐藏工作"
            />
            <el-switch
              v-model="showStudy"
              class="mb-2"
              active-text="显示学习"
              inactive-text="隐藏学习"
            />
            <el-switch
              v-model="showEntertainment"
              class="mb-2"
              active-text="显示娱乐"
              inactive-text="隐藏娱乐"
            />
          </div>
        </div>
        <div class="add-category">
          <el-input
            v-model="newCategoryName"
            placeholder="请输入分类名称"
            style="width: 200px; margin-right: 10px"
            @keyup.enter="addCategory"
          />
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </div>
        <VueDraggable
          v-model="categoryList"
          :animation="150"
          ghost-class="ghost"
          class="category-list"
          @update="onCategoryUpdate"
        >
          <div
            v-for="category in categoryList"
            :key="category.id"
            class="category-item"
          >
            <div class="category-content">
              <span class="drag-handle">⋮⋮</span>
              <span class="category-name">{{ category.name }}</span>
              <span v-if="category.isDefault === 1" class="default-tag"
                >默认</span
              >
            </div>
            <el-button
              v-if="category.isDefault !== 1"
              type="danger"
              size="small"
              text
              @click="deleteCategoryItem(category)"
            >
              删除
            </el-button>
          </div>
        </VueDraggable>
      </div>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <h4>标签设置</h4>
          </div>
        </div>
      </template>
      <div class="tag-settings">
        <div class="add-tag">
          <el-input
            v-model="newTagName"
            placeholder="请输入标签名称"
            style="width: 200px; margin-right: 10px"
            @keyup.enter="addTag"
          />
          <el-color-picker v-model="newTagColor" :alpha="0.3" />
          <el-button type="primary" style="margin-left: 10px" @click="addTag"
            >添加标签</el-button
          >
        </div>
        <VueDraggable
          v-model="tagList"
          :animation="150"
          ghost-class="ghost"
          class="tag-list"
          @update="onTagUpdate"
        >
          <div v-for="tag in tagList" :key="tag.id" class="tag-item">
            <div class="tag-content">
              <span class="drag-handle">⋮⋮</span>
              <el-tag
                :style="{
                  backgroundColor: convertToRgbaWithOpacity(tag.color),
                  borderColor: convertToRgbaWithOpacity(tag.color),
                  color: '#000000'
                }"
                >{{ tag.name }}</el-tag
              >
            </div>
            <el-button
              type="danger"
              size="small"
              text
              @click="deleteTagItem(tag)"
            >
              删除
            </el-button>
          </div>
        </VueDraggable>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.settings-container :deep(.el-card) {
  margin-bottom: 20px;
}

.switch-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.switch-container :deep(.el-switch) {
  margin-right: 20px;
}

.select-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-label {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.category-settings,
.tag-settings {
  padding: 10px 0;
}

.system-category-management {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.system-category-management h5 {
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.system-category-management .switch-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.system-category-management .switch-container :deep(.el-switch) {
  margin-right: 20px;
}

.add-category,
.add-tag {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.category-list,
.tag-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item,
.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: all 0.3s;
}

.category-item:hover,
.tag-item:hover {
  background-color: #e6f7ff;
}

.category-content,
.tag-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.drag-handle {
  cursor: move;
  color: #909399;
  font-size: 16px;
  user-select: none;
}

.category-name {
  font-size: 14px;
  color: #303133;
}

.default-tag {
  font-size: 12px;
  padding: 2px 8px;
  background-color: #67c23a;
  color: white;
  border-radius: 4px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
