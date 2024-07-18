<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import axios from 'axios';
import type { Comic } from '../types/entities';
import { Api } from '../types/api'
import ComicInfoCard from '@/components/ComicInfoCard.vue';

const props = defineProps<{ search: string }>();
const comics = ref<(Comic & { libraryId: number, libraryName: string })[]>([]);

watchEffect(async () => {
  const result = await axios.get(`${Api.GET_COMIC_URL}?search=${props.search}`);
  comics.value = result.data.data.comics;
})

</script>

<template>
  <div style="padding: 5px">
    <div style="display: flex;">
      <el-text style="margin-left: 0;">“{{ props.search }}”的搜索结果</el-text>
    </div>
    <hr>
  </div>
  <el-space size="large" style="margin: 5px 10px;" wrap>
    <ComicInfoCard v-for="item in comics" :name="item.name" :cover="item.cover" :id="item.id" :key="item.id"
      :finished="item.finished" :page-count="item.pageCount" :reading-progress="item.readingProgress"
      :create-time="item.createTime" :libraryId="item.libraryId" />
  </el-space>
</template>

<style>
.dirDiv {
  width: 300px;
  height: 25px;
  padding: 5px;
  align-items: center;
  display: flex;
  cursor: pointer;
}

.dirDiv:hover {
  background-color: lightgray
}
</style>
