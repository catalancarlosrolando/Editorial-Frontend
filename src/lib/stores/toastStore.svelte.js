/**
 * @typedef {'success'|'error'|'warning'|'info'} ToastType
 *
 * @typedef {Object} ToastItem
 * @property {string} id
 * @property {string} message
 * @property {ToastType} type
 * @property {number} duration
 */

function createToastStore() {
	/** @type {ToastItem[]} */
	let items = $state([]);

	/**
	 * @param {string} message
	 * @param {ToastType} [type='info']
	 * @param {number} [duration=4000]
	 */
	function add(message, type = 'info', duration = 4000) {
		const id = Math.random().toString(36).substring(2, 9);
		const toast = { id, message, type, duration };
		items.push(toast);

		if (duration > 0) {
			setTimeout(() => {
				remove(id);
			}, duration);
		}

		return id;
	}

	/**
	 * @param {string} id
	 */
	function remove(id) {
		const index = items.findIndex((t) => t.id === id);
		if (index !== -1) {
			items.splice(index, 1);
		}
	}

	function clear() {
		items.length = 0;
	}

	return {
		get items() {
			return items;
		},
		add,
		remove,
		clear,
		success: (msg, dur) => add(msg, 'success', dur),
		error: (msg, dur) => add(msg, 'error', dur || 5000),
		warning: (msg, dur) => add(msg, 'warning', dur),
		info: (msg, dur) => add(msg, 'info', dur)
	};
}

export const toast = createToastStore();
