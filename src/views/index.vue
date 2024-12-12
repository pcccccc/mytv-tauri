<template>
  <div class="main flex flex-col items-center w-full overflow-auto gap-5 p-3 mt-3">
    <div class="text-4xl">我的电视</div>
    <div class="flex gap-3">
      <el-button @click="toChannels">频道</el-button>
      <el-button @click="toSetting">设置</el-button>
      <el-button @click="toInfo">你点着试试</el-button>
    </div>
    <div class="w-4/5">
      <el-divider><i class="fa-solid fa-star text-2xl text-yellow-500"></i></el-divider>
      <div class="w-full grid grid-cols-2 gap-3">
        <channel-item :channel-info="item"
                      :key="item.tvgId"
                      v-for="item in showList"
                      :epg-list="epgStore.findPrograms(item.tvgId)"></channel-item>
      </div>
    </div>
  </div>
</template>

<script setup name="main">
import router from "../router/index.js";
import {computed, onMounted, onUnmounted, reactive} from "vue";
import useM3uStore from "@/store/modules/m3u.js";
import useEPGStore from "@/store/modules/epg.js";
import useSettingStore from "@/store/modules/setting.js";
import ChannelItem from "@/components/channelItem.vue";

import {load} from "@tauri-apps/plugin-store";

const m3uStore = useM3uStore();
const epgStore = useEPGStore();
const settingStore = useSettingStore();
const showList = computed(() => m3uStore.m3uList.filter(x => settingStore.favoriteList.some(y => y === x.tvgId)))


const toSetting = () => {
  router.push("/setting")
}

const toInfo = () => {
  router.push("/info")
}

const toChannels = () => {
  router.push("/channels")
}

const indexReactive = reactive({
  epgList: [],
  m3uList: [],
  async init() {
    // await epgStore.getEPGList();
    // await m3uStore.getM3uList();
    indexReactive.m3uList = m3uStore.m3uList.filter(x => settingStore.favoriteList.some(y => y === x.tvgId));
  }
})

onMounted(() => {
  indexReactive.init()
})

onUnmounted(() => {
  // 删除playInfo.json的store
  load('playInfo.json', {autoSave: false}).then(store => store.clear())
})
</script>

<style rel="stylesheet/scss" lang="scss">
.main {
}
</style>