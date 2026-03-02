<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import TodoList from "@/components/TodoList.vue";

defineOptions({
  name: "WeekView"
});

interface Activity {
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
  color?: string;
}

const value = ref("");

const tableData = [
  {
    sunday: ["完成周报", "团队会议"],
    monday: ["项目评审", "代码审查"],
    tuesday: ["需求分析"],
    wednesday: ["开发任务", "测试"],
    thursday: ["文档编写"],
    friday: ["部署上线", "总结"],
    saturday: ["学习新技术"]
  }
];

function handleClickTodo(todo: string) {
  message(`点击了待办：${todo}`);
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <div class="header-content">
          <span class="font-medium">待办-周视图</span>
          <el-date-picker
            v-model="value"
            type="week"
            format="[Week] ww"
            placeholder="选择周"
          />
        </div>
      </div>
    </template>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="sunday" label="周日" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.sunday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="monday" label="周一" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.monday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tuesday" label="周二" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.tuesday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="wednesday" label="周三" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.wednesday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thursday" label="周四" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.thursday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="friday" label="周五" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.friday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="saturday" label="周六" min-width="14.2%">
        <template #default="{ row }">
          <div
            v-for="(item, index) in row.saturday"
            :key="index"
            class="todo-item"
            @click="() => handleClickTodo(item)"
          >
            {{ item }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

:deep(.el-table .cell) {
  text-align: left;
  vertical-align: top;
}

:deep(.el-table td.el-table__cell) {
  vertical-align: top;
}

.todo-item {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  padding: 2px 4px;
  margin: 2px 0;
  background-color: var(--el-color-primary-light-9);
  border-radius: 2px;
  cursor: pointer;
}
</style>
