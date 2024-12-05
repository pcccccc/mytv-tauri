<template>
  <div class="p-3">
    <div class="flex justify-between align-middle">
      <div class="text-2xl">电视列表</div>
      <el-button title="回到首页" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></el-button>
    </div>
    <div v-loading="channels.loading" element-loading-text="正在加载频道列表...">
      <div class="flex gap-3">
        <el-switch active-text="只显示收藏"
                   inactive-text="显示全部"
                   inline-prompt
                   width="100"
                   @change="channels.changeShowFavorite"
                   v-model="channels.showFavorite"></el-switch>
        <el-switch active-text="按文件分组"
                   inactive-text="不分组"
                   inline-prompt
                   width="100"
                   @change="channels.changeGroupByFile"
                   v-model="channels.isGroupByFile"></el-switch>
      </div>
    </div>
    <el-tabs v-if="channels.isGroupByFile"
             v-model="channels.checkGroup"
             @tab-change="channels.changeShowList"
             type="card">
      <el-tab-pane v-for="item in channels.groupFileNameList" :label="item" :name="item"></el-tab-pane>
    </el-tabs>
    <div class="tv-tag-area grid grid-cols-3 auto-rows-min gap-3 overflow-auto w-full mt-5 "
         :class="{'group':channels.isGroupByFile}"
    >
      <div :key="item.tvgId"
           v-for="item in m3uInfo.showList"
           class="tv-tag h-max text-white flex flex-col rounded-md"
           @click="m3uInfo.checkItem(item)">
        <div class="flex justify-between items-center gap-3 p-2  cursor-pointer ">
          <el-image :src="item.tvgLogo||logoURL" class="tv-tag-image" fit="scale-down">
            <template #error>
              <el-image :src="logoURL" class="tv-tag-image" fit="scale-down"></el-image>
            </template>
          </el-image>
          <div class="truncate flex-1 justify-start flex items-center" :title="item.name">{{ item.name }}</div>
          <div class="cursor-pointer" @click.stop="channels.setFavorite(item)" title="收藏">
            <i class="fa-solid fa-star" v-if="m3uInfo.favoriteList.some(x=>x === item.tvgId)"></i>
            <i class="fa-regular fa-star" v-else></i>
          </div>
        </div>
        <div class="tv-tag-epg">
          <epg-list :epg="channels.findPrograms(item.tvgId)" :title="item.name"></epg-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useEPGStore from '@/store/modules/epg.js';
import useM3uStore from '@/store/modules/m3u.js';
import {computed, nextTick, onMounted, reactive} from 'vue';
import router from '@/router/index.js';
import EpgList from '@/views/channel/epgItem.vue';
import useSettingStore from "@/store/modules/setting.js";
import {openNewPlayerWindow, openNewWindow} from "@/utils/window.js";

const logoURL = new URL('@/assets/logo.jpg', import.meta.url);

const m3uStore = useM3uStore();
const epgStore = useEPGStore();
const settingStore = useSettingStore();

const m3uInfo = reactive({
  loading: false,
  list: [],
  showList: [],
  async getList() {
    channels.loading = true;
    await m3uStore.getM3uList();
    m3uInfo.list = m3uStore.m3uList;
    channels.loading = false;
  },
  checkItem(item) {
    openNewPlayerWindow("/#/play", {label: item.tvgId, title: item.name}, item)
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
    return epgStore.findPrograms(name);
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
    channels.changeShowList();
  },
  getIsShowFavorite() {
    channels.showFavorite = settingStore.showFavorite || false;
    channels.changeShowList();
  },
  isGroupByFile: false,
  groupFileNameList: computed(() => new Array(...new Set(m3uInfo.list.map(x => x.source)))),
  checkGroup: null,
  changeGroupByFile() {
    settingStore.setSetting({isGroupByFile: channels.isGroupByFile})
    channels.checkGroup = channels.groupFileNameList[0];
    channels.changeShowList();
  },
  getIsGroupByFile() {
    channels.isGroupByFile = settingStore.isGroupByFile || false;
    if (channels.isGroupByFile) {
      channels.checkGroup = channels.groupFileNameList[0];
      channels.changeShowList();
    }
  },
  loading: false,
  changeShowList() {
    // channels.loading = true;
    let showList = [];
    if (channels.showFavorite) {
      showList = m3uInfo.list.filter(x => m3uInfo.favoriteList.some(y => y === x.tvgId));
    } else {
      showList = m3uInfo.list;
    }
    if (channels.isGroupByFile) {
      showList = showList.filter(x => x.source == channels.checkGroup);
    }
    m3uInfo.showList = showList;
    // nextTick(() => {
    //   channels.loading = false;
    // })
  }
});

onMounted(async () => {
  channels.getFavorite();
  await epgInfo.getList();
  await m3uInfo.getList();
  channels.getIsShowFavorite();
  channels.getIsGroupByFile();
  channels.changeShowList();
});
</script>

<style scoped>
.tv-tag-area {
  height: calc(100vh - 108px);

  &.group {
    height: calc(100vh - 144px);
    margin-top: 0;
  }

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