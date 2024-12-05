<script setup>
import {load} from '@tauri-apps/plugin-store';
import {onMounted, ref} from "vue";

let a = ref('')
onMounted(async () => {
  const store = await load('store.json', {autoSave: false});
  a.value = await store.get('windowState');
})
</script>

<template>
  我是傻逼
  {{ a }}
</template>

<style scoped>

</style>