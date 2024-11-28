import {defineStore} from "pinia";
import {BaseDirectory, exists, readFile, readDir, readTextFile} from "@tauri-apps/plugin-fs";
import {Parser} from 'epg8-parser';


const useEPGStore = defineStore('epg', {
    state: () => ({
        epgList: [],
    }),
    actions: {
        async getEPGList() {
            let existsFile = await exists('epg/', {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let fileList = await readDir('epg/', {baseDir: BaseDirectory.Resource});
                fileList = fileList.filter(x => x.isFile)
                let epgList = [];
                for (let i = 0; i < fileList.length; i++) {
                    let epgFileText = await readTextFile(`epg/${fileList[i].name}`, {baseDir: BaseDirectory.Resource})
                    // todo 后期可以优化为以文件为组
                    epgList.push(...[]);
                }
                this.epgList = epgList;
            }
        }
    },
})

export default useEPGStore;