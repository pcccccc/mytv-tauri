<template>
  <div class="p-3">
    <div class="flex justify-between align-middle mb-3">
      <div class="text-2xl">设置</div>
      <el-button title="回到首页" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></el-button>
    </div>
    <el-card>
      <template #header>
        <span>M3U 订阅</span>
      </template>
      <div class="flex gap-2">
        <el-input v-model="settingReactive.m3uNameValue" placeholder="请输入 M3U 名称"></el-input>
        <el-input v-model="settingReactive.m3uInputValue" placeholder="请输入 M3U URL"></el-input>
        <el-button type="primary" @click="settingReactive.addToM3uList">添加</el-button>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingReactive.m3uUrlList">
          <el-tag>{{ item.name }}</el-tag>
          <div :title="item" class="flex-1 truncate">{{ item.url }}</div>
          <el-button size="small" type="success"
                     @click="settingReactive.downloadUrl(item,'m3u')">刷新
          </el-button>
          <el-button size="small" type="danger"
                     @click="settingReactive.deleteItem(index, settingReactive.m3uUrlList)">删除
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="mt-3">
      <template #header>
        <span>添加单条频道</span>
      </template>
      <div class="flex gap-2">
        <el-input v-model="settingReactive.addTvgObj.uri" placeholder="请输入频道地址"></el-input>
        <el-input v-model="settingReactive.addTvgObj.tvgId" placeholder="请输入频道名称"></el-input>
        <el-input v-model="settingReactive.addTvgObj.tvgLogo" placeholder="请输入频道图标地址"></el-input>
        <el-button type="primary" @click="settingReactive.addToCustomM3u">添加</el-button>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingReactive.m3uCustomList">
          <div :title="`${item.tvgId} - ${item.uri}`" class="flex-1 truncate">
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
        <div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingReactive.epgUrlList">
          <el-tag>{{ item.name }}</el-tag>
          <div :title="item" class="flex-1 truncate">{{ item.url }}</div>
          <el-button size="small"
                     type="success"
                     @click="settingReactive.downloadUrl(item,'epg')">刷新
          </el-button>
          <el-button size="small" type="danger"
                     @click="settingReactive.deleteItem(index, settingReactive.epgUrlList)">删除
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive} from 'vue';
import useSettingStore from '../../store/modules/setting.js';
import {downloadFile} from '@/common/download.js';
import {ElMessage} from 'element-plus';
import router from '@/router/index.js';
import useM3uStore from "@/store/modules/m3u.js";

const settingStore = useSettingStore();
const m3uStore = useM3uStore();

const settingReactive = reactive({
  m3uNameValue: null,
  m3uInputValue: null,
  m3uUrlList: [],
  epgNameValue: null,
  epgInputValue: null,
  epgUrlList: [],
  // 添加到 M3U 列表
  async addToM3uList() {
    settingReactive.addItemList('M3U')
  },
  // 添加到 EPG 列表
  async addToEpgList() {
    settingReactive.addItemList('EPG')
  },
  addItemList(type) {
    const isM3u = type === 'M3U';
    const nameValue = isM3u ? this.m3uNameValue : this.epgNameValue;
    const inputValue = isM3u ? this.m3uInputValue : this.epgInputValue;
    const urlList = isM3u ? this.m3uUrlList : this.epgUrlList;

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
    this.downloadUrl(inputValue, isM3u ? 'm3u' : 'epg', `${nameValue}.${isM3u ? 'm3u' : 'xml'}`)
        .then(() => {
          // 清空输入
          if (isM3u) {
            this.m3uInputValue = null;
            this.m3uNameValue = null;
          } else {
            this.epgInputValue = null;
            this.epgNameValue = null;
          }

          // 保存数据
          this.saveData();
        });
  },
  // 删除项目
  deleteItem(index, list) {
    if (list !== null && list.length > 0) {
      // todo 删除同名文件
      list.splice(index, 1);
      settingReactive.saveData();
    }
  },
  async downloadUrl(url, type, name) {
    let res = await downloadFile(url, type, name);
    ElMessage({
      message: res.message,
      type: res.code
    });
  },
  saveData() {
    settingStore.setSetting({m3uUrlList: settingReactive.m3uUrlList, epgUrlList: settingReactive.epgUrlList});
  },
  async getData() {
    settingReactive.m3uUrlList = settingStore.m3uUrlList;
    settingReactive.epgUrlList = settingStore.epgUrlList;
    settingReactive.m3uCustomList = settingStore.epgUrlList;
  },
  m3uCustomList: [],
  addTvgObj: {},
  addToCustomM3u() {
    let data = {
      ...settingReactive.addTvgObj,
      name: settingReactive.addTvgObj.tvgId,
    };
    settingReactive.m3uCustomList.push(data)
    m3uStore.addCustomM3uItem(data);
    settingReactive.addTvgObj = {};
  },
  removeCustomM3uItem(index) {
    if (settingReactive.m3uCustomList !== null && settingReactive.m3uCustomList.length > 0) {
      m3uStore.removeCustomM3uItem(settingReactive.m3uCustomList[index].kazeId);
      settingReactive.m3uCustomList.splice(index, 1);
    }
  },
  async getCustomM3u() {
    settingReactive.m3uCustomList = await m3uStore.getCustomM3uList();
  }
});

const loadSettings = () => {

};

onMounted(async () => {
  await settingReactive.getData();
  await settingReactive.getCustomM3u();
});
</script>

<style scoped>
/* 添加一些样式 */
</style>
