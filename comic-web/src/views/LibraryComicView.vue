<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import ComicInfoCard from '../components/ComicInfoCard.vue'
import axios from 'axios';
import type { Library, Comic } from '../types/entities';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown, Back, RefreshLeft } from '@element-plus/icons-vue'
import { Api } from '@/types/api';
import { formatString } from 'typescript-string-operations';

const pageSize = ref(20);
const currentPage = ref(1);
const pageCount = ref(0);
const drawerVModel = ref(false);
const readingProgressRadio = ref<number | null>(null);
const sortIconDefault = [
  { visibility: 'hidden', transform: 'rotate(0)' },
  { visibility: 'hidden', transform: 'rotate(0)' },
  { visibility: 'hidden', transform: 'rotate(0)' }
];
const sortIcon = ref<{ visibility: string, transform: string }[]>(sortIconDefault)
const sort = ref(-1);
const sortBy = ref<string | null>(null);
const sortByString = ['name', 'createTime', 'size'];

const resetBtnVShow = computed(() => {
  return readingProgressRadio.value !== null || sortBy.value !== null;
})

const resetClicked = () => {
  readingProgressRadio.value = null;
  sortBy.value = null;
  for (let i = 0; i < sortIcon.value.length; i++) {
    sortIcon.value[i].visibility = 'hidden';
    sortIcon.value[i].transform = 'rotate(0)'
  }
}

const librariesInfo = ref<Library>();
const comics = ref<Comic[]>([]);

const route = useRoute();
const router = useRouter();

watchEffect(async () => {
  let url = formatString(Api.GET_LIBRARY_COMIC_URL, route.params.id);
  url += `?pageSize=${pageSize.value}&page=${currentPage.value}`;
  if (readingProgressRadio.value !== null) {
    url += `&progress=${readingProgressRadio.value}`;
  }

  if (sortBy.value !== null) {
    url += `&orderBy=${sortBy.value}`;
    url += `&order=${sort.value}`;
  }
  const result = await axios.get(url);
  const { comics: comicData, ...librariesData } = result.data.data;
  librariesInfo.value = librariesData;
  comics.value = comicData;
  pageCount.value = Math.ceil((librariesInfo.value?.comicCount || 0) / pageSize.value)
})

const backToLibraries = () => {
  router.push({ name: 'libraries' })
}

const readingClicked = (id: number) => {
  router.push({ name: 'comicRead', params: { id } })
}

const sortItemClicked = (i: number) => {
  if (sortIcon.value[i].visibility === 'hidden') {
    sortIcon.value[i].visibility = 'visible';
    sortIcon.value[i].transform = 'rotate(0)';
    sort.value = -1;
    sortBy.value = sortByString[i];
  } else {
    sortIcon.value[i].visibility = 'visible';
    sortIcon.value[i].transform = sort.value === -1 ? 'rotate(180deg)' : 'rotate(0)';
    sort.value = sort.value === -1 ? 1 : -1;
  }

  for (let j = 0; j < sortIcon.value.length; j++) {
    if (i !== j) {
      sortIcon.value[j].visibility = 'hidden';
      sortIcon.value[j].transform = 'rotate(0)';
    }
  }
}

</script>

<template>
  <div style="padding: 5px">
    <div style="display: flex">
      <el-button type="primary" color="white" @click="backToLibraries" circle>
        <el-icon size="15">
          <Back />
        </el-icon>
      </el-button>

      <el-text style="margin-left: 10px;">{{ librariesInfo?.name }} ({{ librariesInfo?.comicCount }})</el-text>

      <el-button type="primary" @click="drawerVModel = true" color="white" style="margin: auto 0px auto auto;" circle>
        <el-icon size="15">
          <More />
        </el-icon>
      </el-button>
    </div>
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

  <el-drawer id="comicDrawer" v-model="drawerVModel" size="250px">
    <el-radio-group v-model="readingProgressRadio">
      <el-radio value="1">未读</el-radio>
      <el-radio value="2">进行中</el-radio>
      <el-radio value="3">已完成</el-radio>
    </el-radio-group>

    <hr>
    <div>
      <div class="sortItemDiv" @click="sortItemClicked(0)">
        <el-icon color="rgb(64, 158, 255)" :style="sortIcon[0]">
          <ArrowDown />
        </el-icon>
        <el-text>文件名</el-text>
      </div>
      <div class="sortItemDiv" @click="sortItemClicked(1)">
        <el-icon color="rgb(64, 158, 255)" :style="sortIcon[1]">
          <ArrowDown />
        </el-icon>
        <el-text>创建时间</el-text>
      </div>
      <div class="sortItemDiv" @click="sortItemClicked(2)">
        <el-icon color="rgb(64, 158, 255)" :style="sortIcon[2]">
          <ArrowDown />
        </el-icon>
        <el-text>文件大小</el-text>
      </div>
    </div>
    <hr>
    <el-button style="margin-left: 180px;" v-show="resetBtnVShow" @click="resetClicked" circle>
      <el-icon>
        <RefreshLeft />
      </el-icon>
    </el-button>
  </el-drawer>
</template>

<style>
#comicDrawer .el-radio {
  display: block;
  width: 100%;
}

#comicDrawer .el-radio .el-radio__label {
  margin-left: 20px;
}

.sortItemDiv {
  display: flex;
  align-items: center;
  height: 35px;
  cursor: pointer;
}

.sortItemDiv:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.sortItemDiv i {
  margin-left: 10px;
}

.sortItemDiv .el-text {
  margin-left: 20px;
}
</style>
