<template>
  <div class="main flex flex-col justify-center items-center w-full h-[100vh] gap-5 p-3">
    <div class="text-4xl">悦视</div>
    <div class="flex gap-3">
      <el-button @click="btn2">频道</el-button>
      <el-button @click="btn">设置</el-button>
    </div>
    <div class="w-4/5">
      <el-divider><i class="fa-solid fa-star text-2xl text-yellow-500"></i></el-divider>
      <div class="w-full">

      </div>
    </div>
  </div>
</template>

<script setup name="main">
import router from "../router/index.js";
import EpgList from "@/views/channel/epgItem.vue";
import {onMounted, reactive} from "vue";
import useM3uStore from "@/store/modules/m3u.js";
import useEPGStore from "@/store/modules/epg.js";
import useSettingStore from "@/store/modules/setting.js";

const m3uStore = useM3uStore();
const epgStore = useEPGStore();
const settingStore = useSettingStore();



const btn = () => {
  router.push("/setting")
}

const btn2 = () => {
  router.push("/channels")
}

const indexReactive = reactive({
  epgList: [],
  m3uList: [],
  async init() {
    await epgStore.getEPGList();
    await m3uStore.getM3uList();
    indexReactive.m3uList = m3uStore.m3uList.filter(x => settingStore.favoriteList.some(y => y === x.tvgId));
  }
})

onMounted(() => {
  indexReactive.init()
})

</script>

<style rel="stylesheet/scss" lang="scss">
.main {
}
</style>