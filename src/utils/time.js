export function formatTimeByFormat(format = 'hh:mm:ss', date = new Date()) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const replacements = {
        'YYYY': year,
        'YY': String(year).slice(-2),
        'MM': month,
        'M': Number(month),
        'dd': day,
        'd': Number(day),
        'hh': hour,
        'h': Number(hour),
        'mm': minute,
        'm': Number(minute),
        'ss': second,
        's': Number(second)
    };

    return format.replace(/YYYY|YY|MM|M|dd|d|hh|h|mm|m|ss|s/g, match => replacements[match]);
}

export function getWeekDay() {
    const now = new Date();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeek = now.getDay();

    return days[dayOfWeek];
}

/**
 * 格式化日期对象为更易读的字符串格式
 * 该函数根据当前日期与给定日期的差异，返回不同的日期描述
 * @param {Date} date - 可选的日期对象，默认为当前日期
 * @returns {string} - 格式化后的日期字符串
 */
export function formatDate(date = new Date()) {
    const now = new Date();
    date = new Date(date);
    // 判断是否是昨天、今天、明天、前天、后天
    if (date.toDateString() === now.toDateString()) {
        return `今天 ${formatTimeByFormat('hh:mm', date)}`;
    } else if (date.getDate() === now.getDate() - 1) {
        return `昨天 ${formatTimeByFormat('hh:mm', date)}`;
    } else if (date.getDate() === now.getDate() + 1) {
        return `明天 ${formatTimeByFormat('hh:mm', date)}`;
    } else if (date.getDate() === now.getDate() - 2) {
        return `前天 ${formatTimeByFormat('hh:mm', date)}`;
    } else if (date.getDate() === now.getDate() + 2) {
        return `后天 ${formatTimeByFormat('hh:mm', date)}`;
    } else {
        // 返回月日 时分 格式
        return formatTimeByFormat('MM-dd hh:mm', date);
    }
}

/**
 * 将给定的秒数格式化为易于阅读的字符串格式。
 * 如果秒数大于等于一小时，则返回小时、分钟和秒的格式；
 * 否则，返回分钟和秒的格式。
 *
 * @param {number} seconds - 需要格式化的秒数。
 * @returns {string} 格式化后的时间字符串。
 */
export function formatSeconds(seconds) {
    // 计算小时
    const hours = Math.floor(seconds / 3600);
    // 计算剩余分钟
    const minutes = Math.floor((seconds % 3600) / 60);
    // 计算剩余秒数
    const remainingSeconds = Math.floor(seconds % 60);

    // 使用 padStart 确保每个数字都是两位数
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // 根据是否有小时返回不同格式
    if (hours > 0) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
