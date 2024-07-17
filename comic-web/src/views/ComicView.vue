<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import axios from 'axios';
import type { Comic } from '@/types/entities';
import { useRoute, useRouter } from 'vue-router';
import { Back, Reading } from '@element-plus/icons-vue'
import dayjs from 'dayjs';

// defineProps<{ id: string }>()

const comic = ref<Comic>();

const route = useRoute();
const router = useRouter();

watchEffect(async () => {
  const API_GET_COLLECTION_COMICS_URL = `/api/comics/${route.params.comicId}`
  const result = await axios.get(`${API_GET_COLLECTION_COMICS_URL}`);
  comic.value = result.data.data;
})

const backToLibrary = () => {
  router.push({ name: 'libraryComic', params: { id: route.params.id } })
}

const readComic = () => {
  router.push({ name: 'comicRead', params: { id: route.params.comicId } })
}

const formatTimestamp = (ts: string) => dayjs(ts).format('YYYY-MM-DD HH:mm:ss')

</script>

<template>
  <div style="padding: 5px">
    <el-button type="primary" color="white" @click="backToLibrary" circle>
      <el-icon size="15">
        <Back />
      </el-icon>
    </el-button>
    <hr>
  </div>
  <div style="position: relative; margin: 5px 20px">
    <el-card class="card" style="width: 200px; height: 285px;">
      <el-image :src="comic?.cover" fit="contain" />
    </el-card>
    <div style="position: absolute; left: 230px; top: 20px;">
      <el-text size="large">{{ comic?.name || '' }}</el-text>
      <br />
      <br />
      <el-space wrap :size="50">
        <el-text size="small">{{ comic?.pageCount }}页</el-text>
        <el-text size="small">{{ comic ? formatTimestamp(comic.createTime) : '' }}</el-text>

      </el-space>
      <br />
      <el-text size="small" v-if="comic && comic.lastTime">最后查看时间：{{ comic && comic.lastTime &&
        formatTimestamp(comic.lastTime) || '' }}</el-text>
      <br />
      <br />
      <el-button :icon="Reading" @click="readComic">阅读</el-button>
    </div>
  </div>
</template>
