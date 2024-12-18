<template>
  <div class="p-3">
    <kaze-header title="电视列表"
                 sub-title="这是订阅地址所展示的频道列表，可能由于地址过期或您的网络处于IPv4等，无法正常播放。"
                 @back="router.back()"></kaze-header>
    <div v-loading="channels.loading" element-loading-text="正在加载频道列表...">
      <div class="flex gap-3">
        <el-switch active-text="只显示收藏"
                   inactive-text="显示全部"
                   inline-prompt
                   width="100"
                   @change="channels.changeShowFavorite"
                   v-model="settingStore.showFavorite"/>
        <el-switch active-text="按文件分组"
                   inactive-text="不分组"
                   inline-prompt
                   width="100"
                   @change="channels.changeGroupByFile"
                   v-model="settingStore.isGroupByFile"/>
      </div>
    </div>
    <el-tabs v-if="settingStore.isGroupByFile"
             v-model="channels.checkGroup"
             @tab-change="channels.changeShowList"
             type="card">
      <el-tab-pane v-for="item in channels.groupFileNameList" :label="item" :name="item"/>
    </el-tabs>
    <div class="tv-tag-area grid grid-cols-3 auto-rows-min gap-3 overflow-auto w-full mt-5 rounded"
         :class="{'group':settingStore.isGroupByFile}"
    >
      <channel-subscription-card
          :channel-info="item"
          :key="item.tvgId"
          v-for="item in m3uInfo.showList"/>
    </div>
  </div>
</template>

<script setup>
import useEPGStore from '@/store/modules/epg.js';
import useM3uStore from '@/store/modules/m3u.js';
import {computed, nextTick, onMounted, reactive} from 'vue';
import router from '@/router/index.js';
import Index from '@/components/Epg/index.vue';
import useSettingStore from "@/store/modules/setting.js";
import ChannelSubscriptionCard from "@/components/Channel/channelSubscriptionCard.vue";
import KazeHeader from "@/components/Header/index";


const logoURL = new URL('@/assets/logo.jpg', import.meta.url);

const m3uStore = useM3uStore();
const epgStore = useEPGStore();
const settingStore = useSettingStore();

const m3uInfo = reactive({
  loading: false,
  showList: []
});
const channels = reactive({
  findPrograms(name) {
    return epgStore.findPrograms(name);
  },
  getFavorite() {
    return settingStore.favoriteList;
  },
  changeShowFavorite() {
    settingStore.setSetting({showFavorite: settingStore.showFavorite});
    channels.changeShowList();
  },
  getIsShowFavorite() {
    settingStore.showFavorite = settingStore.showFavorite || false;
    channels.changeShowList();
  },
  groupFileNameList: computed(() => new Array(...new Set(m3uStore.m3uList.map(x => x.source)))),
  checkGroup: null,
  changeGroupByFile() {
    settingStore.setSetting({isGroupByFile: settingStore.isGroupByFile})
    channels.checkGroup = channels.groupFileNameList[0];
    channels.changeShowList();
  },
  getIsGroupByFile() {
    settingStore.isGroupByFile = settingStore.isGroupByFile || false;
    if (settingStore.isGroupByFile) {
      channels.checkGroup = channels.groupFileNameList[0];
      channels.changeShowList();
    }
  },
  loading: false,
  changeShowList() {
    // channels.loading = true;
    let showList = [];
    if (settingStore.showFavorite) {
      showList = m3uStore.m3uList.filter(x => settingStore.favoriteList.some(y => y === x.labelId));
    } else {
      showList = m3uStore.m3uList;
    }
    if (settingStore.isGroupByFile) {
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
  channels.getIsShowFavorite();
  channels.getIsGroupByFile();
  channels.changeShowList();
});
</script>

<style scoped>
.tv-tag-area {
  height: calc(100vh - 128px);

  &.group {
    height: calc(100vh - 144px);
    margin-top: 0;
  }
}
</style>