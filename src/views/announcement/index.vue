<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import AnnounceList from "@/components/AnnounceList.vue";
import { getAnnouncementList } from "@/api/announcement";
import dayjs from "dayjs";

defineOptions({
  name: "Announcement"
});

const router = useRouter();

interface Activity {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  isCompleted: boolean;
}

const activities = ref<Activity[]>([]);

const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

onMounted(async () => {
  try {
    const result = await getAnnouncementList();
    if (result.code === 200) {
      activities.value = result.data.map((item: any) => ({
        id: item.id,
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

function handleTodoClick(activity: Activity) {
  router.push(`/announcement/detail/${activity.id}`);
}

function handleTextClick(activity: Activity) {
  router.push(`/announcement/detail/${activity.id}`);
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
