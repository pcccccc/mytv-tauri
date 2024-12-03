/**
 * 找出当前正在播放的节目
 * @param {Array} schedules - 节目单数组，包含每个节目的开始和结束时间
 * @returns {Array} - 返回带当前节目和下一个节目
 */
export function currentAndNextProgram(schedules) {
	const now = new Date();

	// 找出当前正在播放的节目
	const currentProgram = schedules.find(schedule => {
		const startTime = new Date(schedule.startTime);
		const stopTime = new Date(schedule.stopTime);
		return now >= startTime && now <= stopTime;
	});

	// 如果找到当前节目，找出它在数组中的索引
	if (currentProgram) {
		const currentIndex = schedules.indexOf(currentProgram);

		// 返回当前节目和下一个节目（如果存在）
		return {
			now: currentProgram,
			next: schedules[currentIndex + 1] || null
		};
	}

	// 如果没有找到当前播放的节目，返回 [null, null]
	return { now: null, next: null };
}

/**
 * 标记节目单的状态
 * 根据当前时间与节目开始和结束时间的比较，为每个节目标记状态
 * @param {Array} schedules - 节目单数组，包含每个节目的开始和结束时间
 * @returns {Array} - 返回带有状态标记的节目单数组
 */
export function markProgramStatus(schedules) {
	const now = new Date();

	return schedules.map((schedule) => {
		const startTime = new Date(schedule.startTime);
		const stopTime = new Date(schedule.stopTime);

		let status;
		if (now >= startTime && now <= stopTime) {
			// 当前正在播放的节目
			status = 0;
		} else if (now > stopTime) {
			// 已经错过的节目
			status = -1;
		} else {
			// 尚未播出的节目
			status = 1;
		}

		return {
			...schedule,
			status
		};
	});
};