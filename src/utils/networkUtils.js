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
