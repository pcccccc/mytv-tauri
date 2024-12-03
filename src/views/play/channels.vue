<template>
  <div class="p-3">
    <div class="flex justify-between align-middle">
      <div class="text-2xl">电视列表</div>
      <el-button title="回到首页" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></el-button>
    </div>
    <div>
      <div class="flex gap-3">
        <el-switch active-text="只显示收藏"
                   inactive-text="显示全部"
                   inline-prompt
                   width="100"
                   @change="channels.changeShowFavorite"
                   v-model="channels.showFavorite"></el-switch>
      </div>
    </div>
    <div class="tv-tag-area overflow-auto grid grid-cols-3 flex-wrap gap-3 justify-around w100 mt-5">
      <div v-for="item in m3uInfo.list"
           class="tv-tag h-max text-white flex flex-col rounded-md"
           @click="m3uInfo.checkItem(item)">
        <div class="flex justify-between items-center gap-3 p-2  cursor-pointer ">
          <el-image v-if="item.tvgLogo" :src="item.tvgLogo" class="tv-tag-image p-1" fit="scale-down">
            <template #error>
              ??
            </template>
          </el-image>
          <div class="truncate flex-1 justify-start flex items-center" :title="item.name">{{ item.name }}</div>
          <div class="cursor-pointer" @click.stop="channels.setFavorite(item)" title="收藏">
            <i class="fa-solid fa-star" v-if="m3uInfo.favoriteList.some(x=>x === item.tvgId)"></i>
            <i class="fa-regular fa-star" v-else></i>
          </div>
        </div>
        <div class="tv-tag-epg">
          <epg-list :epg="channels.findPrograms(item.tvgId)"></epg-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEPGStore from '@/store/modules/epg.js';
import useM3uStore from '@/store/modules/m3u.js';
import {onMounted, reactive} from 'vue';
import router from '@/router/index.js';
import EpgList from '@/views/play/epgItem.vue';
import useSettingStore from "@/store/modules/setting.js";
import setting from "@/store/modules/setting.js";

const m3uStore = useM3uStore();
const epgStore = useEPGStore();
const settingStore = useSettingStore();

const m3uInfo = reactive({
  list: [],
  async getList() {
    let list = await m3uStore.getM3uList();
    if (channels.showFavorite) {
      m3uInfo.list = list.filter(x => m3uInfo.favoriteList.some(y => y === x.tvgId));
    } else {
      m3uInfo.list = list;
    }
  },
  checkItem(item) {
    // todo 打开新的播放窗口播放
  },
  favoriteList: [],

});
const epgInfo = reactive({
  async getList() {
    await epgStore.getEPGList();
  }
});
const channels = reactive({
  findPrograms(name) {
    let a = epgStore.findPrograms(name);
    return a;
  },
  getFavorite() {
    m3uInfo.favoriteList = settingStore.favoriteList || [];
  },
  setFavorite(item) {
    if (m3uInfo.favoriteList.some(x => x === item.tvgId)) {
      m3uInfo.favoriteList = m3uInfo.favoriteList.filter(x => x !== item.tvgId)
    } else {
      m3uInfo.favoriteList.push(item.tvgId)
    }
    settingStore.setSetting({favoriteList: m3uInfo.favoriteList})
  },
  showFavorite: false,
  changeShowFavorite() {
    settingStore.setSetting({showFavorite: channels.showFavorite});
    m3uInfo.getList();
  },
  getIsShowFavorite() {
    channels.showFavorite = settingStore.showFavorite || false;
  }
});

onMounted(async () => {
  channels.getFavorite();
  channels.getIsShowFavorite()
  await epgInfo.getList();
  await m3uInfo.getList();
});
</script>

<style scoped>
.tv-tag-area {
  height: calc(100vh - 108px);

  .tv-tag {
    background: #4C4C4C;
    min-width: 200px;
    transition: all 0.5s;

    .tv-tag-image {
      width: 70px;
      height: 40px;
    }

    .tv-tag-title {
    }
  }
}
</style>