<template>
  <div class="play">
    <div class="video-area relative"
         @mouseenter="controls.startHoverState"
         @mousemove="controls.resetTimer"
         @mouseleave="controls.stopHoverState">
<!--            <video-player v-if="video.show"></video-player>-->
<!--            :class="{ 'hide': !controls.isHovering }"-->
      <div class="video-area-controls absolute top-0 bottom-0 left-0 right-0"
           v-if="video.checkItem.channelInfo.name">
        <div class="controls-top height-[85px] top-0 absolute p-3 flex flex-nowrap justify-between items-center">
          <div class="flex items-center gap-3">
            <el-image v-if="video.checkItem.channelInfo.tvgLogo"
                      :src="video.checkItem.channelInfo.tvgLogo"
                      class="tv-tag-image p-1 h-[60px] max-w-[90px]"
                      fit="contain">
              <template #error>
                <div>{{ video.checkItem.channelInfo.name }}</div>
              </template>
            </el-image>
            <div class="epg w-full min-w-[600px] overflow-auto">
              <timeline ref="timelineRef" :epg="video.checkItem.epgList"/>
            </div>
          </div>
          <div class="time text-white flex flex-col justify-center items-center">
            <div class="text-sm flex gap-1"><span>{{ getNowTime.date }}</span> <span>{{ getNowTime.week }}</span></div>
            <div class="text-4xl">{{ getNowTime.time }}</div>
          </div>
        </div>
        <div
            class="controls-bottom text-white absolute bottom-0 height-[300px] p-3 flex flex-nowrap justify-between items-center">
          <div class="flex flex-col items-start">
            <div class="text-xl truncate max-w-[300px] select-none" :title="video.checkItem.channelInfo.name">
              {{ video.checkItem.channelInfo.name }}
            </div>
            <div class="text-xs	 ip-type px-1 py-0.5 rounded-md">{{
                determineIPType(video.checkItem.channelInfo.uri)
              }}
            </div>
          </div>
          <!--          <div class="controls-bottom-button flex flex-1 justify-center flex-nowrap gap-5 text-2xl">-->
          <!--            <div @click.stop="video.playPause" title="播放暂停">-->
          <!--              <i class="fa-solid fa-play" v-show="video.isPlay"></i><i-->
          <!--                class="fa-solid fa-pause" v-show="!video.isPlay"></i></div>-->
          <!--            <div @click.stop="video.stop" title="停止"><i class="fa-solid fa-stop"></i></div>-->
          <!--            <div @click.stop="video.refresh" title="刷新"><i class="fa-solid fa-rotate"></i></div>-->
          <!--            <div @click.stop="video.fullScreen" title="全屏"><i class="fa-solid fa-expand"></i></div>-->
          <!--            <div title="音量" class="flex items-center justify-between w-[140px]">-->
          <!--              <i class="fa-solid fa-volume-xmark" v-show="video.volumeValue == 0"></i>-->
          <!--              <i class="fa-solid fa-volume-low" v-show="video.volumeValue>=1 && video.volumeValue<60"></i>-->
          <!--              <i class="fa-solid fa-volume-high" v-show="video.volumeValue >=60"></i>-->
          <!--              <div class="w-[100px]">-->
          <!--                <el-slider size="small" @change="video.changeVolume" v-model="video.volumeValue"/>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="info flex flex-col items-center justify-end">
            <!--            <div class="text-xs">分辨率：{{ video.videoInfo.resolution || '未获取到' }}</div>-->
            <!--            <div class="text-xs">网速： {{ video.videoInfo.networkSpeed }}</div>-->
            <!--            <div class="text-xs">已缓冲： {{ video.videoInfo.bufferLength }} 秒</div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive, ref, watch} from 'vue';
import {formatTimeByFormat, getWeekDay} from "@/utils/time.js";
import {determineIPType} from "@/utils/index.js";
import {load} from "@tauri-apps/plugin-store";
import {useRoute} from "vue-router";
import Timeline from "@/views/play/timeline.vue";

const {proxy} = getCurrentInstance();

const controls = reactive({
  hoverTimer: null,
  isHovering: false,
  epgList: [],
  startHoverState() {
    controls.isHovering = true
    controls.resetTimer()
  },
  resetTimer() {
    controls.isHovering = true
    clearTimeout(controls.hoverTimer)
    controls.hoverTimer = setTimeout(() => {
      controls.isHovering = false
    }, 10000) // 10秒后自动隐藏
  },
  stopHoverState() {
    clearTimeout(controls.hoverTimer)
    controls.isHovering = false;
  },
})
const video = reactive({
  show: true,
  checkItem: {
    channelInfo: {},
    epgList: []
  },
});

const getNowTime = reactive({
  time: formatTimeByFormat(),
  date: formatTimeByFormat('MM-dd'),
  week: getWeekDay(),
  start() {
    setInterval(() => {
      getNowTime.time = formatTimeByFormat();
      getNowTime.date = formatTimeByFormat('MM-dd');
      getNowTime.week = getWeekDay();
    }, 1000)
  }
})
const route = useRoute();

async function init() {
  let tvgId = route.query.tvgId;
  const store = await load('playInfo.json', {autoSave: false});
  video.checkItem = await store.get(`tvgId-${tvgId}`);
  getNowTime.start();
}

watch(() => controls.isHovering, () => {
  proxy.$refs.timelineRef.scrollToCurrentProgram();
})

onMounted(() => {
  init()
});
</script>

<style scoped>


.play {
  .video-area {
    width: 100%;
    height: calc(100vw / 1.777778);
    overflow: hidden;

    video {
      width: 100%;
      opacity: 0.05;
    }

    .video-area-controls {
      &.hide {
        .controls-top {
          top: -85px
        }

        .controls-bottom {
          bottom: -75px
        }
      }

      .controls-top, .controls-bottom {
        transition: all 0.5s;
        width: 100%;
        backdrop-filter: brightness(0.8) blur(30px);

        .ip-type {
          background: #828282;
        }
      }
    }
  }


}
</style>
