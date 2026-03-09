<script setup lang="ts">
import circleUrl from "@/assets/images/丰川祥子-更软弱的我.jpg";
import Dialog from "@/components/Dialog.vue";
import { getUserInfo, updateUser, uploadAvatar } from "@/api/user";
import { onMounted, watch, ref } from "vue";
import { ElMessage } from "element-plus";

defineOptions({
  name: "UserCenter"
});

const nickname = ref("");
const email = ref("");
const gender = ref();
const birthday = ref("");
const editable = ref(false);
const avatar = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleEdit = () => {
  editable.value = true;
};

const handleSaveConfirm = () => {
  editable.value = false;
};

const handleAvatarClick = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error("只支持上传图片格式（JPG、PNG、GIF、WebP）");
    target.value = "";
    return;
  }
  
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error("图片大小不能超过 5MB");
    target.value = "";
    return;
  }
  
  try {
    const uploadResult = await uploadAvatar(file);
    if (uploadResult.code === 200) {
      const avatarUrl = uploadResult.data ? uploadResult.data.split('?')[0] : circleUrl;
      avatar.value = avatarUrl;
      
      const updateResult = await updateUser({
        nickname: nickname.value,
        gender: gender.value ? parseInt(gender.value) : 3,
        birth: birthday.value,
        avatar: avatarUrl
      });
      
      if (updateResult.code === 200) {
        ElMessage.success("头像上传成功");
      } else {
        ElMessage.error(updateResult.msg || "更新头像失败");
      }
    } else {
      ElMessage.error(uploadResult.msg || "头像上传失败");
    }
  } catch (error) {
    ElMessage.error("头像上传失败，请重试");
  }
  
  target.value = "";
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

watch(editable, async (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    try {
      const result = await updateUser({
        nickname: nickname.value,
        gender: gender.value ? parseInt(gender.value) : 3,
        birth: birthday.value
      });
      if (result.code === 200) {
        ElMessage.success(result.msg || "修改成功");
      } else {
        ElMessage.error(result.msg || "修改失败");
      }
    } catch (error) {
      ElMessage.error("修改失败，请重试");
    }
  }
});

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
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileChange"
      />
      <div class="avatar-wrapper">
        <el-tooltip :disabled="!editable" class="box-item" effect="dark" content="点击修改头像" placement="top">
          <el-avatar size="large" :src="avatar" @click="handleAvatarClick" />
        </el-tooltip>
      </div>
      <div class="form-item">
        <el-tooltip :disabled="!editable" class="box-item" effect="dark" content="不可修改邮箱账号" placement="top">
          <el-input v-model="email" style="width: 240px" placeholder="邮箱账号" disabled />
        </el-tooltip>
      </div>
      <div class="form-item">
        <el-tooltip :disabled="!editable" class="box-item" effect="dark" content="可修改昵称" placement="top">
          <el-input v-model="nickname" :disabled="!editable" style="width: 240px" placeholder="输入新昵称" />
        </el-tooltip>
      </div>
      <div class="form-item">
        <el-tooltip :disabled="!editable" class="box-item" effect="dark" content="可修改性别" placement="top">
          <el-select v-model="gender" :disabled="!editable" style="width: 240px" placeholder="选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
            <el-option label="未知" value="3" />
          </el-select>
        </el-tooltip>
      </div>
      <div class="form-item">
        <el-tooltip :disabled="!editable" class="box-item" effect="dark" content="可修改生日" placement="top">
          <div>
            <el-date-picker v-model="birthday" :disabled="!editable" type="date" value-format="yyyy-MM-dd"
              style="width: 240px" placeholder="选择生日" />
          </div>
        </el-tooltip>
      </div>
      <div class="form-item">
        <el-switch v-model="editable" active-text="修改" inactive-text="保存" />
      </div>
      <div class="form-item">
        <Dialog buttonText="修改密码" title="修改密码" content="确认要修改密码吗？" closeConfirmMessage="确认关闭弹窗吗？"
          confirmButtonType="primary" buttonType="primary" @confirm="handleSaveConfirm" />
      </div>
      <div class="form-item">
        <el-button type="danger">注销账户</el-button>
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
