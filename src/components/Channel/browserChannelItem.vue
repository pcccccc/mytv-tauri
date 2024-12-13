<template>

</template>

<script setup>
import { listen } from '@tauri-apps/api/event';

listen('from_window_a', (event) => {
  console.log('Received message in Window B:', event.payload);
});
</script>

<style scoped>

</style>