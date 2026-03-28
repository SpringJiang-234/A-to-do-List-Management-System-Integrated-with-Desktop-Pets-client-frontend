<template>
  <el-select
    v-model="selectedValues"
    :multiple="multiple"
    clearable
    :collapse-tags="multiple"
    :placeholder="placeholder"
    popper-class="custom-header"
    :max-collapse-tags="maxCollapseTags"
    :style="{ width: width }"
  >
    <template v-if="multiple" #header>
      <el-checkbox
        v-model="checkAll"
        :indeterminate="indeterminate"
        @change="handleCheckAll"
      >
        {{ allText }}
      </el-checkbox>
    </template>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { CheckboxValueType } from "element-plus";

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  options: Option[];
  modelValue?: CheckboxValueType | CheckboxValueType[];
  placeholder?: string;
  allText?: string;
  maxCollapseTags?: number;
  width?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: "请选择",
  allText: "全选",
  maxCollapseTags: 1,
  width: "240px",
  multiple: true
});

const emit = defineEmits<{
  "update:modelValue": [value: CheckboxValueType | CheckboxValueType[]];
  change: [value: CheckboxValueType | CheckboxValueType[]];
}>();

const checkAll = ref(false);
const indeterminate = ref(false);
const selectedValues = ref<CheckboxValueType | CheckboxValueType[]>(
  props.modelValue
);

watch(
  () => props.modelValue,
  val => {
    selectedValues.value = val;
  }
);

watch(selectedValues, val => {
  emit("update:modelValue", val);
  emit("change", val);

  if (props.multiple && Array.isArray(val)) {
    if (val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
    } else if (val.length === props.options.length) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  } else if (!props.multiple) {
    // 单选模式下的类型判断
    checkAll.value = val !== "" && val !== null && val !== undefined;
    indeterminate.value = false;
  }
});

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false;
  if (val) {
    selectedValues.value = props.options.map(_ => _.value);
  } else {
    selectedValues.value = [];
  }
};
</script>

<style scoped>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>
