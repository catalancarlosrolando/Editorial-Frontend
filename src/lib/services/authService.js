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

/**
 * @typedef {Object} RegisterData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} [mobile]
 * @property {string} [semanticContext]
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
	 * Registra un nuevo usuario en la plataforma
	 * @param {RegisterData} data
	 * @returns {Promise<{token?: string, user?: import('#lib/stores/authStore.svelte.js').UserProfile, message: string}>}
	 */
	async register({
		firstName,
		lastName,
		email,
		password,
		passwordConfirm,
		mobile = '',
		semanticContext = ''
	}) {
		if (
			!firstName?.trim() ||
			!lastName?.trim() ||
			!email?.trim() ||
			!password ||
			!passwordConfirm
		) {
			throw new Error('Completa todos los campos obligatorios marcados con asterisco (*).');
		}

		if (password !== passwordConfirm) {
			throw new Error('Las contraseñas no coinciden.');
		}

		if (password.length < 8) {
			throw new Error('La contraseña debe tener al menos 8 caracteres.');
		}

		const res = await api.post('/register', {
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			name: `${firstName.trim()} ${lastName.trim()}`,
			mobile: mobile.trim() || null,
			semantic_context: semanticContext.trim() || null,
			email: email.trim(),
			password,
			password_confirmation: passwordConfirm
		});

		const payload = res?.data || res;
		const token = payload?.token;
		const user = payload?.user;

		if (token && user) {
			auth.setAuth(token, user);
		}

		return {
			token,
			user,
			message: res?.message || '¡Cuenta creada exitosamente!'
		};
	},

	/**
	 * Registra un nuevo usuario en la plataforma
	 * @param {RegisterData} data
	 * @returns {Promise<{token?: string, user?: import('#lib/stores/authStore.svelte.js').UserProfile, message: string}>}
	 */
	async register({
		firstName,
		lastName,
		email,
		password,
		passwordConfirm,
		mobile = '',
		semanticContext = ''
	}) {
		if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || !passwordConfirm) {
			throw new Error('Completa todos los campos obligatorios marcados con asterisco (*).');
		}

		if (password !== passwordConfirm) {
			throw new Error('Las contraseñas no coinciden.');
		}

		if (password.length < 8) {
			throw new Error('La contraseña debe tener al menos 8 caracteres.');
		}

		const res = await api.post('/register', {
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			name: `${firstName.trim()} ${lastName.trim()}`,
			mobile: mobile.trim() || null,
			semantic_context: semanticContext.trim() || null,
			email: email.trim(),
			password,
			password_confirmation: passwordConfirm
		});

		const payload = res?.data || res;
		const token = payload?.token;
		const user = payload?.user;

		if (token && user) {
			auth.setAuth(token, user);
		}

		return {
			token,
			user,
			message: res?.message || '¡Cuenta creada exitosamente!'
		};
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
