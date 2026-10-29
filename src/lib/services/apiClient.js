/**
 * ============================================================================
 * Editorialv2 - Centralized API Client & Storage
 * ============================================================================
 */

const STORAGE_KEYS = {
	TOKEN: 'editorial_token',
	USER: 'editorial_user',
	DEVICE_TOKEN: 'editorial_device_token',
	DEVICE: 'editorial_device'
};

/**
 * Gestor de persistencia segura en LocalStorage con fallback
 */
export const session = {
	getToken() {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(STORAGE_KEYS.TOKEN);
	},
	setToken(token) {
		if (typeof window === 'undefined') return;
		if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
		else localStorage.removeItem(STORAGE_KEYS.TOKEN);
	},
	getUser() {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem(STORAGE_KEYS.USER);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	},
	setUser(user) {
		if (typeof window === 'undefined') return;
		if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
		else localStorage.removeItem(STORAGE_KEYS.USER);
	},
	getDeviceToken() {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(STORAGE_KEYS.DEVICE_TOKEN);
	},
	setDeviceToken(token) {
		if (typeof window === 'undefined') return;
		if (token) localStorage.setItem(STORAGE_KEYS.DEVICE_TOKEN, token);
		else localStorage.removeItem(STORAGE_KEYS.DEVICE_TOKEN);
	},
	getDevice() {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem(STORAGE_KEYS.DEVICE);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	},
	setDevice(device) {
		if (typeof window === 'undefined') return;
		if (device) localStorage.setItem(STORAGE_KEYS.DEVICE, JSON.stringify(device));
		else localStorage.removeItem(STORAGE_KEYS.DEVICE);
	},
	clear() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(STORAGE_KEYS.TOKEN);
		localStorage.removeItem(STORAGE_KEYS.USER);
	},
	clearDevice() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(STORAGE_KEYS.DEVICE_TOKEN);
		localStorage.removeItem(STORAGE_KEYS.DEVICE);
	}
};

/**
 * Cliente HTTP estandarizado
 */
class ApiClient {
	constructor() {
		this.baseUrl = import.meta.env.VITE_API_URL || '/api';
		this.timeoutMs = 15000;
	}

	/**
	 * @param {string} method
	 * @param {string} endpoint
	 * @param {Object} [options]
	 * @param {any} [options.body=null]
	 * @param {boolean} [options.auth=false]
	 * @param {string} [options.token=null]
	 * @param {boolean} [options.isDevice=false]
	 * @param {Record<string, string>} [options.headers={}]
	 * @returns {Promise<any>}
	 */
	async request(
		method,
		endpoint,
		{ body = null, auth = false, token = null, isDevice = false, headers = {} } = {}
	) {
		const requestHeaders = {
			Accept: 'application/json',
			...headers
		};

		// Inyección de token
		const authToken =
			token || (isDevice ? session.getDeviceToken() : auth ? session.getToken() : null);
		if (authToken) {
			requestHeaders['Authorization'] = `Bearer ${authToken}`;
		}

		const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
		if (!isFormData && body !== null && body !== undefined) {
			requestHeaders['Content-Type'] = 'application/json';
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

		const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

		/** @type {RequestInit} */
		const init = {
			method,
			headers: requestHeaders,
			signal: controller.signal
		};

		if (body !== null && body !== undefined) {
			init.body = isFormData ? body : JSON.stringify(body);
		}

		try {
			const res = await fetch(url, init);
			clearTimeout(timeoutId);

			const isJson = res.headers.get('content-type')?.includes('application/json');
			const data = isJson ? await res.json().catch(() => null) : null;

			if (!res.ok) {
				// Manejo de expiración de sesión
				if (res.status === 401 && auth) {
					session.clear();
					window.dispatchEvent(new CustomEvent('editorial:unauthorized'));
				}

				const errorMessage =
					data?.message || data?.error || `Error en la solicitud (HTTP ${res.status})`;
				const error = new Error(errorMessage);
				error.status = res.status;
				error.data = data;
				throw error;
			}

			return data;
		} catch (err) {
			clearTimeout(timeoutId);
			if (err.name === 'AbortError') {
				const timeoutError = new Error(
					'La solicitud ha tardado demasiado tiempo. Verifica tu conexión.'
				);
				timeoutError.status = 408;
				throw timeoutError;
			}
			throw err;
		}
	}

	get(endpoint, opts = {}) {
		return this.request('GET', endpoint, opts);
	}

	post(endpoint, body, opts = {}) {
		return this.request('POST', endpoint, { ...opts, body });
	}

	put(endpoint, body, opts = {}) {
		return this.request('PUT', endpoint, { ...opts, body });
	}

	patch(endpoint, body, opts = {}) {
		return this.request('PATCH', endpoint, { ...opts, body });
	}

	delete(endpoint, opts = {}) {
		return this.request('DELETE', endpoint, opts);
	}
}

export const api = new ApiClient();
