<template>
  <div :key="channelInfo.tvgId"
       class="tv-tag h-max text-white flex flex-col rounded-md relative overflow-hidden"
  >
    <el-image :src="channelInfo.tvgLogo||logoURL"
              class="tv-tag-image bottom-3 right-3 w-[80px] opacity-20">
      <template #error>
      </template>
    </el-image>
    <div class="flex justify-between items-center gap-3 p-2  cursor-pointer" @click="checkItem">
      <div class="truncate flex-1 justify-start flex items-center" :title="channelInfo.name">{{
          channelInfo.name
        }}
      </div>
      <div class="cursor-pointer" @click.stop="setFavorite(channelInfo)" title="收藏">
        <i class="fa-solid fa-star" v-if="settingStore.favoriteList.some(x=>x === channelInfo.labelId)"></i>
        <i class="fa-regular fa-star" v-else></i>
      </div>
    </div>
    <div class="tv-tag-epg">
      <epg :channel-info="channelInfo"></epg>
    </div>
  </div>
</template>
<script setup>
import Epg from "@/components/Epg/index.vue";
import {openNewPlayerWindow} from "@/utils/windowUtils.js";
import useSettingStore from "@/store/modules/setting.js";

const logoURL = new URL('@/assets/logo.png', import.meta.url);
const props = defineProps(['channelInfo']);
const settingStore = useSettingStore();

function checkItem() {
  openNewPlayerWindow("/#/player", {label: props.channelInfo.labelId, title: props.channelInfo.name}, props.channelInfo)
}

function setFavorite(item) {
  if (settingStore.favoriteList.some(x => x === item.labelId)) {
    settingStore.favoriteList = settingStore.favoriteList.filter(x => x !== item.labelId)
  } else {
    settingStore.favoriteList.push(item.labelId)
  }
  settingStore.setSetting({favoriteList: settingStore.favoriteList})
}
</script>
<style scoped>
.tv-tag {
  background: #4C4C4C;
  min-width: 250px;
  transition: all 0.5s;

  .tv-tag-image {
    position: absolute;
  }

  .tv-tag-title {
  }
}
</style>