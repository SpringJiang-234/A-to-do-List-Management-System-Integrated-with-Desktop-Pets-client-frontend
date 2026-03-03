<script setup lang="ts">
import circleUrl from "@/assets/images/丰川祥子-更软弱的我.jpg";

defineOptions({
  name: "UserCenter"
});

import { ref } from "vue";

const nickname = ref("");
const email = ref("");
const gender = ref();
const birthday = ref("");
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>个人中心</span>
      </template>
      <div class="avatar-wrapper">
        <el-avatar size="large" :src="circleUrl" />
      </div>
      <div class="form-item">
        <el-input
          v-model="nickname"
          style="width: 240px"
          placeholder="输入新昵称"
        />
      </div>
      <div class="form-item">
        <el-input
          v-model="email"
          style="width: 240px"
          placeholder="邮箱账号"
          disabled
        />
      </div>
      <div class="form-item">
        <el-select v-model="gender" style="width: 240px" placeholder="选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
          <el-option label="未知" value="3" />
        </el-select>
      </div>
      <div class="form-item">
        <!-- 选择日期必须小于等于今天 -->
        <el-date-picker
          v-model="birthday"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          placeholder="选择生日"
        />
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

.form-item {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
</style>
