<template>
  <div class="browser-channel-item  p-3 text-white relative rounded-md cursor-pointer"
       @click="openNewBrowserWindow(channelInfo)">
    <div class="flex justify-between items-center">
      <div class="truncate">
        {{ channelInfo.name }}
      </div>
      <div title="去网站" @click.stop="openBrowser(channelInfo.url)">
        <i class="fa-solid fa-link"></i>
      </div>
    </div>
    <el-image class="bottom-3 right-3 w-[80px] opacity-20" :src="channelInfo.logo"/>
  </div>
</template>

<script setup>
import {openBrowser, openNewBrowserWindow} from "@/utils/windowUtils.js";
import {listen} from "@tauri-apps/api/event"

let props = defineProps(['channelInfo'])
let emit = defineEmits();
let unListen = ref(null);

onMounted(async () => {
  unListen.value = await listen('page-loaded-event', async (event) => {
    let channelInfo = JSON.parse(event.payload.info);
    if (props.channelInfo.id != channelInfo.id) {
      return;
    }
    emit('page:loaded', event.payload.label, channelInfo)
  });
})

onUnmounted(() => {
  if (unListen.value)
    unListen.value()
})
</script>

<style scoped>
.browser-channel-item {
  width: 250px;
  height: 100px;
  background: #4C4C4C;
  overflow: hidden;

  .el-image {
    opacity: 0.1;
    position: absolute;
  }
}
</style>