<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { Back, DArrowLeft, DArrowRight, MoreFilled } from '@element-plus/icons-vue'

const props = defineProps<{ id: string }>()

const page = ref<number>();
const imageFit = ref('contain')
const showTopMenu = ref(false)
const showBottomMenu = ref(false)
const parentDiv = ref(null)
// const route = useRoute();
const router = useRouter();
const comic = ref<{ id: number, name: string, pageCount: number, readingProgress: number, libraryId: number, librariesName: string }>();

watchEffect(async () => {
  const API_COMIC_PROGRESS_URL = `/api/comics/${props.id}/progress`
  const result = await axios.get(`${API_COMIC_PROGRESS_URL}`);
  comic.value = result.data.data;
  if (!comic.value?.readingProgress) {
    page.value = 1;
  } else {
    page.value = comic.value.readingProgress;
  }
})

watch(page, async (newPage: number | undefined) => {
  const API_UPDATE_PROGRESS_URL = `/api/comics/${props.id}/progress`
  const result = await axios.put(`${API_UPDATE_PROGRESS_URL}`, { page: newPage });
  console.log('update progress', result)
})

const imageSrc = computed(() => {
  return `/api/comics/${props.id}/page/${page.value}`
})

const backToComic = () => {
  router.push({ name: 'comic', params: { id: comic.value?.libraryId, comicId: comic.value?.id } });
}

const openMenu = () => {

}

const goPreComic = () => {

}

const goNextComic = () => {

}

const goNext = () => {
  if (comic.value && page.value) {
    if (page.value < comic.value?.pageCount) {
      page.value++;
    } else {
      goPreComic();
    }
  }
}

const goPre = () => {
  if (page.value) {
    if (page.value > 1) {
      page.value--;
    } else {
      goPreComic();
    }
  }
}

const onSlideChange = (value: number[]) => {
  console.log('change', value)
}

const onMouseClick = (event: MouseEvent) => {
  if (parentDiv.value) {
    const { clientWidth, clientHeight } = parentDiv.value;
    if (event.y > 50 && event.y < clientHeight - 50) {
      const leftDivider = clientWidth / 3;
      const rightDivider = 2 * clientWidth / 3;
      if (event.x > leftDivider && event.x < rightDivider) {
        showTopMenu.value = !showTopMenu.value;
        showBottomMenu.value = !showBottomMenu.value;
      } else if (event.x <= leftDivider) {
        goPre();
      } else {
        goNext();
      }
    }
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      goPre();
      break;
    case 'ArrowRight':
      goNext();
      break;
    default:
      break
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeyDown)
})

</script>

<template>
  <div id="parent" @click="onMouseClick" ref="parentDiv">
    <el-image :src="imageSrc" :fit="imageFit" style="height: 100%; width: 100%;" />

    <div id="topMenu" v-show="showTopMenu">
      <el-button circle color="white" style="margin: 0 10px" @click="backToComic">
        <el-icon size="24">
          <Back />
        </el-icon>
      </el-button>

      <el-space wrap size="large">
        <el-text size="large">{{ comic?.librariesName }}</el-text>
        <el-text size="large">{{ comic?.name }}</el-text>
      </el-space>


      <el-button circle color="white" style="margin: auto 15px auto auto" @click="openMenu">
        <el-icon size="24">
          <MoreFilled />
        </el-icon>
      </el-button>
    </div>

    <div id="bottomMenu" v-show="showBottomMenu">
      <el-button id="preComic" circle color="white" @click="goPreComic">
        <el-icon size="24">
          <DArrowLeft />
        </el-icon>
      </el-button>
      <el-slider style="margin: 0 15px 0 20px;" v-model="page" :min="1" :max="comic?.pageCount" @change="onSlideChange"
        size="large" />
      <el-text style="margin-right: 10px;">{{ comic?.pageCount }}</el-text>
      <el-button id="nextComic" circle color="white" @click="goNextComic">
        <el-icon size="24">
          <DArrowRight />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<style>
#app {
  height: 100vh;
}

body {
  margin: 0;
}

#parent {
  background-color: black;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#topMenu {
  height: 50px;
  background-color: white;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

#bottomMenu {
  background-color: white;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  position: absolute;
  display: flex;
  align-items: center;
}

#preComic {
  margin-left: 10px;
  color: rgb(64, 158, 255);
}

#nextComic {
  margin-right: 10px;
  color: rgb(64, 158, 255);
}
</style>
