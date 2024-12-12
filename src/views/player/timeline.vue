<template>
  <div class="tv-timeline-container">
    <!-- 时间轴主容器 -->
    <div
        class="timeline"
        ref="timelineRef"
        @wheel.prevent="handleScroll"
        :style="{ transform: `translateX(-${scrollPosition}px)` }"
    >
      <!-- 时间刻度 -->
      <div class="timeline-scale">
        <div
            v-for="tick in timeTicks"
            :key="tick.time"
            class="time-tick"
            :style="{ left: `${tick.position}px` }"
        >
          {{ tick.label }}
        </div>
      </div>

      <!-- 当前时间线 -->
      <div
          class="current-time-line"
          :style="{ left: `${currentTimePosition}px` }"
      ></div>

      <!-- 节目块容器 -->
      <div class="program-container">
        <div
            v-for="program in processedPrograms"
            :key="program.title"
            :title="`${program.title} : ${program.startTime} - ${program.stopTime}`"
            class="program-block"
            :class="{ 'current-program': program.isCurrent }"
            :style="{
            left: `${program.left}px`,
            width: `${program.width}px`
          }"
        >
          {{ program.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {formatDate} from "@/utils/time.js";

// 定义组件接收的属性
const props = defineProps({
  epg: {
    type: Array,
    required: true
  }
})

// 常量配置
const PIXEL_PER_MINUTE = 10  // 每分钟对应的像素
const TIMELINE_PADDING = 50  // 时间轴两侧的内边距
const INNER_WIDTH = 600

// 引用元素
const timelineRef = ref(null)
const scrollPosition = ref(0)

// 计算时间轴的开始和结束时间
const timelineStart = computed(() => {
  return props.epg.length > 0
      ? new Date(props.epg[0].startTime)
      : new Date()
})

const timelineEnd = computed(() => {
  return props.epg.length > 0
      ? new Date(props.epg[props.epg.length - 1].stopTime)
      : new Date()
})

// 计算时间轴总宽度
const timelineWidth = computed(() => {
  const totalMinutes = (timelineEnd.value - timelineStart.value) / (1000 * 60)
  return totalMinutes * PIXEL_PER_MINUTE + TIMELINE_PADDING * 2
})

// 生成时间刻度
const timeTicks = computed(() => {
  const ticks = []
  const start = new Date(timelineStart.value)
  const end = new Date(timelineEnd.value)

  // 向下取整到最近的10分钟
  start.setMinutes(Math.floor(start.getMinutes() / 10) * 10, 0, 0)

  while (start <= end) {
    const position = ((start - timelineStart.value) / (1000 * 60)) * PIXEL_PER_MINUTE + TIMELINE_PADDING

    ticks.push({
      time: start.getTime(),
      label: formatDate(start),
      position: position
    })

    // 每次增加10分钟
    start.setMinutes(start.getMinutes() + 10)
  }
  return ticks
})

// 处理节目数据
const processedPrograms = computed(() => {
  const nowTime = new Date()

  return props.epg.map(program => {
    const startTime = new Date(program.startTime)
    const stopTime = new Date(program.stopTime)

    // 计算节目块位置和宽度
    const left = ((startTime - timelineStart.value) / (1000 * 60)) * PIXEL_PER_MINUTE + TIMELINE_PADDING
    const width = ((stopTime - startTime) / (1000 * 60)) * PIXEL_PER_MINUTE

    // 判断是否为当前节目
    const isCurrent = nowTime >= startTime && nowTime <= stopTime

    return {
      title: program.title,
      left,
      width,
      isCurrent,
      startTime: formatDate(startTime),
      stopTime: formatDate(stopTime)
    }
  })
})

// 当前时间位置
const currentTimePosition = computed(() => {
  const nowTime = new Date()
  return ((nowTime - timelineStart.value) / (1000 * 60)) * PIXEL_PER_MINUTE + TIMELINE_PADDING
})

// 处理滚动事件
const handleScroll = (event) => {
  const delta = event.deltaY; // 获取鼠标滚动方向
  scrollPosition.value = Math.max(
      0,
      Math.min(
          scrollPosition.value + delta,
          timelineWidth.value - INNER_WIDTH
      )
  );
};

// 滚动到当前节目
const scrollToCurrentProgram = () => {
  const currentProgram = processedPrograms.value.find((p) => p.isCurrent);

  if (currentProgram) {
    // 获取红线的位置，确保它出现在容器的中央
    const centerPosition = currentTimePosition.value - INNER_WIDTH / 2; // 500px 容器宽度的一半
    scrollPosition.value = Math.max(
        0,
        Math.min(centerPosition, timelineWidth.value - INNER_WIDTH)
    );
  }
};

watch(() => processedPrograms.value, () => scrollToCurrentProgram())

defineExpose({scrollToCurrentProgram})
</script>

<style scoped>
.tv-timeline-container {
  width: 100%;
  height: 50px;
  position: relative;
  overflow: hidden;
  color: white;

  .timeline {
    height: 100%;
    transition: transform 0.3s ease;
  }

  .timeline-scale {
    height: 20px;
    position: relative;
  }

  .time-tick {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    font-size: 12px;
    width: 66px;

    &::after {
      content: "";
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 5px;
      background-color: #fff;
    }
  }

  .current-time-line {
    position: absolute;
    width: 2px;
    height: 30px;
    background-color: red;
    z-index: 10;
    top: 20px;
  }

  .program-container {
    position: relative;
    height: 30px;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }

  .program-block {
    position: absolute;
    height: 28px;
    background-color: #3498db;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .current-program {
    background-color: #2ecc71;
  }
}


</style>