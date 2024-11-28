<template>
  <div class="main">
    <div @click="btn">去设置</div>
    <div @click="btn2">去播放器</div>
  </div>
</template>

<script setup name="main">
import router from "../router/index.js";

const btn = () => {
  router.push("/setting")
}
const btn2 = () => {
  router.push("/play")
}
</script>

<style rel="stylesheet/scss" lang="scss">
.main {
}
</style>