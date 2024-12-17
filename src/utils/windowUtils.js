import {WebviewWindow} from '@tauri-apps/api/webviewWindow'
import {load} from "@tauri-apps/plugin-store";
import {core} from "@tauri-apps/api";

const windowOptions = {
    minWidth: 900,
    minHeight: 507,
    width: 1280,
    height: 720,
    center: true,
    focus: true,
    visible: true,
    title: 'Kaze Player',
}

export async function openNewPlayerWindow(url, windowOpt, channelInfo) {
    const store = await load('playInfo.json', {autoSave: true});
    await store.set(`tvgId-${channelInfo.tvgId}`, channelInfo)
    url = `${url}?tvgId=${channelInfo.tvgId}`
    return await openNewWindow(url, `play-${windowOpt.label.replace(/[^a-zA-Z0-9\-\/\:_]/g, '')}`, {
        ...windowOpt,
        ...windowOptions
    });
}

/**
 * 联系后台的方法来打开新的窗口
 * @param channelInfo 传入的频道信息 信息来源为 browserTVList 数组
 * @returns {Promise<unknown>}
 */
export async function openNewBrowserWindow(channelInfo) {
    return await core.invoke("create_browser_window", {
        label: `browser-${channelInfo.id}`,
        url: channelInfo.url,
        option: {
            ...windowOptions,
            title: channelInfo.name + ' —— 本页面展示的是源网站内容，不代表本软件观点',
        },
        info: JSON.stringify(channelInfo)
    });

}

/**
 * tauri2前端API打开新的窗口
 * @param channelInfo 传入的频道信息 信息来源为 browserTVList 数组
 * @returns {Promise<unknown>}
 */
export async function openNewWindow(url, label, windowOpt) {
    return new WebviewWindow(label, {...windowOpt, url})
}
