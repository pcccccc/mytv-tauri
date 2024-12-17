<template>
  <div class="p-3">
    <kaze-header title="网页电视列表"
                 @back="router.back"></kaze-header>
    <div class=" grid grid-cols-3 auto-rows-min gap-3 overflow-auto w-full mt-5  ">
      <channel-default-card v-for="item in defaultTVList" :channel-info="item"
                            @page:loaded="pageInject"
                            @handel:fullScenes="handelWindow.fullScenes"></channel-default-card>
    </div>
  </div>
</template>

<style scoped>

</style>
<script setup>
import KazeHeader from "@/components/Header/index.vue";
import router from "@/router/index.js";
import {defaultTVList} from "@/constant/defaultTVList.js";
import ChannelDefaultCard from "@/components/Channel/channelDefaultCard.vue";
import {InjectJSClass} from "@/utils/injectJSClass.js";
import {listen} from "@tauri-apps/api/event";
import {Window} from "@tauri-apps/api/window";

const pageInject = (label, channelInfo) => {
  new InjectJSClass(label, channelInfo)
}

const handelWindow = reactive({
  async initListen() {
    await listen('listen-channel-default-event', async (event) => {
      // 设置全屏
      if (event.payload && event.payload.type == "full") {
        const mainWindow = await Window.getByLabel(event.payload.label);
        if (event.payload.isFullscreen) {
          mainWindow.setFullscreen(false);
        } else {
          mainWindow.setFullscreen(true);
        }
      }
    });
  },
  fullScenes() {

  }
})

onMounted(() => {
  handelWindow.initListen();
})
</script>