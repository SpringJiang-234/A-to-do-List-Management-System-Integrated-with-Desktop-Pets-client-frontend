<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import SearchCard from "@/components/SearchCard.vue";
import { useTodoStoreHook } from "@/store/modules/todo";
import { useUserStoreHook } from "@/store/modules/user";
import { getTodoList, insertTodo } from "@/api/todo";
import { getCategoryList } from "@/api/category";
import { getTagList } from "@/api/tag";
import { userKey, type DataInfo } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import ListView from "@/views/todo/components/ListView.vue";
import DayView from "@/views/todo/components/DayView.vue";
import WeekView from "@/views/todo/components/WeekView.vue";
import MonthView from "@/views/todo/components/MonthView.vue";

defineOptions({
  name: "Todo"
});

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
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

const dialogVisible = ref(false);
const todoForm = ref({
  title: "",
  content: "",
  categoryId: undefined as number | undefined,
  priority: undefined as number | undefined,
  startTime: "",
  endTime: "",
  isTop: 1,
  tagIdList: [] as number[]
});

const categories = ref<CategoryOption[]>([]);
const tags = ref<TagOption[]>([]);

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
                isCompleted: todo.status === 2
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
  dialogVisible.value = true;
  todoForm.value = {
    title: "",
    content: "",
    categoryId: undefined,
    priority: undefined,
    startTime: "",
    endTime: "",
    isTop: 1,
    tagIdList: []
  };
  loadCategories();
  loadTags();
};

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
    console.error("加载分类列表失败:", error);
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

const handleConfirm = async () => {
  try {
    const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    if (userInfo?.id) {
      const response = await insertTodo({
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
      
      if (response.code === 200) {
        dialogVisible.value = false;
        await loadTodoList();
      }
    }
  } catch (error) {
    console.error("添加待办失败:", error);
  }
};

const handleCancel = () => {
  dialogVisible.value = false;
};

onMounted(() => {
  loadTodoList();
  loadCategories();
  loadTags();
});
</script>

<template>
  <div class="todo-container">

    <el-button type="primary" circle class="add-button" @click="handleAddClick" />

    <div class="header-wrapper">
      <SearchCard />
    </div>

    <!-- 待办事项列表 -->
    <!-- 根据筛选条件显示待办事项，特别要注意的是需要根据视图选择展示不同逻辑的列表：
    1、如果是日视图，则展示时间线（可以选择日）
    2、如果是周视图，则展示分段控制器+卡片（一列）列表（可以选择周）
    3、如果是月视图，则展示热力图，按照待办完成数量区分颜色深度（可以选择月） 
    关于优先级：标题前加上图标
    1、重要且紧急：<FluentImportant12Filled /><FluentAlertUrgent16Filled />
    2、重要不紧急：<FluentImportant12Filled />
    3、不重要但紧急：<FluentAlertUrgent16Filled />
    -->
    <div class="main-wrapper">
      <component :is="currentView" :todo-list="todoList" :week-data="weekData" :month-data="monthData" :date-todo-map="dateTodoMap" :original-todo-list="originalTodoList" />
    </div>
    <div class="footer-wrapper">
      <!-- 这里需要一个回到顶部的按钮 -->
    </div>

    <!-- 添加待办事项弹窗 -->
    <el-dialog v-model="dialogVisible" title="添加待办事项" width="600px">
      <el-form :model="todoForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="todoForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="todoForm.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        
        <el-collapse>
          <el-collapse-item title="更多选项" name="more">
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
              <el-select v-model="todoForm.priority" placeholder="请选择优先级" clearable>
                <el-option
                  v-for="item in priorities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="todoForm.startTime"
                type="datetime"
                placeholder="请选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="todoForm.endTime"
                type="datetime"
                placeholder="请选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="是否置顶">
              <el-select v-model="todoForm.isTop" placeholder="请选择是否置顶">
                <el-option
                  v-for="item in topOptions"
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
                />
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>

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
