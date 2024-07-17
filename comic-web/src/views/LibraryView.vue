<script setup lang="ts">
import { ref, watchEffect, watch, reactive, computed } from 'vue';
import LibraryInfoCard from '../components/LibraryInfoCard.vue'
import axios from 'axios';
import { Operation, Plus } from '@element-plus/icons-vue';
import { ElMessage, type FormRules, type FormInstance } from 'element-plus';
import type { Library } from '../types/entities';
import { errorType } from '../types/errorType';
import { Api } from '../types/api'
import { formatString } from 'typescript-string-operations';

const libraries = ref<Library[]>([]);
const createLibraryDialog = ref(false);
const selectDirDialog = ref(false);
const selectLibraryPath = ref('');
const dirsOfDir = ref<string[]>([])
const libraryForm = reactive({ name: '', path: '' });
const editLibraryId = ref(0);
const libraryDialogTitle = computed(() => {
  return editLibraryId.value ? '编辑库' : '添加库'
})

const nameValidator = (r: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('必填'))
    return;
  }
  callback();
};

const pathValidator = (r: any, value: any, callback: any) => {
  if (editLibraryId.value) {
    callback();
    return;
  }
  if (value === '') {
    callback(new Error('必填'))
    return;
  }
  callback();
};

// required: true, message: '必填',
const libraryRules = reactive<FormRules<typeof libraryForm>>({
  name: [{ validator: nameValidator, trigger: 'blur' }],
  path: [{ validator: pathValidator, trigger: 'blur' }],
})
const ruleFormRef = ref<FormInstance>();
watchEffect(async () => {
  const result = await axios.get(`${Api.GET_LIBRARY_URL}`);
  libraries.value = result.data.data.libraries;
})

watch(selectLibraryPath, async (value) => {
  const result = await axios.get(`${Api.GET_FILESYSTEM_URL}?dir=${value}`);
  dirsOfDir.value = result.data.data.dirs;
})

const backToParentDir = () => {
  if (selectLibraryPath.value !== '/') {
    const lastIndex = selectLibraryPath.value.lastIndexOf('/');
    selectLibraryPath.value = lastIndex === 0 ? '/' : selectLibraryPath.value.slice(0, lastIndex);
  }
}

const jumpToChildDir = (child: string) => {
  selectLibraryPath.value += selectLibraryPath.value === '/' ? child : `/${child}`;
}

const createLibraryRequest = async () => {
  try {
    const result = await axios.post<{ code: Number, data: { id: number, comicCount: number } }>(Api.CREATE_LIBRARY_URL, { name: libraryForm.name, path: libraryForm.path });
    console.log('result', result.data)
    if (result.data.code !== 0) {
      switch (result.data.code) {
        case errorType.System_Path_Not_Exist:
          ElMessage.error(`文件夹路径不存在，请选择其他路径`)
          break;
        default:
          ElMessage.error(`创建失败，未知错误`)
      }
      return;
    }

    const { id, comicCount } = result.data.data;
    libraries.value.push({ id, comicCount, name: libraryForm.name })
    createLibraryDialog.value = false;
  } catch (err: any) {
    ElMessage.error(`服务错误：${err.message}`)
  }
}

const updateLibraryRequest = async () => {
  try {
    const result = await axios.put(formatString(Api.UPDATE_LIBRARY_URL, editLibraryId.value), { name: libraryForm.name });
    if (result.data.code !== 0) {
      switch (result.data.code) {
        default:
          ElMessage.error(`创建失败，未知错误`)
      }
      return;
    }

    const libraryInLibraries = libraries.value.find(v => v.id === editLibraryId.value);
    if (libraryInLibraries) {
      console.log('libraryInLibraries', libraryInLibraries)
      libraryInLibraries.name = libraryForm.name;
    }
    createLibraryDialog.value = false;
    editLibraryId.value = 0;
  } catch (err: any) {
    ElMessage.error(`服务错误：${err.message}`)
  }
}

const createLibrary = async (f: FormInstance | undefined) => {
  if (!f) {
    return;
  }

  await f.validate((valid, fields) => {
    if (valid) {
      if (editLibraryId.value) {
        updateLibraryRequest();
      } else {
        createLibraryRequest();
      }

    } else {
      console.log('invalid', fields);
    }
  })
}

const editLibrary = async (id: number) => {
  createLibraryDialog.value = true;
  editLibraryId.value = id;
}

const refreshLibrary = async (id: number) => {
  try {
    await axios.put(formatString(Api.REFRESH_LIBRARY_URL, id));
  } catch (err: any) {
    ElMessage.error(`服务错误：${err.message}`)
  }
}

const deleteLibrary = async (id: number) => {
  try {
    const result = await axios.delete(formatString(Api.DELETE_LIBRARY_URL, id));
    if (result.data.code === 0) {
      libraries.value = libraries.value.filter(v => v.id !== id);
    }
  } catch (err: any) {
    ElMessage.error(`服务错误：${err.message}`)
  }
}

</script>

<template>
  <div style="padding: 5px">
    <div style="display: flex;">
      <el-text style="margin-left: 0;">漫画库</el-text>
      <el-button type="primary" color="white" style="margin: auto 0px auto auto;" @click="createLibraryDialog = true"
        circle>
        <el-icon size="15">
          <Plus />
        </el-icon>
      </el-button>
      <el-button type="primary" color="white" style="margin-right: 10px;" circle>
        <el-icon size="15">
          <More />
        </el-icon>
      </el-button>
    </div>
    <hr>
  </div>
  <el-space size="large" wrap>
    <LibraryInfoCard v-for="item in libraries" style="margin: auto;" :name="item.name" :cover="item.cover" :id="item.id"
      :key="item.id" :comic-count="item.comicCount" :last-visit-time="item.lastVisitTime" @edit-clicked="editLibrary"
      @refresh-clicked="refreshLibrary" @delete-clicked="deleteLibrary" />
  </el-space>

  <el-dialog v-model="createLibraryDialog" :title="libraryDialogTitle" width="500">
    <el-form :model="libraryForm" ref="ruleFormRef" status-icon style="width: 450px;" :rules="libraryRules"
      @validate="() => console.log('validate')">
      <el-form-item label="名称" label-position="top" prop="name">
        <el-input v-model="libraryForm.name" />
      </el-form-item>
      <el-form-item label="文件夹路径" v-show="!editLibraryId" label-position="top" prop="path">
        <el-input v-model="libraryForm.path">
          <template #append>
            <el-button @click="(selectDirDialog = true) && (selectLibraryPath = '/')">
              <el-icon>
                <Folder />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="createLibraryDialog = false">取消</el-button>
        <el-button type="primary" @click="createLibrary(ruleFormRef)">确定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="selectDirDialog" width=400 height=800 title="选择一个文件夹" append-to-body>
      <el-text>{{ selectLibraryPath }}</el-text>
      <hr />
      <el-scrollbar height="350px">
        <el-card>
          <el-space direction="vertical" alignment="start" :size="1">
            <div class="dirDiv" @click="backToParentDir" v-show="selectLibraryPath !== '/'">
              <el-icon size="24">
                <Back />
              </el-icon>
              <el-text style="margin-left: 20px; display: inline-block; color: black;">父文件夹</el-text>
            </div>
            <div class="dirDiv" v-for="dir in dirsOfDir" :key="dir" @click="jumpToChildDir(dir)">
              <el-icon size="24">
                <Folder />
              </el-icon>
              <el-text style="margin-left: 20px; display: inline-block; color: black;"> {{ dir }} </el-text>
            </div>
          </el-space>
        </el-card>
      </el-scrollbar>

      <template #footer>
        <el-button @click="selectDirDialog = false">取消</el-button>
        <el-button @click="(libraryForm.path = selectLibraryPath) && (selectDirDialog = false)"
          type="primary">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
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
