<script setup lang="ts">
import { ref, onMounted } from "vue";
import circleUrl from "@/assets/images/丰川祥子-YES.gif";
import { getDesktopPetInfo } from "@/api/deskpet";

defineOptions({
  name: "DeskPet"
});

const format = percentage => (percentage === 100 ? "Full" : `${percentage}%`);

const formatProgress = (label: string, percentage: number) => {
  return percentage === 100 ? `${label}:MAX` : `${label}:${percentage}%`;
};

const getProgressStatus = (percentage: number) => {
  if (percentage > 60) return "success";
  if (percentage > 30) return "warning";
  return "exception";
};

const growthValue = ref(90);
const vitalityValue = ref(100);
const moodValue = ref(60);
const intimacyValue = ref(80);
const levelValue = ref(1);

const openDeskPetWindow = async () => {
  try {
    await (window as any).ipcRenderer.invoke("open-win", "new-windows");
  } catch (error) {
    console.error("打开桌宠窗口失败:", error);
  }
};

const loadDesktopPetInfo = async () => {
  try {
    const result = await getDesktopPetInfo();
    if (result.code === 200 && result.data) {
      growthValue.value = result.data.exp || 0;
      vitalityValue.value = result.data.energy || 0;
      moodValue.value = result.data.mood || 0;
      intimacyValue.value = result.data.intimacy || 0;
      levelValue.value = result.data.level || 1;
    }
  } catch (error) {
    console.error("获取桌宠信息失败:", error);
  }
};

onMounted(() => {
  loadDesktopPetInfo();
});
</script>

<template>
  <div>
    <!-- 桌宠数据
      养成数据：可以关闭（switch）
      待办经验：不可关闭（switch 灰色不可动）
桌宠数据中，活力值、心情值、亲密度、成长值范围均为0~100，成长等级范围为0~∞。其中，
活力值每天重置为0，当完成和新建待办事项时，活力值增加；
心情值每天重置为60，当按时完成待办事项时心情值增加，而逾期则导致心情值减少；
亲密度值每天会继承，当用户每天登录时亲密度值增加，连续7天不登录亲密度值则减少；
成长值及成长等级每天也会继承，完成待办事项时成长值增加，当成长值满100时，成长等级增加且成长值重置为0。 -->
    <el-card shadow="never">
      <template #header>
        <h3>我的桌宠</h3>
      </template>
      <div class="avatar-wrapper">
        <el-avatar size="large" :src="circleUrl" />
      </div>
      <div class="demo-progress">
        <span>LV.{{ levelValue }}</span>
        <el-progress
          :percentage="growthValue"
          :format="() => formatProgress('成长值', growthValue)"
          :stroke-width="20"
          :text-inside="true"
          striped
          striped-flow
          :duration="20"
        />
        <el-progress
          :percentage="vitalityValue"
          :format="() => formatProgress('活力值', vitalityValue)"
          :status="getProgressStatus(vitalityValue)"
          :stroke-width="20"
          :text-inside="true"
        />
        <el-progress
          :percentage="moodValue"
          :format="() => formatProgress('心情值', moodValue)"
          :status="getProgressStatus(moodValue)"
          :stroke-width="20"
          :text-inside="true"
        />
        <el-progress
          :percentage="intimacyValue"
          :format="() => formatProgress('亲密度', intimacyValue)"
          :status="getProgressStatus(intimacyValue)"
          :stroke-width="20"
          :text-inside="true"
        />
        <div class="form-item">
          <el-button type="primary" style="width: 115px" @click="openDeskPetWindow">召唤桌宠</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.demo-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 240px;
}

.demo-progress span {
  display: block;
  text-align: center;
  margin-bottom: 10px;
}
</style>
