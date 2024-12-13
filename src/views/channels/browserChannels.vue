<template>
  <div class="p-3">
    <kaze-header title="网页电视列表" sub-title="由于技术限制，所有播放的操作将统一在此管理" @back="router.back"></kaze-header>
    <div @click="openWindow">?</div>
  </div>
</template>

<style scoped>

</style>
<script setup>
import KazeHeader from "@/components/Header/index.vue";
import router from "@/router/index.js";
import {openNewWindow} from "@/utils/window.js";
import { emit, listen } from '@tauri-apps/api/event';

function openWindow() {
  let webview = openNewWindow('/#/browserPlayer', {
    label: 'test',
    width: 1280,
    height: 720,
    center: true,
    focus: true,
    visible: true,
  })
  webview.once('tauri://created', function () {
    emit('main-to-test-channel', {
      type: 'greeting',
      content: '你好，test窗口！'
    })
  })
}

onMounted(() => {

})
</script>