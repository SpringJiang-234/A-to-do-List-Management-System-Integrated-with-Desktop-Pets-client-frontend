<script setup lang="ts">
import { computed, onMounted, onActivated, ref, watch } from "vue";
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
  isTop?: number;
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

const categories = ref<any[]>([]);
const tags = ref<any[]>([]);
const priorities = [
  {
    value: "1",
    label: "不重要不紧急"
  },
  {
    value: "2",
    label: "不重要但紧急"
  },
  {
    value: "3",
    label: "重要不紧急"
  },
  {
    value: "4",
    label: "重要且紧急"
  }
];
const statusOptions = [
  {
    value: "0",
    label: "未开始"
  },
  {
    value: "1",
    label: "进行中"
  },
  {
    value: "2",
    label: "已完成"
  }
];
const topOptions = [
  {
    value: "1",
    label: "置顶"
  },
  {
    value: "2",
    label: "不置顶"
  }
];

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
    
    dateTodoMap.value.clear();
    
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (userInfo?.id) {
      const params: any = {
        userId: userInfo.id
      };

      if (todoStore.filter.title) {
        params.title = todoStore.filter.title;
      }

      if (todoStore.filter.content) {
        params.content = todoStore.filter.content;
      }

      if (todoStore.filter.categories && todoStore.filter.categories.length > 0 && todoStore.filter.categories.length < categories.value.length) {
        params.categoryIdList = todoStore.filter.categories.map((cat: string) => parseInt(cat));
      }

      if (todoStore.filter.tags && todoStore.filter.tags.length > 0 && todoStore.filter.tags.length < tags.value.length) {
        params.tagIdList = todoStore.filter.tags.map((tag: string) => parseInt(tag));
      }

      if (todoStore.filter.priorities && todoStore.filter.priorities.length > 0 && todoStore.filter.priorities.length < priorities.length) {
        params.priorityList = todoStore.filter.priorities.map((prio: string) => parseInt(prio));
      }

      if (todoStore.filter.time) {
        params.time = todoStore.filter.time;
      }

      if (todoStore.filter.startTime) {
        params.startTime = todoStore.filter.startTime;
      }

      if (todoStore.filter.endTime) {
        params.endTime = todoStore.filter.endTime;
      }

      if (todoStore.filter.status && todoStore.filter.status.length > 0 && todoStore.filter.status.length < statusOptions.length) {
        params.statusList = todoStore.filter.status.map((stat: string) => parseInt(stat));
      }

      if (todoStore.filter.isTop && todoStore.filter.isTop.length > 0 && todoStore.filter.isTop.length < topOptions.length) {
        params.isTopList = todoStore.filter.isTop.map((top: string) => parseInt(top));
      }

      console.log("loadTodoList 搜索参数:", params);

      const response = await getTodoList(params);
      if (response.code === 200) {
        originalTodoList.value = response.data;
        
        // 过滤连续任务
        if (todoStore.filter.isContinuous && todoStore.filter.isContinuous.length > 0 && todoStore.filter.isContinuous.length < 2) {
          const isContinuousTask = todoStore.filter.isContinuous.includes("1");
          originalTodoList.value = originalTodoList.value.filter(todo => {
            const startTime = todo.startTime ? new Date(todo.startTime).getTime() : 0;
            const endTime = todo.endTime ? new Date(todo.endTime).getTime() : 0;
            const isContinuous = startTime !== endTime;
            return isContinuousTask ? isContinuous : !isContinuous;
          });
        }
        
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
                priority: todo.priority,
                isTop: todo.isTop
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

const loadCategoriesAndTags = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (!userInfo?.id) {
      console.warn("用户信息不存在，跳过加载分类和标签");
      return;
    }

    const systemCategoryResponse = await getCategoryList(0);
    const userCategoryResponse = await getCategoryList(userInfo.id);

    const systemCategories = systemCategoryResponse.code === 200 ? systemCategoryResponse.data : [];
    const userCategories = userCategoryResponse.code === 200 ? userCategoryResponse.data : [];

    categories.value = [...systemCategories, ...userCategories].map((item: any) => ({
      value: item.id.toString(),
      label: item.name
    }));

    const systemTagResponse = await getTagList(0);
    const userTagResponse = await getTagList(userInfo.id);

    const systemTags = systemTagResponse.code === 200 ? systemTagResponse.data : [];
    const userTags = userTagResponse.code === 200 ? userTagResponse.data : [];

    tags.value = [...systemTags, ...userTags].map((item: any) => ({
      value: item.id.toString(),
      label: item.name
    }));
  } catch (error) {
    console.error("加载分类和标签失败:", error);
  }
};

const handleAddClick = () => {
  router.push("/todo/add");
};

onMounted(() => {
  loadTodoList();
  loadCategoriesAndTags();
});

onActivated(() => {
  todoStore.setFilter({
    title: "",
    content: "",
    categories: [],
    tags: [],
    priorities: [],
    isContinuous: [],
    time: "",
    startTime: "",
    endTime: "",
    status: [],
    isTop: [],
    timeRule: todoStore.filter.timeRule
  });
  loadTodoList();
});

watch(() => todoStore.filter, () => {
  console.log("========== filter 变化，重新加载待办列表 ==========");
  loadTodoList();
}, { deep: true });
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
