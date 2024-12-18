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

    // 解析文件成list
    await epgStore.getEPGList();
    await m3uStore.getM3uList();
    console.log('初始化项目，获取文件，获取设置')
}

export function disableDevToolsAndContextMenu() {
// 禁止右键和检查
//禁止F12
    document.onkeydown = function (event) {
        var winEvent = window.event
        if (winEvent && winEvent.keyCode == 123) {
            event.keyCode = 0
            event.returnValue = false
        }
        if (winEvent && winEvent.keyCode == 13) {
            winEvent.keyCode = 505
        }
    }
//屏蔽右键菜单
    document.oncontextmenu = function (event) {
        if (window.event) {
            event = window.event
        }
        try {
            let the = event.srcElement
            if (
                !(
                    (the.tagName == 'INPUT' && the.type.toLowerCase() == 'text') ||
                    the.tagName == 'TEXTAREA'
                )
            ) {
                return false
            }
            return true
        } catch (e) {
            return false
        }
    }
}

export async function downloadM3uAndEpg() {
    let settingStore = useSettingStore();
    let epgStore = useEPGStore()
    let m3uStore = useM3uStore()

    // 下载新的m3u文件和epg文件
    if (!(settingStore.lastDownloadEpgTime && new Date(settingStore.lastDownloadEpgTime).toLocaleDateString() === new Date().toLocaleDateString())) {
        await epgStore.reloadEpgFiles();
        await epgStore.getEPGList();
        console.log('下载epg')
    }
    if (!(settingStore.lastDownloadM3uTime && new Date(settingStore.lastDownloadM3uTime).toLocaleDateString() === new Date().toLocaleDateString())) {
        await m3uStore.reloadM3uFiles();
        await m3uStore.getM3uList();
        console.log('下载m3u')
    }

}