<script setup lang="ts">
import { computed } from "vue";
import TodoList from "@/components/TodoList.vue";

interface Activity {
    id: number;
    title: string;
    content: string;
    timestamp: string;
    status: number;
    color?: string;
}

interface Props {
    originalTodoList: any[];
}

const props = defineProps<Props>();

const activities = computed(() => {
    return props.originalTodoList.map(todo => ({
        id: todo.id,
        title: todo.title,
        content: todo.content,
        timestamp: todo.startTime || todo.createTime || "",
        status: todo.status,
        color: undefined
    }));
});

function handleTodoClick(activity: Activity) {
    console.log("待办项被点击:", activity);
    
    const todo = props.originalTodoList.find(t => t.id === activity.id);
    if (todo) {
        todo.status = todo.status === 2 ? 1 : 2;
    }
}

function handleTextClick(activity: Activity) {
    console.log("文字被点击:", activity);
}
</script>

<template>
    <el-card shadow="never">
        <template #header>
            <div class="card-header">
                <div class="header-content">
                    <h3>待办</h3>
                    <span style="
              font-size: 14px;
              font-weight: 400;
              color: var(--el-text-color-secondary);
            ">列表视图</span>
                </div>
            </div>
        </template>
        <TodoList 
            :activities="activities" 
            @click="handleTodoClick"
            @textClick="handleTextClick"
        />
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}

.header-content {
    display: flex;
    align-items: flex-end;
    width: 100%;
}
</style>
