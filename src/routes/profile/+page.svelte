<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import UserProfileView from '#lib/components/profile/UserProfileView.svelte';
	import { auth } from '#lib/stores/authStore.svelte.js';
</script>

<svelte:head>
	<title>Mi Perfil — Editorialv2</title>
</svelte:head>

<div class="profile-page-container">
	<header class="profile-page-header">
		<div class="brand-group">
			<a href="/" class="brand-link">
				<span class="brand-dot"></span>
				<Heading level="h2" size="lg" color="primary">Editorialv2</Heading>
			</a>
			<span class="separator">/</span>
			<span class="current-section">Mi Perfil</span>
		</div>

		<nav class="nav-actions">
			<Button variant="ghost" size="sm" href="/" iconLeading="home">Inicio</Button>
			<Button variant="ghost" size="sm" href="/design" iconLeading="palette">Catálogo UI</Button>
		</nav>
	</header>

	<main class="profile-page-main">
		{#if auth.isAuthenticated}
			<UserProfileView />
		{:else}
			<Card padding="lg" class="unauth-card">
				<div class="unauth-content">
					<div class="icon-circle">
						<span class="material-symbols-rounded">lock</span>
					</div>

					<Badge variant="warning" size="md">Acceso Requerido</Badge>

					<Heading
						level="h2"
						subtitle="Debes iniciar sesión con tu cuenta para visualizar los detalles de tu perfil"
					>
						Inicia Sesión para Continuar
					</Heading>

					<div class="unauth-actions">
						<Button variant="primary" size="lg" href="/login" iconLeading="login">
							Iniciar Sesión
						</Button>
						<Button variant="outline" size="lg" href="/register" iconLeading="person_add">
							Crear Cuenta
						</Button>
					</div>
				</div>
			</Card>
		{/if}
	</main>
</div>

<style>
	.profile-page-container {
		max-width: 1040px;
		margin: 0 auto;
		padding: 1.5rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.profile-page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.brand-group {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.brand-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}

	.brand-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--primary);
		box-shadow: 0 0 0 4px var(--primary-container);
	}

	.separator {
		color: var(--text-muted);
		font-weight: 300;
	}

	.current-section {
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.9375rem;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.profile-page-main {
		flex: 1;
	}

	:global(.unauth-card) {
		max-width: 520px;
		margin: 3rem auto;
		text-align: center;
	}

	.unauth-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 1rem 0;
	}

	.icon-circle {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--warning-container);
		color: var(--warning);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-circle .material-symbols-rounded {
		font-size: 2.25rem;
	}

	.unauth-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 0.5rem;
		width: 100%;
	}
</style>
