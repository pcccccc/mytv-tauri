<template>
  <router-view/>
</template>
<script setup>
import { emit, listen } from '@tauri-apps/api/event';

listen('main-to-test-channel', (event) => {
  console.log('Received message:', event)
})
</script>
<style scoped>

</style>