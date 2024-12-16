import {defineStore} from "pinia";
import {BaseDirectory, exists, readFile, readDir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {Parser} from 'm3u8-parser';
import useSettingStore from "@/store/modules/setting.js";
import {ElMessage, ElNotification} from "element-plus";
import {downloadFile} from "@/utils/fileUtils.js";


const useM3uStore = defineStore('m3u', {
    state: () => ({
        m3uList: [],
    }),
    actions: {
        async getM3uList() {
            let existsFile = await exists('m3u/', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let fileList = await readDir('m3u/', {baseDir: BaseDirectory.Resource});
                fileList = fileList.filter(x => x.isFile)
                let m3uList = [];
                for (let i = 0; i < fileList.length; i++) {
                    let m3uFileText = await readTextFile(`m3u/${fileList[i].name}`, {baseDir: BaseDirectory.Resource})
                    m3uList.push(...this.parseM3U8Text(m3uFileText, fileList[i].name));
                }
                this.m3uList = m3uList;
            }
        },
        parseM3U8Text(m3u8Text, source) {
            const parser = new Parser();
            parser.push(m3u8Text);
            parser.end();

            function parseM3ULine(line) {
                const titleMatch = line.match(/,(.+)$/);
                const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
                const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
                const groupTitleMatch = line.match(/group-title="([^"]+)"/);
                const kazeIdMatch = line.match(/kaze-id="([^"]+)"/);

                return {
                    name: titleMatch ? titleMatch[1] : null,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : (tvgNameMatch ? tvgNameMatch[1] : null),
                    tvgName: tvgNameMatch ? tvgNameMatch[1] : null,
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : null,
                    groupTitle: groupTitleMatch ? groupTitleMatch[1] : null,
                    kazeId: kazeIdMatch ? kazeIdMatch[1] : null,
                    source: source.replace(/\.[^.]+$/, '')
                };
            }

            return parser.manifest.segments.map(x => {
                return {
                    ...x,
                    ...parseM3ULine(x.title)
                }
            })
        },
        async reloadM3uFiles() {
            let settingStore = useSettingStore();
            const downloadPromises = settingStore.m3uUrlList.map(async (item) => {
                await downloadFile(item.url, 'm3u', `${item.name}.m3u`);
            });
            await Promise.all(downloadPromises);
            await settingStore.setSetting({ lastDownloadM3uTime: new Date() });
        },
        async addCustomM3uItem(data) {
            let settingStore = useSettingStore();
            settingStore.customM3uList.push(data);
            await settingStore.setSetting({customM3uList: settingStore.customM3uList});
        },
        async removeCustomM3uItem(kazeId) {
            let settingStore = useSettingStore();
            settingStore.customM3uList = settingStore.customM3uList.filter(x => x.kazeId !== kazeId)
            await settingStore.setSetting({customM3uList: settingStore.customM3uList});
        },
        async getCustomM3uList() {
            let settingStore = useSettingStore();
            return settingStore.customM3uList ?? [];
        },
    },
})

export default useM3uStore;