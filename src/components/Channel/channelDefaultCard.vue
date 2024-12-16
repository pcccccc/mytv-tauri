<template>
  <div class="browser-channel-item flex justify-start items-start p-3 text-white relative rounded-md cursor-pointer"
       @click="openChannel">
    {{ channelInfo.name }}
    <el-image class="bottom-[-40px] left-[-20px] w-[200px] opacity-20" :src="channelInfo.logo"/>
  </div>
</template>

<script setup>
import {openNewBrowserWindow} from "@/utils/windowUtils.js";
import {listen} from "@tauri-apps/api/event"

let props = defineProps(['channelInfo'])
let emit = defineEmits();

let openChannel = async () => {
  await openNewBrowserWindow(props.channelInfo);

  // 监听页面是否加载完毕
  await listen('page-loaded-event', async (event) => {
    let channelInfo = JSON.parse(event.payload.info);
    if (props.channelInfo.id != channelInfo.id) {
      return;
    }
    emit('page:loaded', event.payload.label, channelInfo)
  });
}
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