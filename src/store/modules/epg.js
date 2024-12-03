import { defineStore } from 'pinia';
import { BaseDirectory, exists, readFile, readDir, readTextFile } from '@tauri-apps/plugin-fs';
import parser from 'epg-parser';
import { formatNowTime } from '@/common/time.js';


const useEPGStore = defineStore('epg', {
	state: () => ({
		channels: [],
		programs: []
	}),
	actions: {
		async getEPGList() {
			let existsFile = await exists('epg/', { baseDir: BaseDirectory.Resource });
			if (existsFile) {
				let fileList = await readDir('epg/', { baseDir: BaseDirectory.Resource });
				fileList = fileList.filter(x => x.isFile);
				for (let i = 0; i < fileList.length; i++) {
					let epgFileText = await readTextFile(`epg/${fileList[i].name}`, { baseDir: BaseDirectory.Resource });
					// todo 后期可以优化为以文件为组
					let obj = this.parseEPGText(epgFileText);
					this.channels.push(...obj.channels);
					this.programs.push(...obj.programs);
				}
			}
		},
		parseEPGText(xml) {
			return parser.parse(xml);
		},
		clearData() {
			this.channels = [];
			this.programs = [];
		},
		findEPGId(name) {
			let find = this.channels.find(x => x.displayName.find(y => y.value == name));
			return find;
		},
		findPrograms(name) {
			let findChannel = this.findEPGId(name);
			if (findChannel && findChannel.id) {
				let findList = this.programs.filter(x => x.channel == findChannel.id);
				return findList.map(x => {
					return {
						start: formatNowTime('MM-dd hh:mm', x.start),
						stop: formatNowTime('MM-dd hh:mm', x.stop),
						startTime: x.start,
						stopTime: x.stop,
						title: x.title[0].value
					};
				});
			} else {
				return [];
			}
		},
	}
});

export default useEPGStore;