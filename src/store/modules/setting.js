import {defineStore} from "pinia";
import {exists, BaseDirectory, readTextFile, writeTextFile} from '@tauri-apps/plugin-fs';
import Config from "../../../public/config.json"

const useSettingStore = defineStore('setting', {
    state: () => ({
        settingFileName: "setting.json",
    }),
    actions: {
        setConfigJs() {
            Object.keys(Config).forEach(key => {
                this[key] = Config[key];
            });
        },
        async setSetting(obj) {
            let data = await readTextFile(this.settingFileName, {baseDir: BaseDirectory.Resource}) || "{}";
            let newData = JSON.parse(data);
            // 遍历传入的对象，处理可能需要清空的属性
            for (let key in obj) {
                // 如果传入的值是空数组，则明确将该属性设置为空数组
                if (Array.isArray(obj[key]) && obj[key].length === 0) {
                    newData[key] = [];
                } else {
                    newData[key] = obj[key];
                }
            }
            // 添加更新时间
            newData.updateTime = new Date();
            await writeTextFile(this.settingFileName, JSON.stringify(newData, null, 2), {baseDir: BaseDirectory.Resource});
        },
        async getSetting() {
            let existsFile = await exists(this.settingFileName, {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let settingText = await readTextFile(this.settingFileName, {baseDir: BaseDirectory.Resource});
                let json = JSON.parse(settingText);
                Object.keys(json).forEach(key => {
                    this[key] = json[key];
                });
            } else {
                await this.initSetting()
            }
        },
        async initSetting() {
            // 初始化配置文件
            let updateTime = new Date();
            let initData = {
                updateTime,
                customM3uList: [],
                favoriteList:[],
                m3uUrlList: [],
                epgUrlList: []
            }
            await writeTextFile(this.settingFileName, JSON.stringify(initData,null, 2), {baseDir: BaseDirectory.Resource});
            Object.keys(initData).forEach(key => {
                this[key] = initData[key];
            });
        }
    },
})

export default useSettingStore;