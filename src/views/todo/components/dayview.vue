<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";

defineOptions({
  name: "DayView"
});

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

const value = ref("");
const { lastBuildTime } = __APP_INFO__;
const activities = ref<Activity[]>([
  {
    title: "支持默认颜色测试测试测试",
    content: "支持默认颜色测试测试测试",
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "支持自定义颜色",
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    isCompleted: false,
    color: "#F56C6C"
  },
  {
    title: "支持自定义颜色",
    content: "支持自定义颜色",
    timestamp: lastBuildTime,
    isCompleted: false,
    color: "#66CCFF"
  }
]);

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const selectedActivityIndex = ref<number | null>(null);

/** 点击事件 */
function handleClick(activity: Activity) {
  activity.isCompleted = !activity.isCompleted;
  message(`点击了待办：${activity.content}`);
}

/** 点击文字内容事件 */
function handleTextClick(activity: Activity) {
  message(`点击了文字：${activity.content}`);
}

/** 右键点击事件 */
function handleRightClick(event: MouseEvent, index: number) {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  selectedActivityIndex.value = index;
  contextMenuVisible.value = true;
}

/** 菜单操作处理 */
function handleMenuAction(action: string) {
  contextMenuVisible.value = false;
  const index = selectedActivityIndex.value;

  if (index === null) return;

  switch (action) {
    case "add":
      message("新增待办");
      break;
    case "edit":
      message(`修改待办：${activities.value[index].title},${index}`);
      break;
    case "delete":
      message(`删除待办：${activities.value[index].title},${index}`);
      break;
  }

  selectedActivityIndex.value = null;
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <h3>待办-日视图</h3>
        </div>
        <el-date-picker
          v-model="value"
          type="date"
          placeholder="选择日期"
          size="default"
        />
      </div>
    </template>
    <div class="flex">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          :hollow="!activity.isCompleted"
          :color="activity.color"
          @click="handleClick(activity)"
          @contextmenu.prevent="handleRightClick($event, index)"
        >
          <!-- 使用 dot 插槽完全自定义节点，仅当 isCompleted 为 false 时生效 -->
          <template #dot v-if="!activity.isCompleted">
            <div
              class="custom-node"
              :style="{
                borderColor: activity.color
              }"
            ></div>
          </template>
          <!-- 只有点击标题才跳到详细页 -->
          <span class="todo-text" @click.stop="handleTextClick(activity)">
            {{ activity.title }}
          </span>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 右键菜单 -->
    <el-popover
      v-model:visible="contextMenuVisible"
      placement="bottom-start"
      width="160"
      :popper-style="{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        position: 'absolute'
      }"
    >
      <div class="flex flex-col items-center">
        <div
          @click="handleMenuAction('add')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          新增待办
        </div>
        <div
          @click="handleMenuAction('edit')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          修改待办
        </div>
        <div
          @click="handleMenuAction('delete')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          删除待办
        </div>
      </div>
    </el-popover>
  </el-card>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.custom-node {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--el-color-info-light-7);
  background-color: white;
  cursor: pointer;
}

.todo-text {
  cursor: pointer;
}
</style>
