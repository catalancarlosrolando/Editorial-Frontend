<script>
	import { page } from '$app/state';
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	const tokenParam = $derived(page.url.searchParams.get('token') || '');
	const emailParam = $derived(page.url.searchParams.get('email') || '');

	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let token = $state('');

	// Sincronizar parámetros de URL
	$effect(() => {
		if (emailParam && !email) email = emailParam;
		if (tokenParam && !token) token = tokenParam;
	});

	let loading = $state(false);
	let errorMessage = $state('');
	let success = $state(false);

	const isPasswordLengthValid = $derived(!password || password.length >= 8);
	const passwordError = $derived(
		!isPasswordLengthValid ? 'La contraseña debe tener al menos 8 caracteres.' : undefined
	);

	const passwordsMatch = $derived(!passwordConfirm || password === passwordConfirm);
	const passwordConfirmError = $derived(
		!passwordsMatch ? 'Las contraseñas no coinciden.' : undefined
	);

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';

		if (!token.trim() || !email.trim() || !password || !passwordConfirm) {
			errorMessage = 'Por favor, completa todos los campos requeridos.';
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
			const res = await authService.resetPassword({
				token: token.trim(),
				email: email.trim(),
				password,
				passwordConfirm
			});

			success = true;
			toast.success(res.message || 'Contraseña actualizada correctamente.');
		} catch (err) {
			errorMessage =
				err.message || 'Error al restablecer la contraseña. El token puede haber expirado.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Restablecer Contraseña — Editorialv2</title>
</svelte:head>

<div class="reset-page">
	<div class="reset-wrapper">
		<div class="brand-badge">
			<Badge variant="primary" size="md" dot={true}>Editorialv2</Badge>
			<Badge variant="default" size="md">Seguridad</Badge>
		</div>

		<Card padding="lg" class="auth-card">
			{#if success}
				<div class="success-box">
					<div class="icon-circle">
						<span class="material-symbols-rounded">check_circle</span>
					</div>
					<Heading level="h2" subtitle="Tu contraseña ha sido actualizada exitosamente.">
						¡Contraseña Restablecida!
					</Heading>
					<div class="actions">
						<Button variant="primary" size="lg" fullWidth={true} href="/login" iconLeading="login">
							Iniciar Sesión Ahora
						</Button>
					</div>
				</div>
			{:else}
				<div class="form-header">
					<Heading level="h2" subtitle="Ingresa tu nueva contraseña para acceder al sistema">
						Nueva Contraseña
					</Heading>
				</div>

				{#if errorMessage}
					<div class="alert alert--error" role="alert">
						<span class="material-symbols-rounded">error</span>
						<span>{errorMessage}</span>
					</div>
				{/if}

				<form onsubmit={handleSubmit} novalidate class="reset-form">
					<Input
						type="email"
						label="Correo Electrónico"
						bind:value={email}
						required={true}
						iconLeading="mail"
						disabled={loading || !!emailParam}
					/>

					<Input
						type="text"
						label="Token de Verificación"
						bind:value={token}
						required={true}
						iconLeading="key"
						disabled={loading || !!tokenParam}
						helper="Proporcionado en el enlace recibido por correo"
					/>

					<Input
						type="password"
						label="Nueva Contraseña"
						placeholder="Mínimo 8 caracteres"
						bind:value={password}
						required={true}
						error={passwordError}
						iconLeading="lock"
						disabled={loading}
					/>

					<Input
						type="password"
						label="Confirmar Nueva Contraseña"
						placeholder="Repite la contraseña"
						bind:value={passwordConfirm}
						required={true}
						error={passwordConfirmError}
						iconLeading="lock_reset"
						disabled={loading}
					/>

					<div class="submit-action">
						<Button
							type="submit"
							variant="primary"
							size="lg"
							fullWidth={true}
							{loading}
							iconLeading="check"
						>
							{loading ? 'Guardando...' : 'Restablecer Contraseña'}
						</Button>
					</div>

					<div class="footer-link">
						<a href="/login" class="link">Volver al Inicio de Sesión</a>
					</div>
				</form>
			{/if}
		</Card>
	</div>
</div>

<style>
	.reset-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	}

	.reset-wrapper {
		width: 100%;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.brand-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	:global(.auth-card) {
		width: 100%;
		box-shadow: var(--shadow-lg) !important;
		border-radius: var(--radius-xl) !important;
	}

	.form-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.alert {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.alert--error {
		background-color: var(--error-container);
		color: var(--on-error-container);
		border: 1px solid var(--error);
	}

	.reset-form {
		display: flex;
		flex-direction: column;
	}

	.submit-action {
		margin-top: 0.75rem;
	}

	.footer-link {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
	}

	.link {
		color: var(--primary);
		font-weight: 600;
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	.success-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1rem 0;
		gap: 1rem;
	}

	.icon-circle {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--success-container);
		color: var(--success);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-circle .material-symbols-rounded {
		font-size: 2.25rem;
	}

	.actions {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>