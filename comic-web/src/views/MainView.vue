<script setup lang="ts">
import SearchCard from '../components/SearchCard.vue';
import MainSidebar from '../components/MainSidebar.vue';
const foldAside = () => {

}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <MainSidebar />
    </el-aside>
    <el-container>
      <el-header>
        <SearchCard @foldAside="foldAside" />
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
body {
  margin: 0;
}
</style>