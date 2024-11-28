<template>
  <div class="play">
    <div class="video-area relative"
         @mouseenter="controls.startHoverState"
         @mousemove="controls.resetTimer"
         @mouseleave="controls.stopHoverState">
      <video v-if="video.show" ref="videoPlayer" autoplay></video>
      <!--      :class="{ 'hide': !controls.isHovering }"-->
      <div class="video-area-controls absolute top-0 bottom-0 left-0 right-0"

           v-if="video.checkItem.name">
        <div class="controls-top height-[85px] top-0 absolute p-3 flex flex-nowrap justify-between items-center">
          <div class="flex items-center gap-3">
            <el-image v-if="video.checkItem.tvgLogo"
                      :src="video.checkItem.tvgLogo"
                      class="tv-tag-image p-1 h-[60px] max-w-[90px]"
                      fit="contain">
              <template #error>
                <div>{{ video.checkItem.name }}</div>
              </template>
            </el-image>
            <div class="epg flex flex-col items-center text-white">
              <div class="text-xl">正在播放</div>
              <div class="text-xs">稍后播放</div>
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
            <div class="text-xl truncate max-w-[300px] select-none" :title="video.checkItem.name">
              {{ video.checkItem.name }}
            </div>
            <div class="text-xs	 ip-type px-1 py-0.5 rounded-md">{{ determineIPType(video.checkItem.uri) }}</div>
          </div>
          <div class="controls-bottom-button flex flex-1 justify-center flex-nowrap gap-5 text-2xl">
            <div @click.stop="video.playPause" title="播放暂停">
              <i class="fa-solid fa-play" v-show="video.isPlay"></i><i
                class="fa-solid fa-pause" v-show="!video.isPlay"></i></div>
            <div @click.stop="video.stop" title="停止"><i class="fa-solid fa-stop"></i></div>
            <div @click.stop="video.refresh" title="刷新"><i class="fa-solid fa-rotate"></i></div>
            <div @click.stop="video.fullScreen" title="全屏"><i class="fa-solid fa-expand"></i></div>
            <div title="音量" class="flex items-center justify-between w-[140px]">
              <i class="fa-solid fa-volume-xmark" v-show="video.volumeValue == 0"></i>
              <i class="fa-solid fa-volume-low" v-show="video.volumeValue>=1 && video.volumeValue<60"></i>
              <i class="fa-solid fa-volume-high" v-show="video.volumeValue >=60"></i>
              <div class="w-[100px]">
                <el-slider size="small" @change="video.changeVolume" v-model="video.volumeValue"/>
              </div>
            </div>
          </div>
          <div class="info flex flex-col items-center justify-end">
            <div class="text-xs">分辨率：{{ video.videoInfo.resolution || '未获取到' }}</div>
            <div class="text-xs">网速： {{ video.videoInfo.networkSpeed }}</div>
            <div class="text-xs">已缓冲： {{ video.videoInfo.bufferLength }} 秒</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tv-tag-area overflow-auto flex flex-wrap gap-3 justify-center w100 mt-5">
      <div v-for="item in m3uInfo.list"
           class="tv-tag flex justify-between gap-3 p-2 rounded-md cursor-pointer"
           :class="{'isPlay':item.uri == video.checkItem.uri}"
           @click="m3uInfo.checkItem(item)">
        <el-image v-if="item.tvgLogo" :src="item.tvgLogo" class="tv-tag-image p-1" fit="contain">
          <template #error>
            ??
          </template>
        </el-image>
        <div class="truncate flex-1 justify-start flex items-center text-white" :title="item.name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import Hls from 'hls.js';
import useM3uStore from "@/store/modules/m3u.js";
import {ElMessage} from "element-plus";
import {formatNowTime, getWeekDay} from "@/common/time.js";
import {determineIPType} from "@/common/index.js";

const m3uStore = useM3uStore();
const videoPlayer = ref(null);
const controls = reactive({
  hoverTimer: null,
  isHovering: false,
  startHoverState() {
    controls.isHovering = true
    controls.resetTimer()
  },
  resetTimer() {
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
  checkItem: {},
  hls: null,
  videoInfo: {
    resolution: '',
    networkSpeed: '',
    bufferLength: 0,
  },
  init() {
    if (Hls.isSupported()) {
      // 创建 Hls.js 实例
      video.hls = new Hls({
        maxBufferLength: 30, // 最大缓冲长度
        maxBufferSize: 60 * 1000 * 1000 // 最大缓冲大小
      });
      video.initHlsEvent();
    } else {
      ElMessage({
        message: '加载失败，请于项目的 issues 提交 bug ',
        type: 'error',
      })
    }
  },
  initHlsEvent() {
    // 监听 Hls.js 加载和播放错误事件
    video.hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        video.show = false;
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            ElMessage({
              message: '播放失败：拉取不到资源，请检查网络',
              type: 'error',
            })
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            ElMessage({
              message: '播放失败：媒体格式不支持',
              type: 'error',
            })
            break;
          case Hls.ErrorTypes.OTHER_ERROR:
            ElMessage({
              message: '播放失败：其他错误',
              type: 'error',
            })
            break;
          default:
            console.error('播放失败：未知错误');
            break;
        }
      }
    });

    // 清理 Hls.js 实例
    video.hls.on(Hls.Events.DESTROYED, () => {
      video.hls.destroy();
      clearInterval(bufferInterval);
    });

    // 监听视频分辨率和格式
    video.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      const currentLevel = data.levels[0];
      if (currentLevel.width != 0) {
        video.videoInfo.resolution = `${currentLevel.width}x${currentLevel.height}`;
      } else {
        video.videoInfo.resolution = null;
      }
    });

    // 监听缓冲区状态
    video.hls.on(Hls.Events.BUFFER_CREATED, (event, data) => {
      video.updateBufferInfo();
    });
    // 定期更新缓冲区信息
    const bufferInterval = setInterval(() => {
      //todo 这两个方法是Claude写的 不知道结果对不对 后期阅读api再换
      video.updateBufferInfo();
      video.updateNetworkInfo();
    }, 1000);
  },
  // 更新缓冲区信息的方法
  updateBufferInfo() {
    if (videoPlayer.value) {
      const buffered = videoPlayer.value.buffered;

      if (buffered.length > 0) {
        // 计算已缓冲的总时长
        const bufferedEnd = buffered.end(buffered.length - 1);
        const bufferedStart = buffered.start(0);
        const bufferLength = bufferedEnd - bufferedStart;

        this.videoInfo.bufferLength = Number(bufferLength.toFixed(2));
      }
    }
  },
  // 更新网络信息
  updateNetworkInfo() {
    if (this.hls && this.hls.levels && this.hls.levels.length > 0) {
      const currentLevel = this.hls.levels[this.hls.currentLevel];

      if (currentLevel && currentLevel.details) {
        // 获取最近加载的片段
        const lastLoadedFragment = currentLevel.details.fragments[currentLevel.details.fragments.length - 1];
        if (lastLoadedFragment && lastLoadedFragment.stats) {
          const loadedBytes = lastLoadedFragment.stats.loaded || 0;
          const duration = lastLoadedFragment.duration || 1;

          // 计算网络速度
          const speed = loadedBytes > 0 && duration > 0
              ? (loadedBytes / (duration * 1024)).toFixed(2)
              : '0';

          this.videoInfo.networkSpeed = `${speed} KB/s`;

          // 可以添加更多信息收集
          this.videoInfo.bandwidth = lastLoadedFragment.stats.bwEstimate
              ? (lastLoadedFragment.stats.bwEstimate / 1024).toFixed(2)
              : '0';
        } else {
          // 如果没有片段信息，设置默认值
          this.videoInfo.networkSpeed = '0 KB/s';
          this.videoInfo.bandwidth = '0';
        }
      }
    }
  },
  loadURL(url) {
    // url = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8';
    // 加载 M3U8 文件
    video.hls.loadSource(url);
    video.hls.attachMedia(videoPlayer.value);
    video.videoInfo = {
      resolution: '',
      networkSpeed: '',
      bufferLength: 0,
    };
  },
  isPlay: false,
  playPause() {
    if (videoPlayer.value) {
      if (videoPlayer.value.paused) {
        videoPlayer.value.play();
        video.isPlay = true;
      } else {
        videoPlayer.value.pause();
        video.isPlay = false;
      }
    }
  },
  stop() {
    if (videoPlayer.value) {
      videoPlayer.value.pause();
      videoPlayer.value.currentTime = 0;
      video.isPlay = false;
    }
  },
  refresh() {
    if (video.hls) {
      video.hls.destroy();
      video.init();
      video.loadURL(this.checkItem.uri);
      video.isPlay = false;
    }
  },
  volumeValue: 0,
  changeVolume() {
    if (videoPlayer.value) {
      videoPlayer.value.volume = video.volumeValue / 100;
    }
  },
  isFullScreen: false,
  fullScreen() {
    //todo 未实现屏幕全屏
    if (videoPlayer.value) {
      if (!document.fullscreenElement) {
        videoPlayer.value.requestFullscreen();
        videoPlayer.value.isFullScreen = true;
      } else {
        document.exitFullscreen();
        videoPlayer.value.isFullScreen = false;
      }
    }
  },
});
const m3uInfo = reactive({
  list: [],
  async getList() {
    await m3uStore.getM3uList();
    m3uInfo.list = m3uStore.m3uList
  },
  checkItem(item) {
    video.checkItem = item
    video.loadURL(item.uri)
  }
})
const epgInfo = reactive({
  checkItem: {},
  list: [],
  async getList() {
    await m3uStore.getM3uList();
    m3uInfo.list = m3uStore.m3uList
  },
})
const getNowTime = reactive({
  time: formatNowTime(),
  date: formatNowTime('MM-dd'),
  week: getWeekDay(),
  start() {
    setInterval(() => {
      getNowTime.time = formatNowTime();
      getNowTime.date = formatNowTime('MM-dd');
      getNowTime.week = getWeekDay();
    }, 1000)
  }
})
onMounted(() => {
  m3uInfo.getList();
  video.init();
  getNowTime.start();
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
      opacity: 0.1;
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

  .tv-tag-area {
    height: 200px;

    .tv-tag {
      background: #B2B2B2;
      height: 60px;
      width: 200px;
      transition: all 0.5s;

      &.isPlay {
        background: #4C4C4C;
      }

      .tv-tag-image {
        width: 70px;
      }

      .tv-tag-title {
      }
    }
  }

}
</style>
