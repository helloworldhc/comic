<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Comic } from '../types/entities';
import { Reading } from '@element-plus/icons-vue';

const props = defineProps<Comic & { libraryId: number }>()

const router = useRouter();

const readingClicked = () => {
  router.push({ name: 'comicRead', params: { id: props.id } });
}
</script>

<template>
  <el-card class="card" shadow="always" style="width: 150px">
    <div id="comicDiv">
      <el-image :src="cover" fit="contain" style="height: 214px;" />
      <div id="progressBg" v-show="readingProgress > 0">
        <div id="progressDiv" :style="{ width: `${((readingProgress / pageCount) * 100).toFixed(2)}%` }" />
      </div>

      <el-icon size=56 @click="readingClicked">
        <Reading />
      </el-icon>
    </div>
    <RouterLink :to="{ name: 'comic', params: { id: libraryId, comicId: id } }">
      <el-text class="el-link" style="margin-left: 10px;" truncated>{{ name }}</el-text>
    </RouterLink>
    <el-text type="info" style="margin: 5px 10px; display: block; ">{{ pageCount }} 页</el-text>
  </el-card>
</template>

<style lang="css">
.link {
  margin-left: 8px;
}

#comicDiv {
  position: relative;
}

#comicDiv:hover {
  cursor: pointer;
}

#comicDiv:hover::after {
  background-color: rgba(0, 0, 0, 0.3);
  content: '';
  position: absolute;
  z-index: 100;
  border-radius: 4px;
  left: 0;
  top: 0;
  width: 150px;
  height: 214px
}

#comicDiv i {
  display: none;
}

#comicDiv:hover i {
  position: absolute;
  display: initial;
  z-index: 200;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  color: white
}

#progressBg {
  background-color: rgba(64, 158, 255, 0.1);
  height: 6px;
  width: 150px;
  display: flex;
  align-items: start;
  position: absolute;
  left: 0;
  top: 208px;
}

#progressDiv {
  background-color: rgb(64, 158, 255);
  height: 6px;
}
</style>