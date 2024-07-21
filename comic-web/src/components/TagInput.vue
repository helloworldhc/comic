<script setup lang="ts">
import type { ElInput } from 'element-plus';
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{ size: string, hintCondition: (v: string) => boolean, hint: string, addText?: string }>();
const emits = defineEmits<{
  inputConfirmed: [value: string]
}>()

const inputVisible = ref(false);
const inputRef = ref<InstanceType<typeof ElInput>>()
const inputValue = ref('');
const hintVisible = ref(false);
const hintText = ref('');
const showInput = () => {
  inputVisible.value = true;
  hintText.value = '';
  hintVisible.value = false;
  nextTick(() => {
    inputRef.value!.input!.focus();
  })
}
const inputConfirm = () => {
  emits('inputConfirmed', inputValue.value);
  inputVisible.value = false;
  inputValue.value = '';
}

watch(inputValue, (value: string) => {
  if (props.hintCondition(value)) {
    hintText.value = props.hint;
    hintVisible.value = true;
  } else {
    hintText.value = '';
    hintVisible.value = false;
  }
})

</script>

<template>
  <div class="inputDiv" v-if="inputVisible">
    <el-input ref="inputRef" v-model="inputValue" :size="size" @keyup.enter="inputConfirm" @blur="inputConfirm" />
    <div class="inputHint" v-show="hintVisible">{{ hintText }}</div>
  </div>

  <el-button v-else-if="!addText" @click="showInput" circle :size="size">
    <el-icon>
      <Plus />
    </el-icon>
  </el-button>
  <el-button v-else @click="showInput" :size="size">
    {{ addText }}
  </el-button>
</template>

<style>
.inputDiv {
  width: 60px;
  position: relative;
  display: inline-flex;
}

.inputDiv .el-input__suffix {
  display: none
}

.inputHint {
  position: absolute;
  left: 0;
  bottom: -20px;
  display: inline;
  font-size: 10px;
  line-height: 10px;
  width: 200px;
  color: red;
}
</style>