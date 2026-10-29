import { api } from '#lib/services/apiClient.js';
import { device } from '#lib/stores/deviceStore.svelte.js';

export const deviceService = {
	/**
	 * Autentica un dispositivo de pantalla mediante su UID
	 * @param {string} uid
	 * @returns {Promise<{token: string, device: import('#lib/stores/deviceStore.svelte.js').DeviceInfo, message: string}>}
	 */
	async login(uid) {
		if (!uid?.trim()) {
			throw new Error('Debes ingresar el UID del dispositivo de pantalla.');
		}

		const cleanUid = uid.trim();
		const res = await api.post('/device/login', { uid: cleanUid });

		const payload = res?.data || res;
		const token = payload?.token;
		const deviceInfo = payload?.device || { uid: cleanUid };

		if (!token) {
			throw new Error(
				res?.message || 'Respuesta inválida del servidor al autenticar el dispositivo.'
			);
		}

		device.setAuth(token, deviceInfo);

		return {
			token,
			device: deviceInfo,
			message: res?.message || 'Dispositivo autenticado exitosamente.'
		};
	},

	/**
	 * Desconecta el dispositivo actual
	 */
	logout() {
		device.clear();
	},

	/**
	 * Obtiene las publicaciones activas asignadas a la pantalla
	 */
	async getPosts() {
		const res = await api.get('/device/posts', { isDevice: true });
		const payload = res?.data || res;
		return Array.isArray(payload) ? payload : payload?.data || [];
	}
};
