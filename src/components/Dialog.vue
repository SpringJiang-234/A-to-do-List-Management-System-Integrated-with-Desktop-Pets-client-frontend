<template>
  <el-button
    :type="buttonType"
    :style="{ width: buttonWidth }"
    @click="dialogVisible = true"
  >
    {{ buttonText }}
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500"
    :before-close="handleClose"
  >
    <slot>
      <span>{{ content }}</span>
    </slot>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :type="confirmButtonType" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessageBox } from "element-plus";

interface Props {
  buttonText?: string;
  title?: string;
  content?: string;
  closeConfirmMessage?: string;
  confirmButtonType?: "primary" | "success" | "warning" | "danger" | "info";
  buttonWidth?: string;
  buttonType?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "default";
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "Click to open Dialog",
  title: "Tips",
  content: "This is a message",
  closeConfirmMessage: "Are you sure to close this dialog?",
  confirmButtonType: "primary",
  buttonWidth: "auto",
  buttonType: "default"
});

const emit = defineEmits<{
  confirm: [];
}>();

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm(props.closeConfirmMessage)
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const handleConfirm = () => {
  emit("confirm");
  dialogVisible.value = false;
};
</script>
