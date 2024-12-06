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
