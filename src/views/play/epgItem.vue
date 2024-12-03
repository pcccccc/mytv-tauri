<template>
  <div class="epg-list flex flex-col text-xs p-1" v-if="epg.now">
    <div :title="epg.now.title" class="peg-list-now px-1 py-1 truncate rounded-md p-1">
      正在播放：{{ epg.now.title }}
    </div>
    <div :title="epg.now.title" class="peg-list-next px-1 py-1 truncate rounded-md p-1">
      即将播放：{{ epg.next.title }}
    </div>
    <div class="w100 text-right cursor-pointer" @click="epg.showAllEpg">查看全部节目单</div>
    <el-dialog title="全部节目" v-model="epg.isShowAllEpg" align-center destroy-on-close>
      <div class="flex flex-col gap-3 all-epg-dialog">
        <div v-for="item in epg.epgList" class="p-3 all-epg-item rounded-md text-white"
             :class="{'now-playing':item.status == 0}">
          <div class="flex items-center justify-between">
            <el-tag type="warning" v-if="item.status == -1">已播放</el-tag>
            <el-tag type="success" v-if="item.status == 0">播放中</el-tag>
            <el-tag v-if="item.status == 1">未开始</el-tag>
            <div>{{ item.start }}</div>
          </div>
          <div class="mt-2">{{ item.title }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
  <div v-else class="epg-list h-full flex items-center justify-center text-sm">
    没有找到节目单
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive} from 'vue';
import {currentAndNextProgram, markProgramStatus} from '@/common/epg.js';

let props = defineProps(['epg']);
let epg = reactive({
  now: {},
  next: {},
  epgList: [],
  isShowAllEpg: false,
  showAllEpg() {
    epg.epgList = markProgramStatus(props.epg);
    this.isShowAllEpg = true;
    nextTick(() => {
      const nowPlayingElement = document.querySelector('.now-playing');
      if (nowPlayingElement) {
        nowPlayingElement.scrollIntoView({behavior: 'smooth'});
      }
    })
  },
  currentAndNextProgram() {
    let currentAndNextProgramList = currentAndNextProgram(props.epg);
    epg.now = currentAndNextProgramList.now;
    epg.next = currentAndNextProgramList.next;
  },
});
onMounted(() => {
  epg.currentAndNextProgram();
});
</script>

<style scoped>
.epg-list {
  height: 70px;

  .peg-list-now {
    background: #808080;
  }

  .all-epg-dialog {
    height: 70vh;
    overflow: auto;

    .all-epg-item {
      background: #808080;
    }
  }
}


</style>