<script setup lang="ts">
import { Back, Collection, Reading, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

</script>

<template>
  <el-text style="font-size: 30px; margin: 10px 20px; display: inline-block;">漫画</el-text>
  <hr>
  <div>
    <div class="menuItem">
      <el-icon class="menuIcon" size="27">
        <Reading />
      </el-icon>
      <el-text class="menuText" size="large">漫画库</el-text>
    </div>
    <div class="menuItem">
      <el-icon class="menuIcon" size="27">
        <Collection />
      </el-icon>
      <el-text class="menuText" size="large">收藏</el-text>
    </div>
  </div>
</template>

<style lang="css">
.menuItem {
  margin: 0;
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menuItem:hover {
  background-color: lightgray;
}

.menuIcon {
  margin-left: 20px;
}

.menuText {
  margin-left: 30px;
}
</style>