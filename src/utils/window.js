import {WebviewWindow} from '@tauri-apps/api/webviewWindow'
import {load} from "@tauri-apps/plugin-store";


export async function openNewPlayerWindow(url, windowOpt, data) {
    const store = await load('playInfo.json', {autoSave: true});
    await store.set(`tvgId-${data.tvgId}`, data)
    url = `${url}?tvgId=${data.tvgId}`
    await openNewWindow(url, {
        ...windowOpt,
        minWidth: 900,
        minHeight: 507,
        width: 1280,
        height: 720,
        center: true,
        focus: true,
        visible: true,
    });
}

export async function openNewWindow(url, windowOpt) {
    let windowLabel = `play-${windowOpt.label.replace(/\./g, '')}`;
    // 检测窗口是否存在 存在就让那个窗口置顶
    return new WebviewWindow(windowLabel, {...windowOpt, url})
}
