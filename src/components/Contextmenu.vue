<template>
  <div>
    <!-- 右键菜单 -->
    <el-popover
      ref="popover"
      v-model:visible="contextMenuVisible"
      placement="bottom-start"
      width="160"
      :popper-style="{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        position: 'absolute'
      }"
      trigger="contextmenu"
    >
      <div class="flex flex-col items-center">
        <div
          @click="handleMenuAction('edit')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          修改
        </div>
        <div
          @click="handleMenuAction('add')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          新增
        </div>
        <div
          @click="handleMenuAction('delete')"
          class="py-2.5 border-b w-full cursor-pointer text-center"
        >
          删除
        </div>
      </div>
    </el-popover>

    <div @contextmenu.prevent="handleRightClick">test</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

const contextMenuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  menuPosition.value = { x: event.clientX, y: event.clientY };
  contextMenuVisible.value = true;
};

const handleMenuAction = (action: string) => {
  contextMenuVisible.value = false;
  ElMessage.success(`点击了：${action}`);
};
</script>

<style lang="scss" scoped></style>
