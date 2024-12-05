<template>
  <div class="main">
    <div @click="btn">去设置</div>
    <div @click="btn2">去电视列表</div>
    <div @click="btn3">去播放器</div>
    <div @click="btn4">打开新的窗口</div>
    <div @click="btn5">打开新的页面</div>
  </div>
</template>

<script setup name="main">
import router from "../router/index.js";
import {useRoute} from "vue-router";

const route = useRoute()

const btn = () => {
  router.push("/setting")
}

const btn2 = () => {
  router.push("/channels")
}
const btn3 = () => {
  router.push("/play")
}

const btn4 = async () => {

}
const btn5 = () => {
  router.push("/haha")
}
</script>

<style rel="stylesheet/scss" lang="scss">
.main {
}
</style>