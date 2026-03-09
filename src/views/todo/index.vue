<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SearchCard from "@/components/SearchCard.vue";
import { useTodoStoreHook } from "@/store/modules/todo";
import { useUserStoreHook } from "@/store/modules/user";
import { getTodoList } from "@/api/todo";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import ListView from "@/views/todo/components/ListView.vue";
import DayView from "@/views/todo/components/dayview.vue";
import WeekView from "@/views/todo/components/weekview.vue";
import MonthView from "@/views/todo/components/monthview.vue";

defineOptions({
  name: "Todo"
});

const router = useRouter();

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

interface CategoryOption {
  value: number;
  label: string;
}

interface TagOption {
  value: number;
  label: string;
}

interface WeekData {
  sunday: Activity[];
  monday: Activity[];
  tuesday: Activity[];
  wednesday: Activity[];
  thursday: Activity[];
  friday: Activity[];
  saturday: Activity[];
}

interface MonthData {
  [key: string]: Activity[];
}

const todoStore = useTodoStoreHook();
const userStore = useUserStoreHook();
const originalTodoList = ref<any[]>([]);
const dateTodoMap = ref<Map<string, number[]>>(new Map());
const todoList = ref<Activity[]>([]);
const loading = ref(false);

const currentView = computed(() => {
  const timeRule = todoStore.filter.timeRule;
  if (timeRule === "0") {
    return ListView;
  }
  if (timeRule === "1") {
    return DayView;
  }
  if (timeRule === "2") {
    return WeekView;
  }
  if (timeRule === "3") {
    return MonthView;
  }
  return ListView;
});

const weekData = computed(() => {
  const data: WeekData = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  };

  todoList.value.forEach(todo => {
    const date = new Date(todo.timestamp);
    const dayOfWeek = date.getDay();
    
    switch (dayOfWeek) {
      case 0:
        data.sunday.push(todo);
        break;
      case 1:
        data.monday.push(todo);
        break;
      case 2:
        data.tuesday.push(todo);
        break;
      case 3:
        data.wednesday.push(todo);
        break;
      case 4:
        data.thursday.push(todo);
        break;
      case 5:
        data.friday.push(todo);
        break;
      case 6:
        data.saturday.push(todo);
        break;
      default:
        console.warn(`Unexpected day of week: ${dayOfWeek}`);
        break;
    }
  });

  return data;
});

const monthData = computed(() => {
  const data: MonthData = {};

  todoList.value.forEach(todo => {
    const date = new Date(todo.timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if (!data[dateKey]) {
      data[dateKey] = [];
    }
    data[dateKey].push(todo);
  });

  return data;
});

// TODO：目前是全部查询，如果太多待办应该会很卡，后续看看怎么优化
const loadTodoList = async () => {
  console.log("========== loadTodoList 被调用 ==========");
  try {
    loading.value = true;
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (userInfo?.id) {
      const response = await getTodoList({
        userId: userInfo.id
      });
      if (response.code === 200) {
        originalTodoList.value = response.data;
        console.log("========== 待办映射开始 ==========");
        console.log("原始待办列表:", originalTodoList.value);
        
        const newDateTodoMap = new Map<string, number[]>();
        
        response.data.forEach(record => {
          const startTime = record.startTime ? new Date(record.startTime) : new Date();
          const endTime = record.endTime ? new Date(record.endTime) : new Date();
          
          const startDate = new Date(startTime);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(endTime);
          endDate.setHours(0, 0, 0, 0);
          
          const currentDate = new Date(startDate);
          const assignedDates: string[] = [];
          
          console.log(`\n待办ID: ${record.id}, 标题: "${record.title}"`);
          console.log(`  开始时间: ${record.startTime}`);
          console.log(`  结束时间: ${record.endTime}`);
          
          while (currentDate <= endDate) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            if (!newDateTodoMap.has(dateKey)) {
              newDateTodoMap.set(dateKey, []);
            }
            newDateTodoMap.get(dateKey)!.push(record.id);
            assignedDates.push(dateKey);
            
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          console.log(`  分配到日期: ${assignedDates.join(", ")}`);
        });
        
        dateTodoMap.value = newDateTodoMap;
        console.log("\n========== 日期映射表 ==========");
        dateTodoMap.value.forEach((todoIds, dateKey) => {
          console.log(`${dateKey}: 待办ID [${todoIds.join(", ")}]`);
        });
        console.log("========== 待办映射结束 ==========\n");
        
        const expandedActivities: Activity[] = [];
        newDateTodoMap.forEach((todoIds, dateKey) => {
          todoIds.forEach(todoId => {
            const todo = originalTodoList.value.find(t => t.id === todoId);
            if (todo) {
              expandedActivities.push({
                id: todo.id,
                title: todo.title,
                content: todo.content,
                timestamp: new Date(dateKey).toISOString(),
                startTime: todo.startTime,
                endTime: todo.endTime,
                status: todo.status,
                priority: todo.priority
              });
            }
          });
        });
        
        todoList.value = expandedActivities;
        console.log("展开后的待办列表:", todoList.value);
      }
    }
  } catch (error) {
    console.error("加载待办列表失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleAddClick = () => {
  router.push("/todo/add");
};

onMounted(() => {
  loadTodoList();
});
</script>

<template>
  <div class="todo-container">

    <el-button type="primary" circle class="add-button" @click="handleAddClick" />
<!-- TODO 还没测试搜索栏，其中是否为连续任务需要注意：查询不带这个条件，最后显示的时候过滤一部分就行 -->
    <div class="header-wrapper">
      <SearchCard />
    </div>

    <!-- 待办事项列表 -->
    <!-- 根据筛选条件显示待办事项，特别要注意的是需要根据视图选择展示不同逻辑的列表：
    1、如果是日视图，则展示时间线（可以选择日）
    2、如果是周视图，则展示分段控制器+卡片（一列）列表（可以选择周）
    3、如果是月视图，则展示热力图，按照待办完成数量区分颜色深度（可以选择月） 
    关于优先级：标题前加上图标
    1、重要且紧急（4）：<FluentImportant12Filled /><FluentAlertUrgent16Filled />
    2、重要不紧急（3）：<FluentImportant12Filled />
    3、不重要但紧急（2）：<FluentAlertUrgent16Filled />
    4、不重要不紧急（1）：无图标
    -->
    <div class="main-wrapper">
      <component :is="currentView" :todo-list="todoList" :week-data="weekData" :month-data="monthData" :date-todo-map="dateTodoMap" :original-todo-list="originalTodoList" @refresh="loadTodoList" />
    </div>
    <div class="footer-wrapper">
      <!-- 这里需要一个回到顶部的按钮 -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.todo-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
}

.header-wrapper {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.main-wrapper {
  flex: 0 1 auto;
  overflow: visible;
}

.footer-wrapper {
  flex-shrink: 0;
}

.add-button {
  position: fixed;
  left: 230px;
  bottom: 40px;
  z-index: 9999;
  transition: opacity 0.3s ease;
  opacity: 1;
  width: 40px;
  height: 40px;
  
  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::before {
    width: 16px;
    height: 2px;
  }
  
  &::after {
    width: 2px;
    height: 16px;
  }
}
</style>
