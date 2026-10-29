<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	/**
	 * @typedef {Object} LoginFormProps
	 * @property {(data: import('#lib/services/authService.js').LoginResponseData) => void} [onsuccess]
	 * @property {() => void} [onforgotpassword]
	 * @property {() => void} [onregister]
	 * @property {boolean} [embedded=false] - Si es embebido (en modal) o página completa
	 */

	/** @type {LoginFormProps} */
	let { onsuccess, onforgotpassword, onregister, embedded = false } = $props();

	let email = $state('');
	let password = $state('');
	let remember = $state(false);

	let loading = $state(false);
	let errorMessage = $state('');

	// Validación reactiva simple
	const isEmailValid = $derived(!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const emailError = $derived(
		!isEmailValid ? 'Ingresa un correo electrónico con formato válido.' : undefined
	);

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';

		if (!email.trim() || !password) {
			errorMessage = 'Por favor, completa todos los campos requeridos.';
			return;
		}

		if (!isEmailValid) {
			errorMessage = 'Por favor, corrige el formato de tu correo electrónico.';
			return;
		}

		loading = true;
		try {
			const result = await authService.login({
				email: email.trim(),
				password,
				remember
			});

			toast.success(`¡Bienvenido de nuevo, ${result.user.name}!`);

			if (onsuccess) {
				onsuccess(result);
			}
		} catch (err) {
			errorMessage = err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="login-form-container" class:login-form-container--embedded={embedded}>
	{#if !embedded}
		<div class="login-header">
			<Heading level="h2" subtitle="Ingresa tus credenciales para acceder al sistema">
				Iniciar Sesión
			</Heading>
		</div>
	{/if}

	{#if errorMessage}
		<div class="login-alert" role="alert">
			<span class="material-symbols-rounded alert-icon">error</span>
			<span class="alert-text">{errorMessage}</span>
		</div>
	{/if}

	<form onsubmit={handleSubmit} novalidate class="login-form">
		<Input
			type="email"
			name="email"
			label="Correo Electrónico"
			placeholder="tu.usuario@ejemplo.com"
			required={true}
			bind:value={email}
			error={emailError}
			iconLeading="mail"
			autocomplete="email"
			disabled={loading}
		/>

		<Input
			type="password"
			name="password"
			label="Contraseña"
			placeholder="••••••••"
			required={true}
			bind:value={password}
			iconLeading="lock"
			autocomplete="current-password"
			disabled={loading}
		/>

		<div class="login-options">
			<label class="remember-label">
				<input
					type="checkbox"
					bind:checked={remember}
					disabled={loading}
					class="remember-checkbox"
				/>
				<span>Recordarme</span>
			</label>

			{#if onforgotpassword}
				<button type="button" class="link-btn" onclick={onforgotpassword} disabled={loading}>
					¿Olvidaste tu contraseña?
				</button>
			{:else}
				<a href="/forgot-password" class="link-btn"> ¿Olvidaste tu contraseña? </a>
			{/if}
		</div>

		<div class="login-actions">
			<Button
				type="submit"
				variant="primary"
				size="lg"
				fullWidth={true}
				{loading}
				iconLeading="login"
			>
				{loading ? 'Ingresando...' : 'Iniciar Sesión'}
			</Button>
		</div>

		<div class="login-footer">
			<span class="footer-text">¿Aún no tienes una cuenta?</span>
			{#if onregister}
				<button type="button" class="link-highlight" onclick={onregister} disabled={loading}>
					Regístrate aquí
				</button>
			{:else}
				<a href="/register" class="link-highlight"> Regístrate aquí </a>
			{/if}
		</div>
	</form>
</div>

<style>
	.login-form-container {
		width: 100%;
	}

	.login-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.login-alert {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.75rem 1rem;
		background-color: var(--error-container);
		color: var(--on-error-container);
		border: 1px solid var(--error);
		border-radius: var(--radius-md);
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		animation: shake 0.3s ease-in-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	.alert-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.alert-text {
		flex: 1;
	}

	.login-form {
		display: flex;
		flex-direction: column;
	}

	.login-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: -0.25rem;
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
	}

	.remember-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		cursor: pointer;
		user-select: none;
	}

	.remember-checkbox {
		accent-color: var(--primary);
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.link-btn {
		background: none;
		border: none;
		padding: 0;
		color: var(--primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: var(--transition);
	}

	.link-btn:hover {
		color: var(--primary-dark);
		text-decoration: underline;
	}

	.login-actions {
		margin-top: 0.5rem;
	}

	.login-footer {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
	}

	.footer-text {
		color: var(--text-secondary);
	}

	.link-highlight {
		background: none;
		border: none;
		padding: 0;
		color: var(--primary);
		font-weight: 700;
		cursor: pointer;
		text-decoration: none;
		transition: var(--transition);
	}

	.link-highlight:hover {
		color: var(--primary-dark);
		text-decoration: underline;
	}
</style>
