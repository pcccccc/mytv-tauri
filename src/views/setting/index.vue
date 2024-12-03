<template>
	<div class="p-3">
		<div class="flex justify-between align-middle mb-3">
			<div class="text-2xl">设置</div>
			<el-button title="回到首页" @click="router.back()"><i class="fa-solid fa-arrow-left"></i></el-button>
		</div>
		<el-card title="M3U 订阅地址">
			<div class="flex gap-2">
				<el-input v-model="settingReactive.m3uInputValue" placeholder="请输入 M3U URL"></el-input>
				<el-button type="primary" @click="settingReactive.addToM3uList">添加</el-button>
			</div>
			<div class="flex flex-col mt-3">
				<div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingReactive.m3uUrlList">
					<div :title="item" class="flex-1 truncate">{{ item }}</div>
					<el-button size="small" type="success"
										 @click="settingReactive.downloadUrl(item,'m3u')">刷新
					</el-button>
					<el-button size="small" type="danger"
										 @click="settingReactive.deleteItem(index, settingReactive.m3uUrlList)">删除
					</el-button>
				</div>
			</div>
		</el-card>

		<el-card title="EPG 订阅地址" class="mt-3">
			<div class="flex gap-2">
				<el-input v-model="settingReactive.epgInputValue" placeholder="请输入 EPG URL"></el-input>
				<el-button type="primary" @click="settingReactive.addToEpgList">添加</el-button>
			</div>
			<div class="flex flex-col mt-3">
				<div class="flex gap-2 items-center w-100 mt-2" v-for="(item,index) in settingReactive.epgUrlList">
					<div :title="item" class="flex-1 truncate">{{ item }}</div>
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
import { ref, onMounted, reactive } from 'vue';
import useSettingStore from '../../store/modules/setting.js';
import { downloadFile } from '@/common/download.js';
import { ElMessage } from 'element-plus';
import router from '@/router/index.js';

const settingStore = useSettingStore();

const settingReactive = reactive({
	m3uInputValue: null,
	epgInputValue: null,
	m3uUrlList: [],
	epgUrlList: [],
	// 添加到 M3U 列表
	async addToM3uList() {
		if (settingReactive.m3uInputValue) {
			settingReactive.m3uUrlList.push(settingReactive.m3uInputValue);
			await settingReactive.downloadUrl(settingReactive.m3uInputValue, 'm3u');
			settingReactive.m3uInputValue = null;
			settingReactive.saveData();
		}
	},
	// 添加到 EPG 列表
	async addToEpgList() {
		if (settingReactive.epgInputValue) {
			settingReactive.epgUrlList.push(settingReactive.epgInputValue);
			await settingReactive.downloadUrl(settingReactive.epgInputValue, 'epg');
			settingReactive.epgInputValue = null;
			settingReactive.saveData();
		}
	},
	async downloadUrl(url, type) {
		let res = await downloadFile(url, type);
		ElMessage({
			message: res.message,
			type: res.code
		});
	},
	// 删除项目
	deleteItem(index, list) {
		if (list !== null && list.length > 0) {
			list.splice(index, 1);
			settingReactive.saveData();
		}
	},
	saveData() {
		settingStore.setSetting({ m3uUrlList: settingReactive.m3uUrlList, epgUrlList: settingReactive.epgUrlList });
	},
	async getData() {
		// let res = await settingStore.getSetting();
		settingReactive.m3uUrlList = settingStore.m3uUrlList;
		settingReactive.epgUrlList = settingStore.epgUrlList;
	}
});

const loadSettings = () => {

};

onMounted(async () => {
	settingReactive.getData();
});
</script>

<style scoped>
/* 添加一些样式 */
</style>
