<template>
  <div class="p-3">
    <div class="flex justify-between align-middle mb-3">
      <div class="text-2xl">设置</div>
      <el-button title="回到首页" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></el-button>
    </div>
    <el-card>
      <template #header>
        <span>m3u 订阅</span>
      </template>
      <div class="flex gap-2">
        <el-input v-model="settingReactive.m3uNameValue" placeholder="请输入 m3u 名称"></el-input>
        <el-input v-model="settingReactive.m3uInputValue" placeholder="请输入 m3u URL"></el-input>
        <el-button type="primary" @click="settingReactive.addToM3uList">添加</el-button>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingStore.m3uUrlList">
          <el-tag>{{ item.name }}</el-tag>
          <div :title="item.url" class="flex-1 truncate">{{ item.url }}</div>
          <el-button size="small" type="success"
                     @click="settingReactive.downloadUrl(item,'m3u')">刷新
          </el-button>
          <el-button size="small" type="danger"
                     @click="settingReactive.deleteItem(index, settingStore.m3uUrlList,'m3u')">删除
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="mt-3" v-show="false">
      <template #header>
        <span>添加单条频道</span>
      </template>
      <div class="flex gap-2">
        <el-input v-model="settingReactive.addTvgObj.tvgLogo" placeholder="请输入频道图标地址"></el-input>
        <el-input v-model="settingReactive.addTvgObj.tvgId" placeholder="请输入频道名称"></el-input>
        <el-input v-model="settingReactive.addTvgObj.uri" placeholder="请输入频道地址"></el-input>
        <el-button type="primary" @click="settingReactive.addToCustomM3u">添加</el-button>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingStore.m3uCustomList">
          <div :title="`${item.tvgId} - ${item.uri}`" class="flex-1 truncate flex items-center">
            <el-image v-if="item.tvgLogo" :src="item.tvgLogo" fit="scale-down"
                      class="w-[40px] backdrop-brightness-50"></el-image>
            <el-tag>{{ item.tvgId }}</el-tag>
            <span class="text-sm ml-3">{{ item.uri }}</span>
          </div>
          <el-button size="small" type="danger"
                     @click="settingReactive.removeCustomM3uItem(index)">删除
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card title="" class="mt-3">
      <template #header>
        <span>EPG 订阅</span>
      </template>
      <div class="flex gap-2">
        <el-input v-model="settingReactive.epgNameValue" placeholder="请输入 EPG 备注"></el-input>
        <el-input v-model="settingReactive.epgInputValue" placeholder="请输入 EPG URL"></el-input>
        <el-button type="primary" @click="settingReactive.addToEpgList">添加</el-button>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingStore.epgUrlList">
          <el-tag>{{ item.name }}</el-tag>
          <div :title="item.url" class="flex-1 truncate">{{ item.url }}</div>
          <el-button size="small"
                     type="success"
                     @click="settingReactive.downloadUrl(item,'epg')">刷新
          </el-button>
          <el-button size="small" type="danger"
                     @click="settingReactive.deleteItem(index, settingStore.epgUrlList,'epg')">删除
          </el-button>
        </div>
      </div>
    </el-card>

    <div class="w-full text-right">
      <el-button type="success" class="mt-3" @click="addErrorSource">如果有源解析失败或报错，来这里提交！</el-button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import useSettingStore from '../../store/modules/setting.js';
import {downloadFile, removeFile} from '@/utils/fileUtils.js';
import {ElMessage} from 'element-plus';
import router from '@/router/index.js';
import useM3uStore from "@/store/modules/m3u.js";
import {openBrowser} from "@/utils/windowUtils.js";
import useEPGStore from "@/store/modules/epg.js";

const settingStore = useSettingStore();
const m3uStore = useM3uStore();
const epgStore = useEPGStore();

const settingReactive = reactive({
  m3uNameValue: null,
  m3uInputValue: null,
  epgNameValue: null,
  epgInputValue: null,
  // 添加到 m3u 列表
  async addToM3uList() {
    settingReactive.addItemList('m3u')
  },
  // 添加到 EPG 列表
  async addToEpgList() {
    settingReactive.addItemList('EPG')
  },
  async addItemList(type) {
    const isM3u = type === 'm3u';
    const nameValue = isM3u ? settingReactive.m3uNameValue : settingReactive.epgNameValue;
    const inputValue = isM3u ? settingReactive.m3uInputValue : settingReactive.epgInputValue;
    const urlList = isM3u ? settingStore.m3uUrlList : settingStore.epgUrlList;

    // 检查名称和 URL 是否为空
    if (!nameValue || !inputValue) {
      ElMessage({
        message: '请填写名称和地址',
        type: 'warning'
      });
      return;
    }

    // 检查是否已存在同名项目
    if (urlList.some(item => item.name === nameValue)) {
      ElMessage({
        message: '已存在该名称，请更换',
        type: 'warning'
      });
      return;
    }

    if (isM3u && nameValue == 'iptv-custom-m3u') {
      ElMessage({
        message: '该文件被系统占用，请勿使用',
        type: 'warning'
      });
      return;
    }
    // 添加到列表
    urlList.push({name: nameValue, url: inputValue});
    // 下载并保存
    await settingReactive.downloadUrl({
      name: nameValue,
      url: inputValue
    }, isM3u ? 'm3u' : 'epg')
    if (isM3u) {
      settingReactive.m3uInputValue = null;
      settingReactive.m3uNameValue = null;
      await m3uStore.getM3uList();
    } else {
      settingReactive.epgInputValue = null;
      settingReactive.epgNameValue = null;
      await epgStore.getEPGList();
    }
    // 保存数据
    settingReactive.saveData();
  },
  // 删除项目
  async deleteItem(index, list, type) {
    if (list !== null && list.length > 0) {
      removeFile(type, `${list[index].name}.${type == 'm3u' ? 'm3u' : 'xml'}`);
      list.splice(index, 1);
      if (type === 'm3u') {
        await m3uStore.getM3uList();
      } else {
        await epgStore.getEPGList();
      }
      settingReactive.saveData();
    }
  },
  async downloadUrl(item, type) {
    let res = await downloadFile(item.url, type, `${item.name}.${type == 'm3u' ? 'm3u' : 'xml'}`);
    ElMessage({
      message: res.message,
      type: res.code
    });
  },
  saveData() {
    settingStore.setSetting({m3uUrlList: settingStore.m3uUrlList, epgUrlList: settingStore.epgUrlList});
  },
  m3uCustomList: [],
  addTvgObj: {},
  addToCustomM3u() {
    if (settingReactive.addTvgObj.tvgId.indexOf('.') !== -1) {
      ElMessage({
        message: '频道名称不能包含点号',
        type: 'warning'
      });
      return;
    }
    let data = {
      ...settingReactive.addTvgObj,
      name: settingReactive.addTvgObj.tvgId,
    };
    settingStore.m3uCustomList.push(data)
    m3uStore.addCustomM3uItem(data);
    settingReactive.addTvgObj = {};
  },
  removeCustomM3uItem(index) {
    if (settingStore.m3uCustomList !== null && settingStore.m3uCustomList.length > 0) {
      m3uStore.removeCustomM3uItem(settingStore.m3uCustomList[index].kazeId);
      settingStore.m3uCustomList.splice(index, 1);
    }
  },
  async getCustomM3u() {
    settingStore.m3uCustomList = await m3uStore.getCustomM3uList();
  }
});

const addErrorSource = () => {
  openBrowser("https://github.com/KazeLiu/mytv-tauri/issues")
};

onMounted(async () => {
  await settingReactive.getCustomM3u();
});
</script>

<style scoped>
/* 添加一些样式 */
</style>
