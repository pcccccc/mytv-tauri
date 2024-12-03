import {defineStore} from "pinia";
import {exists, BaseDirectory, readTextFile, create, writeTextFile, open, writeFile} from '@tauri-apps/plugin-fs';
import Config from "../../../public/config.json"

const useSettingStore = defineStore('setting', {
    state: () => ({
        settingFileName: "setting.json"
    }),
    actions: {
        setConfigJs() {
            Object.keys(Config).forEach(key => {
                let value = Config[key];
                this[key] = value;
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
            console.log(newData)
            await writeTextFile(this.settingFileName, JSON.stringify(newData), {baseDir: BaseDirectory.Resource});
        },
        async getSetting() {
            let existsFile = await exists(this.settingFileName, {baseDir: BaseDirectory.Resource});
            if (existsFile) {
                let settingText = await readTextFile(this.settingFileName, {baseDir: BaseDirectory.Resource});
                let json = JSON.parse(settingText);
                Object.keys(json).forEach(key => {
                    let value = json[key];
                    this[key] = value;
                });
            } else {
                let updateTime = new Date();
                await writeTextFile(this.settingFileName, JSON.stringify({updateTime}), {baseDir: BaseDirectory.Resource});
                this["updateTime"] = updateTime
            }
        }
    },
})

export default useSettingStore;