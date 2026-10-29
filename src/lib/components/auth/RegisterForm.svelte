<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	/**
	 * @typedef {Object} RegisterFormProps
	 * @property {(data: any) => void} [onsuccess]
	 * @property {() => void} [onlogin]
	 * @property {boolean} [embedded=false]
	 */

	/** @type {RegisterFormProps} */
	let { onsuccess, onlogin, embedded = false } = $props();

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let mobile = $state('');
	let semanticContext = $state('');
	let password = $state('');
	let passwordConfirm = $state('');

	let loading = $state(false);
	let errorMessage = $state('');

	// Validaciones reactivas en tiempo real
	const isEmailValid = $derived(!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const emailError = $derived(
		!isEmailValid ? 'Ingresa un correo electrónico con formato válido.' : undefined
	);

	const isPasswordLengthValid = $derived(!password || password.length >= 8);
	const passwordError = $derived(
		!isPasswordLengthValid ? 'La contraseña debe tener un mínimo de 8 caracteres.' : undefined
	);

	const passwordsMatch = $derived(!passwordConfirm || password === passwordConfirm);
	const passwordConfirmError = $derived(
		!passwordsMatch ? 'Las contraseñas no coinciden.' : undefined
	);

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';

		if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !passwordConfirm) {
			errorMessage = 'Por favor, completa todos los campos requeridos con asterisco (*).';
			return;
		}

		if (!isEmailValid) {
			errorMessage = 'Por favor, introduce un correo electrónico válido.';
			return;
		}

		if (!isPasswordLengthValid) {
			errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
			return;
		}

		if (!passwordsMatch) {
			errorMessage = 'Las contraseñas no coinciden.';
			return;
		}

		loading = true;
		try {
			const result = await authService.register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password,
				passwordConfirm,
				mobile: mobile.trim(),
				semanticContext: semanticContext.trim()
			});

			toast.success(result.message || '¡Cuenta creada exitosamente!');

			if (onsuccess) {
				onsuccess(result);
			}
		} catch (err) {
			errorMessage = err.message || 'Error al procesar el registro. Intenta nuevamente.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="register-form-container" class:register-form-container--embedded={embedded}>
	{#if !embedded}
		<div class="register-header">
			<Heading level="h2" subtitle="Crea tu cuenta para comenzar a publicar y gestionar contenido">
				Registro de Usuario
			</Heading>
		</div>
	{/if}

	{#if errorMessage}
		<div class="register-alert" role="alert">
			<span class="material-symbols-rounded alert-icon">error</span>
			<span class="alert-text">{errorMessage}</span>
		</div>
	{/if}

	<form onsubmit={handleSubmit} novalidate class="register-form">
		<div class="form-row-2">
			<Input
				type="text"
				name="firstName"
				label="Nombre"
				placeholder="Ej: Laura"
				required={true}
				bind:value={firstName}
				iconLeading="badge"
				autocomplete="given-name"
				disabled={loading}
			/>

			<Input
				type="text"
				name="lastName"
				label="Apellido"
				placeholder="Ej: Gómez"
				required={true}
				bind:value={lastName}
				iconLeading="person"
				autocomplete="family-name"
				disabled={loading}
			/>
		</div>

		<Input
			type="email"
			name="email"
			label="Correo Electrónico"
			placeholder="tu.correo@ejemplo.com"
			required={true}
			bind:value={email}
			error={emailError}
			iconLeading="mail"
			autocomplete="email"
			disabled={loading}
		/>

		<div class="form-row-2">
			<Input
				type="tel"
				name="mobile"
				label="Teléfono / Móvil"
				placeholder="Ej: +54 9 11 2345-6789"
				bind:value={mobile}
				iconLeading="phone"
				autocomplete="tel"
				disabled={loading}
			/>

			<Input
				type="text"
				name="semanticContext"
				label="Organización / Área"
				placeholder="Ej: Redacción Central"
				bind:value={semanticContext}
				iconLeading="domain"
				helper="Opcional: Departamento o entidad"
				disabled={loading}
			/>
		</div>

		<div class="form-row-2">
			<Input
				type="password"
				name="password"
				label="Contraseña"
				placeholder="Mínimo 8 caracteres"
				required={true}
				bind:value={password}
				error={passwordError}
				iconLeading="lock"
				autocomplete="new-password"
				disabled={loading}
			/>

			<Input
				type="password"
				name="passwordConfirm"
				label="Confirmar Contraseña"
				placeholder="Repite la contraseña"
				required={true}
				bind:value={passwordConfirm}
				error={passwordConfirmError}
				iconLeading="lock_reset"
				autocomplete="new-password"
				disabled={loading}
			/>
		</div>

		<div class="register-actions">
			<Button
				type="submit"
				variant="primary"
				size="lg"
				fullWidth={true}
				{loading}
				iconLeading="person_add"
			>
				{loading ? 'Creando cuenta...' : 'Crear Cuenta'}
			</Button>
		</div>

		<div class="register-footer">
			<span class="footer-text">¿Ya tienes una cuenta registrada?</span>
			{#if onlogin}
				<button type="button" class="link-highlight" onclick={onlogin} disabled={loading}>
					Inicia sesión
				</button>
			{:else}
				<a href="/login" class="link-highlight"> Inicia sesión </a>
			{/if}
		</div>
	</form>
</div>

<style>
	.register-form-container {
		width: 100%;
	}

	.register-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.register-alert {
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

	.register-form {
		display: flex;
		flex-direction: column;
	}

	.form-row-2 {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0 1rem;
	}

	@media (min-width: 640px) {
		.form-row-2 {
			grid-template-columns: 1fr 1fr;
		}
	}

	.register-actions {
		margin-top: 0.5rem;
	}

	.register-footer {
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
