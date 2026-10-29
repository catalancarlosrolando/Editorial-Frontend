import { api } from '#lib/services/apiClient.js';
import { auth } from '#lib/stores/authStore.svelte.js';

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 * @property {boolean} [remember=false]
 */

/**
 * @typedef {Object} LoginResponseData
 * @property {string} token
 * @property {import('#lib/stores/authStore.svelte.js').UserProfile} user
 */

export const authService = {
	/**
	 * Inicia sesión con credenciales de usuario
	 * @param {LoginCredentials} credentials
	 * @returns {Promise<LoginResponseData>}
	 */
	async login({ email, password, remember = false }) {
		if (!email || !password) {
			throw new Error('Debes ingresar tu correo electrónico y contraseña.');
		}

		const res = await api.post('/login', {
			email: email.trim(),
			password,
			remember
		});

		// Manejo de estructura estándar de respuesta
		const payload = res?.data || res;
		const token = payload?.token;
		const user = payload?.user;

		if (!token || !user) {
			throw new Error(res?.message || 'Respuesta inválida del servidor al iniciar sesión.');
		}

		auth.setAuth(token, user);
		return { token, user };
	},

	/**
	 * Obtiene el perfil del usuario autenticado
	 */
	async getProfile() {
		const res = await api.get('/user/profile', { auth: true });
		const user = res?.data?.user || res?.data || res;
		if (user && auth.token) {
			auth.setAuth(auth.token, user);
		}
		return user;
	},

	/**
	 * Cierra la sesión activa en el servidor y en el cliente
	 */
	async logout() {
		try {
			if (auth.token) {
				await api.post('/logout', {}, { auth: true });
			}
		} catch (err) {
			console.warn('Error al notificar logout al servidor:', err);
		} finally {
			auth.clear();
		}
	}
};

