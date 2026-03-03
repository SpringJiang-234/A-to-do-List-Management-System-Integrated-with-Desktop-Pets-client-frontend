<script setup lang="ts">
import circleUrl from "@/assets/images/丰川祥子-更软弱的我.jpg";

defineOptions({
  name: "DeskPet"
});

const format = percentage => (percentage === 100 ? "Full" : `${percentage}%`);
</script>

<template>
  <div class="deskpet-container">
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
        <span>我的桌宠</span>
      </template>
      <div class="avatar-wrapper">
        <el-avatar size="large" :src="circleUrl" />
      </div>
      <div class="demo-progress">
        <span>LV.1</span>
        <el-progress
          :percentage="90"
          :format="format"
          :stroke-width="20"
          :text-inside="true"
          >成长值</el-progress
        >
        <el-progress
          :percentage="100"
          :format="format"
          :stroke-width="20"
          :text-inside="true"
          >活力值</el-progress
        >
        <el-progress
          :percentage="60"
          :format="format"
          :stroke-width="20"
          :text-inside="true"
          >心情值</el-progress
        >
        <el-progress
          :percentage="80"
          :format="format"
          :stroke-width="20"
          :text-inside="true"
          >亲密度</el-progress
        >
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.deskpet-container {
  display: flex;
  justify-content: center;
}

.deskpet-container :deep(.el-card) {
  margin-bottom: 20px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
