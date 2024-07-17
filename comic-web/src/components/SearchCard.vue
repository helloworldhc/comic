<script setup lang="ts">
import { Back, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const emit = defineEmits(['foldAside'])

const searchText = ref('')

const isFolded = ref(false)

const foldAside = () => {
  emit('foldAside', !isFolded.value);
  isFolded.value = !isFolded.value;
}

</script>

<template>
  <el-card style="width: 100%; height: 56px; position: relative" class="card">
    <div style="height: 48px;width: 48px;margin: 4px;" @click="foldAside">
      <el-icon style="margin: 12px;" size="24px">
        <Back />
      </el-icon>
    </div>

    <el-input style="position: absolute;left: 56px;top: 6px;height: 44px; width: calc(100% - 59px)" v-model="searchText"
      :suffix-icon="Search">输入框</el-input>
  </el-card>
</template>

<style lang="css">
.card {
  .el-card__body {
    padding: 0px;
  }
}
</style>