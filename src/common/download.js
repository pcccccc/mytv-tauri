import {BaseDirectory, writeFile, exists, mkdir} from "@tauri-apps/plugin-fs";
import {fetch} from "@tauri-apps/plugin-http";

export async function downloadFile(downloadUrl, downloadPath = "download") {
    try {
        // 定义文件的下载 URL 和保存文件名
        const url = downloadUrl; // 替换为你的文件 URL
        const fileName = (url.split('/').pop()?.split('?')[0]) || `default-file-name-${new Date().getTime()}`;
        let isExists = await exists(`${downloadPath}/`, {baseDir: BaseDirectory.Resource})
        if (!isExists) {
            await mkdir(downloadPath, {baseDir: BaseDirectory.Resource})
        }
        const response = await fetch(url, {method: "GET", connectTimeout: 5000});

        if (response.status === 200) {
            // 将文件数据保存到 BaseDirectory.Resource
            const data = await response.text()
            const encoder = new TextEncoder()
            const filePayload = encoder.encode(data)

            await writeFile(`${downloadPath}/${fileName}`, filePayload, {
                baseDir: BaseDirectory.Resource,
            });
            return {code: 'success', message: `文件已成功下载并保存到 Resource 目录：${fileName}`}
        } else {
            return {code: 'error', message: `下载失败：状态码 ${response.status}`}
        }
    } catch (error) {
        return {code: 'error', message: `下载文件时出错:, ${JSON.stringify(error)}`}
    }
}


