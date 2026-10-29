<script>
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import LoginForm from '#lib/components/auth/LoginForm.svelte';
	import { auth } from '#lib/stores/authStore.svelte.js';
	import Button from '#lib/components/ui/Button.svelte';

	function handleSuccess() {
		// Enrutamiento o redirección tras login exitoso
		if (typeof window !== 'undefined') {
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión — Editorialv2</title>
</svelte:head>

<div class="login-page">
	<div class="login-wrapper">
		<div class="brand-badge">
			<Badge variant="primary" size="md" dot={true}>Editorialv2</Badge>
			<Badge variant="default" size="md">Sistema de Gestión</Badge>
		</div>

		{#if auth.isAuthenticated}
			<Card padding="lg" class="auth-card">
				<div class="already-logged">
					<div class="avatar-circle">
						{auth.userInitials}
					</div>
					<h3>¡Ya has iniciado sesión!</h3>
					<p class="user-info">
						Conectado como <strong>{auth.user?.name}</strong> ({auth.user?.email})
					</p>
					<div class="already-actions">
						<Button variant="primary" href="/" iconLeading="home">Ir al Inicio</Button>
						<Button variant="outline" onclick={() => auth.clear()} iconLeading="logout">
							Cerrar Sesión
						</Button>
					</div>
				</div>
			</Card>
		{:else}
			<Card padding="lg" class="auth-card">
				<LoginForm onsuccess={handleSuccess} />
			</Card>
		{/if}

		<div class="login-legal">
			<p>© 2026 Editorialv2. Todos los derechos reservados.</p>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	}

	.login-wrapper {
		width: 100%;
		max-width: 460px;
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

	.already-logged {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.875rem;
		padding: 1rem 0;
	}

	.avatar-circle {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--primary);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 700;
		box-shadow: var(--shadow-md);
	}

	.user-info {
		font-size: 0.9375rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.already-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.75rem;
		width: 100%;
		justify-content: center;
	}

	.login-legal {
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: center;
	}
</style>
