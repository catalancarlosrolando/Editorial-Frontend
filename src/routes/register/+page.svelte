<script>
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import RegisterForm from '#lib/components/auth/RegisterForm.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { auth } from '#lib/stores/authStore.svelte.js';

	function handleSuccess() {
		if (typeof window !== 'undefined') {
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>Crear Cuenta — Editorialv2</title>
</svelte:head>

<div class="register-page">
	<div class="register-wrapper">
		<div class="brand-badge">
			<Badge variant="primary" size="md" dot={true}>Editorialv2</Badge>
			<Badge variant="default" size="md">Alta de Usuarios</Badge>
		</div>

		{#if auth.isAuthenticated}
			<Card padding="lg" class="auth-card">
				<div class="already-logged">
					<div class="avatar-circle">
						{auth.userInitials}
					</div>
					<h3>¡Ya has iniciado sesión!</h3>
					<p class="user-info">
						Actualmente estás conectado como <strong>{auth.user?.name}</strong>.
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
				<RegisterForm onsuccess={handleSuccess} />
			</Card>
		{/if}

		<div class="register-legal">
			<p>© 2026 Editorialv2. Plataforma de Gestión Editorial.</p>
		</div>
	</div>
</div>

<style>
	.register-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	}

	.register-wrapper {
		width: 100%;
		max-width: 580px;
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

	.register-legal {
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: center;
	}
</style>
