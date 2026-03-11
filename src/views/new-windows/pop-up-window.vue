<script lang="ts" setup>
import { onMounted } from "vue";

defineOptions({
    name: "PopUpWindow"
});

onMounted(() => {
    setTimeout(() => {
        window.close();
    }, 2000);
});
</script>

<template>
    <div class="pop-up-container">
        <div class="pop-up-content">
            <p>这是一个弹窗提示</p>
        </div>
    </div>
</template>

<style scoped>
.pop-up-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
}

.pop-up-content {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
}

.pop-up-content p {
    margin: 0;
    font-size: 16px;
    color: #333;
    font-weight: 500;
}
</style>
