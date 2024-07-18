<script setup lang="ts">
import type { Library } from '@/types/entities';
import { More } from '@element-plus/icons-vue';
import { RouterLink, useRouter } from 'vue-router';
const props = defineProps<Library>()
const emit = defineEmits<{
  editClicked: [id: number],
  refreshClicked: [id: number],
  deleteClicked: [id: number],
}>()

const router = useRouter();

const libraryClicked = () => {
  router.push({ name: 'libraryComic', params: { id: props.id } })
}

const editIconClicked = (e: MouseEvent) => {
  e.stopPropagation();
  emit('editClicked', props.id)
}

const moreIconClicked = (e: MouseEvent) => {
  e.stopPropagation();
}

const libraryDropDown = (command: string) => {
  switch (command) {
    case 'refresh': {
      emit('refreshClicked', props.id);
      break;
    }
    case 'delete': {
      emit('deleteClicked', props.id);
      break;
    }
    default:
      break;
  }
}
</script>

<template>
  <el-card style="width: 150px; height: 250px;" class="card">
    <div id="libraryDiv" @click="libraryClicked">
      <el-image style="width: 150px; height: 214px" :src="cover" fit="contain" />
      <div style="position: absolute; top: 0px; right: 0px; background-color: orange;">
        <el-text style="color: white;padding: 5px;">{{ comicCount }}</el-text>
      </div>
      <el-icon id="editIcon" size=28 @click="editIconClicked">
        <Edit />
      </el-icon>

      <el-dropdown trigger="click" @command="libraryDropDown">
        <el-icon size=28 @click="moreIconClicked">
          <More />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">刷新</el-dropdown-item>
            <el-dropdown-item command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
    <RouterLink :to="{ name: 'libraryComic', params: { id } }">
      <el-text class="el-link" style="margin: 5px;" truncated>{{ name }}</el-text>
    </RouterLink>
  </el-card>
</template>

<style lang="css">
#libraryDiv {
  position: relative;
}

#libraryDiv:hover {
  cursor: pointer;
}

#libraryDiv:hover::after {
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

#libraryDiv i {
  display: none;
}

#libraryDiv:hover #editIcon {
  position: absolute;
  display: initial;
  z-index: 200;
  left: 20px;
  bottom: 20px;
  color: white
}

#libraryDiv:hover .el-dropdown {
  position: absolute;
  display: initial;
  z-index: 200;
  right: 20px;
  bottom: 20px;
  color: transparent
}

#libraryDiv:hover .el-dropdown i {
  display: initial;
  color: white
}
</style>