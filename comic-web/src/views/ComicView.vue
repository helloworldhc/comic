<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import axios from 'axios';
import type { Comic, ComicDetail } from '@/types/entities';
import { useRoute, useRouter } from 'vue-router';
import { Back, Edit, Reading } from '@element-plus/icons-vue'
import dayjs from 'dayjs';
import EditComicDialog from '@/components/EditComicDialog.vue';
import { formatString } from 'typescript-string-operations';
import { Api } from '@/types/api';


const comic = ref<Comic & ComicDetail>();

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

const showComicEditDialog = ref(false);
const comicDetail = ref<ComicDetail & { id: number }>({ id: 0, name: '', authors: [], properties: [] });
const comicEditClicked = () => {
  comicDetail.value.id = comic.value!.id;
  comicDetail.value.name = comic.value!.name;
  comicDetail.value.authors = comic.value!.authors;
  comicDetail.value.properties = comic.value!.properties;
  showComicEditDialog.value = true;
}

const editDialogCancelled = () => {
  showComicEditDialog.value = false;
}

const editDialogConfirmed = async (editComic: ComicDetail & { id: number }) => {
  const { id, name, authors, properties } = editComic;
  await axios.put(formatString(Api.GET_COMIC_DETAIL_URL, id), { name, authors, properties });
  if (comic.value) {
    comic.value.name = name;
    comic.value.authors = authors;
    comic.value.properties = properties;
  }
  showComicEditDialog.value = false;
}

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
    <div style="position: absolute; left: 230px; top: 20px; width: 600px;">
      <el-text size="large" tag="b">{{ comic?.name || '' }}</el-text>
      <br />
      <br />
      <el-row>
        <el-col :span="4"><el-text size="small">{{ comic && comic.readingProgress ? '进度' : '页数' }}</el-text></el-col>
        <el-col :span="20"><el-text size="small">{{ comic && comic.readingProgress ?
          `${comic.readingProgress}/${comic.pageCount}` : comic?.pageCount }}</el-text></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><el-text size="small">文件大小</el-text></el-col>
        <el-col :span="20"><el-text size="small">{{ comic && comic.size ? (comic.size / 1024).toFixed(2) : 0
            }}MB</el-text></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><el-text size="small">添加时间</el-text></el-col>
        <el-col :span="20"><el-text size="small">{{ comic ? formatTimestamp(comic.createTime) : '' }}</el-text></el-col>
      </el-row>
      <el-row v-if="comic && comic.lastTime">
        <el-col :span="4"><el-text size="small">最后查看时间</el-text></el-col>
        <el-col :span="20"><el-text size="small">{{ comic && comic.lastTime &&
          formatTimestamp(comic.lastTime) || '' }}</el-text></el-col>
      </el-row>
      <br />
      <el-button :icon="Reading" @click="readComic">阅读</el-button>
      <el-button :icon="Edit" @click="comicEditClicked">编辑</el-button>
    </div>
  </div>
  <div id="propertyDiv">
    <el-text>作者</el-text>
    <el-space wrap>
      <el-tag v-for="author in comic?.authors" :key="author">{{ author }}</el-tag>
    </el-space>
    <br>
    <br>
    <el-text>属性：</el-text>
    <div v-for="property in comic?.properties" :key="property.name" style="margin: 10px 0;">
      <el-text>{{ property.name }}</el-text>
      <el-space wrap>
        <el-tag v-for="value in property.values" :key="value">
          {{ value }}
        </el-tag>
      </el-space>
    </div>
  </div>

  <EditComicDialog :comic="comicDetail" :show-dialog="showComicEditDialog" @editCancelled="editDialogCancelled"
    @editConfirmed="editDialogConfirmed" />
</template>

<style>
#propertyDiv {
  margin: 20px auto 0 20px
}

#propertyDiv .el-text {
  margin: 0 20px
}
</style>
