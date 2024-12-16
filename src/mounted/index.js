import useEPGStore from "@/store/modules/epg.js";
import useM3uStore from "@/store/modules/m3u.js";
import useSettingStore from "@/store/modules/setting.js";

/**
 * 项目初始化的时候请求一次 后面再也不运行
 */
export async function mounted() {
    let settingStore = useSettingStore();
    let epgStore = useEPGStore()
    let m3uStore = useM3uStore()

    // 获取配置文件
    settingStore.setConfigJs();
    // 获取设置
    await settingStore.getSetting();

    // 下载新的m3u文件和epg文件
    if (!(settingStore.lastDownloadEpgTime && new Date(settingStore.lastDownloadEpgTime).toLocaleDateString() === new Date().toLocaleDateString())) {
        await epgStore.reloadEpgFiles();
        console.log('下载epg')
    }
    if (!(settingStore.lastDownloadM3uTime && new Date(settingStore.lastDownloadM3uTime).toLocaleDateString() === new Date().toLocaleDateString())) {
        await m3uStore.reloadM3uFiles();
        console.log('下载m3u')
    }

    // 解析文件成list
    await epgStore.getEPGList();
    await m3uStore.getM3uList();
    console.log('初始化项目，获取文件，获取设置')
}