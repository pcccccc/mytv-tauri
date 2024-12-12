<template>
  <div class="flex flex-col">
    <div class="flex justify-between align-middle">
      <div class="text-2xl">{{ title }}</div>
      <el-button title="返回" @click.stop="handleClick"><i class="fa-solid fa-arrow-left"></i></el-button>
    </div>
    <div v-if="subTitle" class="text-sm text-gray-600	">{{ subTitle }}</div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'subTitle'])
const emit = defineEmits()

function handleClick() {
  emit('back')
}
</script>


<style scoped>

</style>