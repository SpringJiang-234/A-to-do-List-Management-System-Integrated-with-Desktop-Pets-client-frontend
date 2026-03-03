<script setup lang="ts">
import { ref } from "vue";
import { message } from "@/utils/message";
import AnnounceList from "@/components/AnnounceList.vue";

defineOptions({
  name: "Announcement"
});

const { lastBuildTime } = __APP_INFO__;

const activities = ref([
  {
    title: "系统维护通知",
    content:
      "系统将于2026年3月5日进行维护，预计维护时间为2小时，请提前做好准备。",
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "新功能上线",
    content: "我们很高兴地通知您，番茄钟功能已经正式上线，欢迎大家使用！",
    timestamp: lastBuildTime,
    isCompleted: false
  },
  {
    title: "用户反馈处理",
    content: "感谢您的反馈，我们已经收到并正在处理中，请耐心等待。",
    timestamp: lastBuildTime,
    isCompleted: true
  }
]);

function handleTodoClick(activity: any) {
  message("公告项被点击:", activity);
}

function handleTextClick(activity: any) {
  message("公告文字被点击:", activity);
}
</script>

<template>
  <div>
    <!-- 普通地展示公告就行
  做之前参考一下各大网站的公告实现，应该是要有详细页的
  所以后端的新增和详细页修改也要端上来 -->
    <el-card shadow="never">
      <template #header>
        <span>公告</span>
      </template>
      <AnnounceList
        :activities="activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
    </el-card>
  </div>
</template>
