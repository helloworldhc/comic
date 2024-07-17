<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import ComicInfoCard from '../components/ComicInfoCard.vue'
import axios from 'axios';
import type { Library, Comic } from '../types/entities';
import { useRoute, useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue'

const pageSize = ref(20);
const currentPage = ref(1);
const pageCount = ref(0);

const librariesInfo = ref<Library>();
const comics = ref<Comic[]>([]);

const route = useRoute();
const router = useRouter();

watchEffect(async () => {
  const API_GET_COLLECTION_COMICS_URL = `/api/libraries/${route.params.id}`
  const result = await axios.get(`${API_GET_COLLECTION_COMICS_URL}?pageSize=${pageSize.value}&page=${currentPage.value}`);
  console.log('result', result)
  const { comics: comicData, ...librariesData } = result.data.data;
  librariesInfo.value = librariesData;
  comics.value = comicData;
  pageCount.value = Math.ceil((librariesInfo.value?.comicCount || 0) / pageSize.value)
})

const backToLibraries = () => {
  router.push({ name: 'libraries' })
}

const readingClicked = (id: number) => {
  console.log('readingClicked', id);
  router.push({ name: 'comicRead', params: { id } })
}

</script>

<template>
  <div style="padding: 5px">
    <el-button type="primary" color="white" @click="backToLibraries" circle>
      <el-icon size="15">
        <Back />
      </el-icon>
    </el-button>

    <el-text style="margin-left: 10px;">{{ librariesInfo?.name }} ({{ librariesInfo?.comicCount }})</el-text>
    <hr>
  </div>
  <el-pagination layout="prev, pager, next, sizes" @size-change="(v: number) => pageSize = v"
    @current-change="(v: number) => currentPage = v" :default-page-size="pageSize" :page-sizes="[10, 20, 50, 100, 200]"
    :page-count="pageCount" style="margin: 5px;" />
  <el-space size="large" style="margin: 5px 10px;" wrap>
    <ComicInfoCard v-for="item in comics" :name="item.name" :cover="item.cover" :id="item.id" :key="item.id"
      :finished="item.finished" :page-count="item.pageCount" :reading-progress="item.readingProgress"
      :create-time="item.createTime" :libraryId="+route.params.id" @reading-clicked="readingClicked" />
  </el-space>
</template>
