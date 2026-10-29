import { session } from '#lib/services/apiClient.js';

/**
 * @typedef {Object} UserProfile
 * @property {number|string} id
 * @property {string} name
 * @property {string} email
 * @property {string[]} [roles]
 * @property {string[]} [permissions]
 * @property {boolean} [email_verified_at]
 */

class AuthStore {
	/** @type {boolean} */
	isAuthenticated = $state(false);

	/** @type {UserProfile | null} */
	user = $state(null);

	/** @type {string | null} */
	token = $state(null);

	/** @type {string[]} */
	roles = $state([]);

	/** @type {string[]} */
	permissions = $state([]);

	/** @type {boolean} */
	initialized = $state(false);

	constructor() {
		this.init();
		if (typeof window !== 'undefined') {
			window.addEventListener('editorial:unauthorized', () => {
				this.clear();
			});
		}
	}

	/**
	 * Hidrata el estado desde localStorage al iniciar la app
	 */
	init() {
		if (typeof window === 'undefined') return;

		const storedToken = session.getToken();
		const storedUser = session.getUser();

		if (storedToken && storedUser) {
			this.token = storedToken;
			this.user = storedUser;
			this.roles = storedUser.roles || [];
			this.permissions = storedUser.permissions || [];
			this.isAuthenticated = true;
		} else {
			this.clear();
		}
		this.initialized = true;
	}

	/**
	 * Establece la sesión activa
	 * @param {string} token
	 * @param {UserProfile} user
	 */
	setAuth(token, user) {
		this.token = token;
		this.user = user;
		this.roles = user?.roles || [];
		this.permissions = user?.permissions || [];
		this.isAuthenticated = true;

		session.setToken(token);
		session.setUser(user);
	}

	/**
	 * Limpia la sesión activa
	 */
	clear() {
		this.isAuthenticated = false;
		this.user = null;
		this.token = null;
		this.roles = [];
		this.permissions = [];
		session.clear();
	}

	/**
	 * Comprueba si el usuario tiene un rol específico
	 * @param {string} roleName
	 * @returns {boolean}
	 */
	hasRole(roleName) {
		return this.roles.includes(roleName);
	}

	/**
	 * Comprueba si el usuario tiene un permiso específico
	 * @param {string} permissionName
	 * @returns {boolean}
	 */
	hasPermission(permissionName) {
		return this.permissions.includes(permissionName);
	}

	/**
	 * @returns {boolean}
	 */
	get isAdmin() {
		return (
			this.hasRole('admin') ||
			this.hasPermission('acceder-panel-admin') ||
			this.hasPermission('gestionar-usuarios')
		);
	}

	/**
	 * @returns {boolean}
	 */
	get isPublisher() {
		return this.hasRole('publicador') || this.hasPermission('editar-contenido');
	}

	/**
	 * @returns {boolean}
	 */
	get isModerator() {
		return this.hasRole('moderador') || this.hasRole('admin');
	}

	/**
	 * Iniciales del nombre para el avatar
	 * @returns {string}
	 */
	get userInitials() {
		if (!this.user?.name) return 'U';
		return this.user.name
			.split(' ')
			.filter(Boolean)
			.map((word) => word[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
}

export const auth = new AuthStore();

