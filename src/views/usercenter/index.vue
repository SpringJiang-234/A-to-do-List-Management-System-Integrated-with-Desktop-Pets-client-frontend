<script setup lang="ts">
import circleUrl from "@/assets/images/丰川祥子-更软弱的我.jpg";
import Dialog from "@/components/Dialog.vue";
import { getUserInfo } from "@/api/user";
import { onMounted } from "vue";

defineOptions({
  name: "UserCenter"
});

import { ref } from "vue";

const nickname = ref("");
const email = ref("");
const gender = ref();
const birthday = ref("");
const editable = ref(false);
const avatar = ref("");

const handleEdit = () => {
  editable.value = true;
};

const handleSaveConfirm = () => {
  editable.value = false;
};

const loadUserInfo = async () => {
  try {
    const result = await getUserInfo();
    if (result.data) {
      nickname.value = result.data.username || "";
      email.value = result.data.account || "";
      gender.value = result.data.gender ? result.data.gender.toString() : "3";
      if (result.data.birth) {
        const birthDate = new Date(result.data.birth);
        birthday.value = birthDate.toISOString().split('T')[0];
      }
      avatar.value = result.data.avatar ? result.data.avatar.split('?')[0] : circleUrl;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

onMounted(() => {
  loadUserInfo();
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div class="header-content">
          <h3>个人中心</h3>
        </div>
      </template>
      <div class="avatar-wrapper">
        <el-avatar size="large" :src="avatar" />
      </div>
      <div class="form-item">
        <el-input
          v-model="nickname"
          :disabled="!editable"
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
        <el-select
          v-model="gender"
          :disabled="!editable"
          style="width: 240px"
          placeholder="选择性别"
        >
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
          <el-option label="未知" value="3" />
        </el-select>
      </div>
      <div class="form-item">
        <!-- 选择日期必须小于等于今天 -->
        <el-date-picker
          v-model="birthday"
          :disabled="!editable"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          placeholder="选择生日"
        />
      </div>
      <div class="form-item">
        <el-button type="primary" style="width: 115px" @click="handleEdit"
          >修改</el-button
        >
        <Dialog
          buttonText="保存"
          title="保存"
          content="确认要保存修改吗？"
          closeConfirmMessage="确认关闭弹窗吗？"
          confirmButtonType="primary"
          buttonWidth="115px"
          buttonType="primary"
          @confirm="handleSaveConfirm"
        />
      </div>
      <div class="form-item">
        <el-button type="primary" style="width: 115px">退出登录</el-button>
        <el-button type="danger" style="width: 115px">注销账户</el-button>
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
