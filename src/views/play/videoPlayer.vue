<template>
  <video ref="videoPlayer" autoplay></video>
</template>
<script setup>
import {reactive, ref} from "vue";
import Hls from "hls.js";
import {ElMessage} from "element-plus";

const videoPlayer = ref(null);
const video = reactive({
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
</script>
<style scoped>

</style>