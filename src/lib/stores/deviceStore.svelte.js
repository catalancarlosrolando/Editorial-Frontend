import { session } from '#lib/services/apiClient.js';

/**
 * @typedef {Object} DeviceInfo
 * @property {number|string} [id]
 * @property {string} uid
 * @property {string} [name]
 * @property {string} [description]
 * @property {number|string} [channel_id]
 * @property {string} [status]
 */

class DeviceStore {
	/** @type {boolean} */
	isAuthenticated = $state(false);

	/** @type {DeviceInfo | null} */
	device = $state(null);

	/** @type {string | null} */
	token = $state(null);

	/** @type {boolean} */
	initialized = $state(false);

	constructor() {
		this.init();
	}

	init() {
		if (typeof window === 'undefined') return;

		const token = session.getDeviceToken();
		const device = session.getDevice();

		if (token && device) {
			this.token = token;
			this.device = device;
			this.isAuthenticated = true;
		} else {
			this.clear();
		}
		this.initialized = true;
	}

	/**
	 * @param {string} token
	 * @param {DeviceInfo} device
	 */
	setAuth(token, device) {
		this.token = token;
		this.device = device;
		this.isAuthenticated = true;

		session.setDeviceToken(token);
		session.setDevice(device);
	}

	clear() {
		this.isAuthenticated = false;
		this.device = null;
		this.token = null;
		session.clearDevice();
	}
}

export const device = new DeviceStore();

