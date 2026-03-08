<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import TodoList from "@/components/TodoList.vue";

interface Activity {
    id: number;
    title: string;
    content: string;
    timestamp: string;
    startTime?: string;
    endTime?: string;
    status: number;
    priority?: number;
    color?: string;
}

interface Props {
    originalTodoList: any[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "refresh"): void;
}>();

const router = useRouter();

const activities = computed(() => {
    return props.originalTodoList.map(todo => ({
        id: todo.id,
        title: todo.title,
        content: todo.content,
        timestamp: todo.startTime || todo.createTime || "",
        startTime: todo.startTime,
        endTime: todo.endTime,
        status: todo.status,
        priority: todo.priority,
        color: undefined
    }));
});

function handleTodoClick(activity: Activity) {
    console.log("待办项被点击:", activity);
    
    const todo = props.originalTodoList.find(t => t.id === activity.id);
    if (todo) {
        todo.status = activity.status;
    }
}

function handleTextClick(activity: Activity) {
    router.push(`/todo/detail/${activity.id}`);
}

function handleRefresh() {
    console.log("========== ListView 刷新 ==========");
    emit("refresh");
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
            @refresh="handleRefresh"
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
