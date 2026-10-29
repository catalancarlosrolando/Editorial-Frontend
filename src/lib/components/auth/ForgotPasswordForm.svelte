<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	/**
	 * @typedef {Object} ForgotPasswordFormProps
	 * @property {() => void} [onsuccess]
	 * @property {() => void} [onbacktologin]
	 * @property {boolean} [embedded=false]
	 */

	/** @type {ForgotPasswordFormProps} */
	let { onsuccess, onbacktologin, embedded = false } = $props();

	let email = $state('');
	let loading = $state(false);
	let errorMessage = $state('');
	let isSubmitted = $state(false);
	let successMessage = $state('');

	const isEmailValid = $derived(!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const emailError = $derived(
		!isEmailValid ? 'Ingresa un correo electrónico con formato válido.' : undefined
	);

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!email.trim()) {
			errorMessage = 'Por favor, ingresa tu correo electrónico registrado.';
			return;
		}

		if (!isEmailValid) {
			errorMessage = 'El correo electrónico no tiene un formato válido.';
			return;
		}

		loading = true;
		try {
			const res = await authService.forgotPassword(email.trim());
			isSubmitted = true;
			successMessage =
				res.message || 'Se ha enviado un enlace de recuperación a tu correo electrónico.';
			toast.success(successMessage);

			if (onsuccess) {
				onsuccess();
			}
		} catch (err) {
			errorMessage =
				err.message ||
				'No se pudo enviar el correo de recuperación. Verifica el correo e intenta nuevamente.';
		} finally {
			loading = false;
		}
	}

	function handleResetForm() {
		isSubmitted = false;
		errorMessage = '';
		successMessage = '';
	}
</script>

<div class="forgot-container" class:forgot-container--embedded={embedded}>
	{#if !embedded}
		<div class="forgot-header">
			<Heading
				level="h2"
				subtitle="Te enviaremos un correo para que puedas restablecer el acceso a tu cuenta"
			>
				Recuperar Contraseña
			</Heading>
		</div>
	{/if}

	{#if errorMessage}
		<div class="forgot-alert forgot-alert--error" role="alert">
			<span class="material-symbols-rounded alert-icon">error</span>
			<span class="alert-text">{errorMessage}</span>
		</div>
	{/if}

	{#if isSubmitted}
		<div class="success-card">
			<div class="success-icon-wrapper">
				<span class="material-symbols-rounded success-icon">mark_email_read</span>
			</div>

			<h3 class="success-title">¡Revisa tu bandeja de entrada!</h3>
			<p class="success-desc">
				Hemos enviado las instrucciones para restablecer tu contraseña a <strong>{email}</strong>.
			</p>
			<p class="success-subdesc">
				Si no recibes el correo en unos minutos, revisa tu carpeta de correo no deseado (spam).
			</p>

			<div class="success-actions">
				<Button
					variant="outline"
					size="md"
					fullWidth={true}
					onclick={handleResetForm}
					iconLeading="refresh"
				>
					Probar con otro correo
				</Button>

				{#if onbacktologin}
					<Button
						variant="primary"
						size="md"
						fullWidth={true}
						onclick={onbacktologin}
						iconLeading="arrow_back"
					>
						Volver al Inicio de Sesión
					</Button>
				{:else}
					<Button
						variant="primary"
						size="md"
						fullWidth={true}
						href="/login"
						iconLeading="arrow_back"
					>
						Volver al Inicio de Sesión
					</Button>
				{/if}
			</div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} novalidate class="forgot-form">
			<Input
				type="email"
				name="email"
				label="Correo Electrónico Registrado"
				placeholder="tu.correo@ejemplo.com"
				required={true}
				bind:value={email}
				error={emailError}
				iconLeading="mail"
				autocomplete="email"
				disabled={loading}
				helper="Ingresa el correo asociado a tu cuenta"
			/>

			<div class="forgot-actions">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					fullWidth={true}
					{loading}
					iconLeading="send"
				>
					{loading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
				</Button>
			</div>

			<div class="forgot-footer">
				<span class="footer-text">¿Recordaste tu contraseña?</span>
				{#if onbacktologin}
					<button type="button" class="link-highlight" onclick={onbacktologin} disabled={loading}>
						Iniciar sesión
					</button>
				{:else}
					<a href="/login" class="link-highlight"> Iniciar sesión </a>
				{/if}
			</div>
		</form>
	{/if}
</div>

<style>
	.forgot-container {
		width: 100%;
	}

	.forgot-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.forgot-alert {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.forgot-alert--error {
		background-color: var(--error-container);
		color: var(--on-error-container);
		border: 1px solid var(--error);
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

	.forgot-form {
		display: flex;
		flex-direction: column;
	}

	.forgot-actions {
		margin-top: 0.75rem;
	}

	.forgot-footer {
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

	.success-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1rem 0;
		gap: 0.75rem;
		animation: fade-in 0.3s ease-out;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.success-icon-wrapper {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--success-container);
		color: var(--success);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.success-icon {
		font-size: 2rem;
	}

	.success-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}

	.success-desc {
		font-size: 0.9375rem;
		color: var(--text);
		margin: 0;
		line-height: 1.5;
	}

	.success-subdesc {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.success-actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}
</style>
