<script setup lang="ts">
import type { ComicDetail } from '../types/entities';
import { reactive, ref, watch } from 'vue';
import { ElInput, type FormInstance, type FormRules } from 'element-plus';
import TagInput from './TagInput.vue';

type EditComic = ComicDetail & { id: number }

const props = defineProps<{ comic: EditComic, showDialog: boolean }>()
const emit = defineEmits<{
  editCancelled: [],
  editConfirmed: [editComic: EditComic]
}>()

const show = ref(props.showDialog)

watch(() => props.showDialog, v => {
  show.value = v;
  form.name = props.comic.name
  form.authors = props.comic.authors
  form.properties = props.comic.properties
})

const form = reactive({ name: props.comic.name, authors: props.comic.authors, properties: props.comic.properties });

const propertyValidator = (r: any, value: any, callback: any) => {
  for (const property of value) {
    if (!property.values.length) {
      callback(new Error(`属性“${property.name}”需要包含至少一个值`));
      return;
    }
  }
  callback();
};

// required: true, message: '必填',
const rules = reactive<FormRules<typeof form>>({
  properties: [{ validator: propertyValidator }]
})
const formRef = ref<FormInstance>();

const confirmClicked = async (f: FormInstance | undefined) => {
  if (!f) {
    return;
  }

  await f.validate((valid, fields) => {
    if (valid) {
      emit('editConfirmed', { id: props.comic.id, ...form });
    } else {
      console.log('invalid', fields);
    }
  })
}

const beforeClose = (done: () => void) => {
  emit('editCancelled');
  done();
}

const authorRemoved = (author: string) => {
  form.authors = form.authors.filter(v => v !== author);
}


const propertyRemoved = (name: string) => {
  form.properties = form.properties.filter(v => v.name !== name);
}

const propertyValueRemoved = (values: string[], index: number) => {
  values.splice(index, 1);
}

const authorHintCondition = (v: string) => {
  return form.authors.includes(v);
}

const authorInputConfirmed = (author: string) => {
  if (author && !form.authors.includes(author)) {
    form.authors.push(author)
  }
}

const propertyValueHintCondition = (values: string[]) => {
  return (v: string) => values.includes(v);
}

const propertyValueInputConfirmed = (value: string, values: string[]) => {
  if (value && !values.includes(value)) {
    values.push(value);
  }
}

const propertyHintCondition = (property: string) => {
  const colonIndex = property.indexOf(':');
  if (colonIndex === -1) {
    return true;
  }
  const [name, value] = property.split(':');
  if (!name || !value) {
    return true;
  }
  return !!form.properties.find(v => v.name === name);
}

const propertyNameInputConfirmed = (property: string) => {
  if (property) {
    const [name, value] = property.split(':');
    if (name && value && !form.properties.find(v => v.name === name)) {
      form.properties.push({ name, values: [value] });
    }
  }
}

</script>

<template>
  <el-dialog v-model="show" title="编辑漫画" width="500" :before-close="beforeClose">
    <el-form :model="form" ref="formRef" status-icon style="width: 450px;" :rules="rules">
      <el-form-item label="名称" label-position="top" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="作者" label-position="top" prop="authors">
        <el-space wrap>
          <el-tag v-for="author in form.authors" :key="author" @close="authorRemoved(author)" closable>
            {{ author }}
          </el-tag>
          <TagInput size="small" hint="作者名不能重复" :hint-condition="authorHintCondition"
            @input-confirmed="authorInputConfirmed" />
        </el-space>
        <el-input v-model="form.authors" style="display: none;">
        </el-input>
      </el-form-item>
      <el-form-item label="属性" label-position="top" prop="properties">
        <el-scrollbar height="150px">
          <div v-for="property in form.properties" :key="property.name" style="width: 450px;">
            <div>
              <el-text>{{ property.name }}</el-text>
              <el-button style="border: 0;" @click="propertyRemoved(property.name)" circle>
                <el-icon color="red">
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <el-space wrap>
              <el-tag v-for="(value, index) in property.values" :key="value"
                @close="propertyValueRemoved(property.values, index)" closable>
                {{ value }}
              </el-tag>
              <TagInput size="small" hint="属性值不能重复" :hint-condition="propertyValueHintCondition(property.values)"
                @input-confirmed="(value) => propertyValueInputConfirmed(value, property.values)" />
            </el-space>
          </div>

        </el-scrollbar>
        <TagInput size="small" style="margin: 0 0 0 auto;" hint="新增属性需要用：分隔" :hint-condition="propertyHintCondition"
          @input-confirmed="propertyNameInputConfirmed" add-text="新增属性" />
        <el-input v-model="form.properties" style="display: none;" />
      </el-form-item>
      <el-form-item>
        <el-button @click="emit('editCancelled')">取消</el-button>
        <el-button type="primary" @click="confirmClicked(formRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="css">
.el-space .el-button {
  border: 0;
}
</style>