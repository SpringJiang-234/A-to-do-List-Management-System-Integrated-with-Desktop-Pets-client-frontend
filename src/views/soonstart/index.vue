<script setup lang="ts">
import { message } from "@/utils/message";
import { ref, onMounted } from "vue";
import SearchCard from "@/components/SearchCard.vue";
import GameIconsTomato from "~icons/game-icons/tomato?width=16px&height=16px";
import StreamlineSharpResetClockSolid from "~icons/streamline-sharp/reset-clock-solid?width=16px&height=16px";
import MeteorIconsClockRotate from "~icons/meteor-icons/clock-rotate?width=16px&height=16px";
import { useTodoStore } from "@/store/modules/todo";
import { watch } from "vue";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";

defineOptions({
  name: "Soonstart"
});

const todoStore = useTodoStore();
const todoId = ref<number | null>(null);
const searchResults = ref<any[]>([]);

const loadSearchResults = async () => {
  console.log('loadSearchResults 被调用');
  console.log('todoStore.filter:', todoStore.filter);
  
  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  console.log('userInfo:', userInfo);
  
  if (!userInfo?.id) {
    console.error('用户信息不存在');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:8848/api/todo/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`
      },
      body: JSON.stringify({
        userId: userInfo.id,
        title: todoStore.filter.title,
        content: todoStore.filter.content,
        categoryIdList: todoStore.filter.categories.map((cat: string) => parseInt(cat)),
        tagIdList: todoStore.filter.tags.map((tag: string) => parseInt(tag)),
        priorityList: todoStore.filter.priorities.map((prio: string) => parseInt(prio)),
        statusList: todoStore.filter.status.map((stat: string) => parseInt(stat)),
        isTopList: todoStore.filter.isTop.map((top: string) => parseInt(top))
      })
    });
    const data = await response.json();
    console.log('API 响应:', data);
    if (data.code === 200) {
      searchResults.value = data.data || [];
      console.log('搜索结果:', searchResults.value);
      console.log('searchResults.value.length:', searchResults.value.length);
    } else {
      console.error('API 返回错误:', data.msg);
    }
  } catch (error) {
    console.error('加载搜索结果失败:', error);
  }
};

watch(() => todoStore.filter, () => {
  console.log('todoStore.filter 发生变化');
  searchResults.value = [];
  loadSearchResults();
}, { deep: true });

onMounted(() => {
  console.log('onMounted 被调用');
  loadSearchResults();
});

const valueType = ref("番茄钟"); //选择计时方式:番茄钟、正计时、倒计时
const timeValue1 = ref(new Date("1970-01-01T02:00:00")); //倒计时时长
const timeValue2 = ref(new Date("1970-01-01T00:25:00")); //专注时长
const timeValue3 = ref(new Date("1970-01-01T00:05:00")); //休息时长
const timeValue4 = ref(4); //循环次数

const formatTime = (timeValue: string | Date): string => {
  if (!timeValue) return "0小时0分钟";

  const date = typeof timeValue === "string" ? new Date(timeValue) : timeValue;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}小时${minutes}分钟`;
};

const handleConfirm = async () => {
    if (valueType.value === "倒计时") {
      const hours = timeValue1.value.getHours();
      const minutes = timeValue1.value.getMinutes();
      const seconds = timeValue1.value.getSeconds();
      if (hours === 0 && minutes === 0 && seconds === 0) {
        message("倒计时时长不能为0", { type: "error" });
        return;
      }
    } else if (valueType.value === "番茄钟") {
      const focusHours = timeValue2.value.getHours();
      const focusMinutes = timeValue2.value.getMinutes();
      const focusSeconds = timeValue2.value.getSeconds();
      if (focusHours === 0 && focusMinutes === 0 && focusSeconds === 0) {
        message("专注时长不能为0", { type: "error" });
        return;
      }
      
      const breakHours = timeValue3.value.getHours();
      const breakMinutes = timeValue3.value.getMinutes();
      const breakSeconds = timeValue3.value.getSeconds();
      if (breakHours === 0 && breakMinutes === 0 && breakSeconds === 0) {
        message("休息时长不能为0", { type: "error" });
        return;
      }
    }
  
    try {
    const params = new URLSearchParams();
    params.append("valueType", valueType.value);

    if (valueType.value === "倒计时") {
      params.append("timeValue1", timeValue1.value.toISOString());
    } else if (valueType.value === "番茄钟") {
      params.append("timeValue2", timeValue2.value.toISOString());
      params.append("timeValue3", timeValue3.value.toISOString());
      params.append("timeValue4", timeValue4.value.toString());
    }

    if (todoId.value) {
      const selectedTodo = searchResults.value.find((todo: any) => todo.id === todoId.value);
      if (selectedTodo) {
        params.append("todoId", selectedTodo.id.toString());
        params.append("todoTitle", selectedTodo.title);
      }
    }

    await (window as any).ipcRenderer.invoke("open-win", `compound-timer?${params.toString()}`);
  } catch (error) {
    console.error("打开计时窗口失败:", error);
    message("打开计时窗口失败", { type: "error" });
  }
};

const handleIconClick = (type: string) => {
  valueType.value = type;
  message(`已选择：${type}`, { type: "success" });
};

const options = [
  {
    value: "番茄钟",
    label: "番茄钟"
  },
  {
    value: "正计时",
    label: "正计时"
  },
  {
    value: "倒计时",
    label: "倒计时"
  }
];
</script>

<template>
  <div class="soonstart-container">
    <el-card shadow="never">
      <h3>快速开始番茄钟、正计时或倒计时</h3>
      <!-- 要实现可能需要todo加一个计时字段 -->
      <!-- 根据选择的计时类型弹出新的窗口用于计时 -->
      <div class="icon-container">
        <GameIconsTomato width="64" height="64" @click="handleIconClick('番茄钟')" />
        <StreamlineSharpResetClockSolid width="64" height="64" @click="handleIconClick('正计时')" />
        <MeteorIconsClockRotate width="64" height="64" @click="handleIconClick('倒计时')" />
      </div>
    </el-card>
    <SearchCard :show-time-view-button="false" />
    <!-- 单选待办 -->
    <el-card shadow="never">
      <template #header>
        选择要计时的待办
      </template>
      <el-radio-group v-model="todoId">
        <el-radio 
          v-for="todo in searchResults" 
          :key="todo.id" 
          :value="todo.id"
        >
          {{ todo.title }}
        </el-radio>
      </el-radio-group>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-content">
            <span class="font-medium">选择计时方式</span>
          </div>
        </div>
      </template>
      <el-select v-model="valueType" placeholder="选择计时方式" style="width: 220px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="time-pickers">
        <!-- 如果是正计时，只需要按钮开始 -->
        <div v-if="valueType === '正计时'">
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>

        <div v-if="valueType === '倒计时'" class="time-picker-wrapper">
          <span class="font-small">倒计时时长：</span>
          <el-time-picker v-model="timeValue1" placeholder="选择时长" />
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>

        <div v-if="valueType === '番茄钟'" class="time-pickers-wrapper">
          <span class="font-small">专注时长：</span>
          <el-time-picker v-model="timeValue2" placeholder="专注时长" />
          <span class="font-small">休息时长：</span>
          <el-time-picker v-model="timeValue3" placeholder="休息时长" />
          <div class="font-small">循环次数：</div>
          <el-input-number v-model="timeValue4" placeholder="循环次数" />
          <el-button type="primary" @click="handleConfirm">开始</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.soonstart-container :deep(.el-card) {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.icon-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.large-icon {
  font-size: 64px !important;
  width: 64px;
  height: 64px;
}

.date-picker-wrapper {
  margin-right: 20px;
}

.time-pickers {
  margin-top: 20px;
}

.time-picker-wrapper,
.time-pickers-wrapper {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

.font-small {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}
</style>
