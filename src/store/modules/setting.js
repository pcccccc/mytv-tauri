import {defineStore} from "pinia";
import {exists, BaseDirectory, readTextFile, create, writeTextFile, open, writeFile} from '@tauri-apps/plugin-fs';
import axios from "axios";

const useSettingStore = defineStore('setting', {
    state: () => ({
        settingFileName: "setting.json"
    }),
    actions: {
        async setConfigJs() {
            let res = await axios.get(`./config.json`, {
                headers: {'Cache-Control': 'no-cache'}
            });
            Object.keys(res.data).forEach(key => {
                let value = res.data[key];
                this[key] = value;
            });
            return res.data
        },
        async setSetting(obj) {
            let data = await readTextFile(this.settingFileName, {baseDir: BaseDirectory.Resource}) || "{}";
            let newData = {};
            Object.assign(newData, JSON.parse(data), {...obj, updateTime: new Date()})
            await writeTextFile(this.settingFileName, JSON.stringify(newData), {baseDir: BaseDirectory.Resource});
        },
        async getSetting() {
            let existsFile = await exists(this.settingFileName, {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let settingText = await readTextFile(this.settingFileName, {baseDir: BaseDirectory.Resource});
                return JSON.parse(settingText)
            } else {
                let updateTime = new Date();
                await writeTextFile(this.settingFileName, JSON.stringify({updateTime}), {baseDir: BaseDirectory.Resource});
                return {updateTime}
            }
        }
    },
})

export default useSettingStore;