import {defineStore} from 'pinia';
import {BaseDirectory, exists, readFile, readDir, readTextFile} from '@tauri-apps/plugin-fs';
import parser from 'epg-parser';
import {formatTimeByFormat} from '@/utils/timeUtils.js';
import {ElMessage, ElNotification} from "element-plus";
import {downloadFile} from "@/utils/fileUtils.js";
import useSettingStore from "@/store/modules/setting.js";


const useEPGStore = defineStore('epg', {
    state: () => ({
        channels: [],
        programs: []
    }),
    actions: {
        async getEPGList() {
            let existsFile = await exists('epg/', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let fileList = await readDir('epg/', {baseDir: BaseDirectory.Resource});
                fileList = fileList.filter(x => x.isFile);
                let channels = [], programs = [];
                for (let i = 0; i < fileList.length; i++) {
                    let epgFileText = await readTextFile(`epg/${fileList[i].name}`, {baseDir: BaseDirectory.Resource});
                    let obj = this.parseEPGText(epgFileText);
                    channels.push(...obj.channels)
                    programs.push(...obj.programs);
                }
                const channelMap = new Map();
                // 处理频道去重和合并
                channels.forEach(channel => {
                    // 提取中文名称
                    const zhName = channel.displayName.find(name => name.lang === 'zh')?.value;
                    if (zhName) {
                        if (!channelMap.has(zhName)) {
                            // 如果是第一次遇到这个频道，直接添加
                            channelMap.set(zhName, {
                                ...channel,
                                displayName: channel.displayName.slice() // 创建副本
                            });
                        } else {
                            // 如果已存在，合并其他语言的 displayName
                            const existingChannel = channelMap.get(zhName);
                            // 对于新文件中的每个 displayName
                            channel.displayName.forEach(newName => {
                                // 检查是否已经存在这个语言的 displayName
                                const existingNameIndex = existingChannel.displayName.findIndex(
                                    existing => existing.lang === newName.lang
                                );
                                // 如果不存在，添加
                                if (existingNameIndex === -1) {
                                    existingChannel.displayName.push(newName);
                                }
                            });
                        }
                    }
                });
                this.channels = Array.from(channelMap.values());

                const validChannelIds = new Set(this.channels.map(channel => channel.id));
                // 过滤 programs，只保留在有效频道 ID 中的节目
                this.programs = programs.filter(program =>
                    validChannelIds.has(program.channel)
                );
            }
        },
        // 重新下载全部的文件
        async downloadEpgList() {
            let settingStore = useSettingStore();
            const downloadPromises = settingStore.epgUrlList.map(async (item) => {
                await downloadFile(item.url, 'epg', `${item.name}.xml`);
            });
            await Promise.all(downloadPromises);
            await this.getEPGList();
            await settingStore.setSetting({lastDownloadEpgTime: new Date()});
        },
        parseEPGText(xml) {
            return parser.parse(xml);
        },
        clearData() {
            this.channels = [];
            this.programs = [];
        },
        findEPGId(name) {
            return this.channels.find(x => x.displayName.find(y => y.value == name));
        },
        findPrograms(name) {
            let findChannel = this.findEPGId(name);
            if (findChannel && findChannel.id) {
                let findList = this.programs.filter(x => x.channel == findChannel.id);
                return findList.map(x => {
                    return {
                        start: formatTimeByFormat('MM-dd hh:mm', x.start),
                        stop: formatTimeByFormat('MM-dd hh:mm', x.stop),
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