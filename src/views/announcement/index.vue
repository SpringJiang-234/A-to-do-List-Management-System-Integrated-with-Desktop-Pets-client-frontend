<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import AnnounceList from "@/components/AnnounceList.vue";
import { getAnnouncementList } from "@/api/announcement";
import dayjs from "dayjs";

defineOptions({
  name: "Announcement"
});

const activities = ref([]);

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

onMounted(async () => {
  try {
    const result = await getAnnouncementList();
    if (result.code === 200) {
      activities.value = result.data.map((item: any) => ({
        title: item.title,
        content: item.content,
        timestamp: formatTimestamp(item.updateTime),
        isCompleted: item.isTop === "是"
      }));
    } else {
      message(result.msg || "获取公告列表失败", { type: "error" });
    }
  } catch (error) {
    message("获取公告列表失败", { type: "error" });
  }
});

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
        <h3>公告</h3>
      </template>
      <AnnounceList
        :activities="activities"
        @click="handleTodoClick"
        @textClick="handleTextClick"
      />
    </el-card>
  </div>
</template>
