import { open } from '@tauri-apps/plugin-shell';

/**
 * 用于确定给定URL中的IP地址类型
 * @param {string} url - 待检测的URL字符串
 * @returns {Promise<string>} - 返回一个Promise，解析为IP地址类型字符串
 */
export function determineIPType(url) {
    try {
        const urlObj = new URL(url);
        const host = urlObj.hostname;

        // 判断是否为 IPv4 地址
        const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);

        // 判断是否为 IPv6 地址
        const isIPv6 = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/.test(host);

        if (isIPv4) {
            return "IPv4";
        } else if (isIPv6) {
            return "IPv6";
        } else {
            // 后续调用接口获取IP类型
            return "IPv4";
        }
    } catch (error) {
        return '无效的URL';
    }
}

/**
 * 使用系统默认浏览器打开URL
 * @param url 要打开的URL地址
 * @returns Promise<void>
 */
export async function openInBrowser(url){
    try {
        // 验证URL格式
        new URL(url);
        // 使用系统默认浏览器打开URL
        await open(url);
    } catch (error) {
        console.error('打开浏览器失败:', error);
        throw new Error(`无法打开URL: ${url}`);
    }
}


function x(){
    document.querySelector('.vjs-controlbar-fullscreen').click();
    document.querySelector('.vjs-icon-pictureinpicture').style.display = 'none';
    document.querySelector('.vjs-controlbar-fullscreen').style.display = 'none';

    const fullButton = document.createElement('div');
    fullButton.className = 'kaze-controlbar-fullscreen vjs-icon-exit-fullscreen';
    fullButton.title = '全屏';
    document.querySelector('.vjs-controlbar').append(fullButton);
    let player_fullscreen_player = document.querySelector('.kaze-controlbar-fullscreen')
    player_fullscreen_player.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isFullscreen = JSON.parse(player_fullscreen_player.getAttribute('isfullscreen'));
        console.log(isFullscreen);
        window.__TAURI__.event.emit('listen-channel-default-event', {
            label: window.browserLabel,
            type: 'full',
            isFullscreen
        }).then(e => {
            player_fullscreen_player.setAttribute('isfullscreen', !isFullscreen)
        }).catch(e => {
            console.log('跳转事件出错:', e);
        });
    });
}