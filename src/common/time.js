export function formatNowTime(format = 'hh:mm:ss', date = new Date()) {
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
