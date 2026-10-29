<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import { auth } from '#lib/stores/authStore.svelte.js';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	async function handleLogout() {
		await authService.logout();
		toast.info('Has cerrado sesión correctamente.');
	}
</script>

<svelte:head>
	<title>Editorialv2 — Inicio</title>
</svelte:head>

<div class="home-container">
	<header class="home-header">
		<div class="brand-group">
			<span class="brand-dot"></span>
			<Heading level="h2" size="lg" color="primary">Editorialv2</Heading>
		</div>

		<nav class="nav-links">
			<Button variant="ghost" size="sm" href="/design" iconLeading="palette">Catálogo UI</Button>

			{#if auth.isAuthenticated}
				<div class="user-pill">
					<div class="user-avatar">{auth.userInitials}</div>
					<span class="user-name">{auth.user?.name}</span>
				</div>
				<Button variant="outline" size="sm" iconLeading="logout" onclick={handleLogout}>
					Salir
				</Button>
			{:else}
				<Button variant="ghost" size="sm" href="/register" iconLeading="person_add">
					Registrarse
				</Button>
				<Button variant="primary" size="sm" href="/login" iconLeading="login">
					Iniciar Sesión
				</Button>
			{/if}
		</nav>
	</header>

	<main class="home-main">
		<Card padding="lg" class="welcome-card">
			{#if auth.isAuthenticated}
				<div class="auth-welcome">
					<Badge variant="success" dot={true}>Sesión Activa</Badge>
					<Heading level="h1" subtitle="Panel de control principal y gestión editorial">
						¡Bienvenido, {auth.user?.name}!
					</Heading>

					<div class="user-details">
						<div class="detail-item">
							<span class="detail-label">Correo:</span>
							<span class="detail-val">{auth.user?.email}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Roles:</span>
							<div class="badges-row">
								{#if auth.roles.length > 0}
									{#each auth.roles as role}
										<Badge variant="primary">{role}</Badge>
									{/each}
								{:else}
									<Badge variant="default">Sin roles asignados</Badge>
								{/if}
							</div>
						</div>
					</div>

					<div class="actions-row">
						<Button variant="primary" iconLeading="dashboard">Ir al Dashboard</Button>
						<Button variant="secondary" href="/design" iconLeading="palette">
							Ver Design System
						</Button>
					</div>
				</div>
			{:else}
				<div class="guest-welcome">
					<Badge variant="primary" dot={true}>Fase 1.2: Registro de Usuario</Badge>
					<Heading
						level="h1"
						subtitle="Sistema integral de publicaciones y pantallas digitales en SvelteKit."
					>
						Plataforma Editorialv2
					</Heading>

					<p class="description">
						Los módulos de inicio de sesión y registro de usuarios ya se encuentran disponibles para
						su verificación. Inicia sesión con tus credenciales, date de alta en la plataforma o
						explora el catálogo de componentes.
					</p>

					<div class="actions-row">
						<Button variant="primary" size="lg" href="/login" iconLeading="login">
							Iniciar Sesión
						</Button>
						<Button variant="secondary" size="lg" href="/register" iconLeading="person_add">
							Crear Cuenta
						</Button>
						<Button variant="outline" size="lg" href="/design" iconLeading="palette">
							Catálogo UI
						</Button>
					</div>
				</div>
			{/if}
		</Card>
	</main>
</div>

<style>
	.home-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 1.5rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.home-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border);
		margin-bottom: 2.5rem;
	}

	.brand-group {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.brand-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--primary);
		box-shadow: 0 0 0 4px var(--primary-container);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.625rem;
		background-color: var(--surface-variant);
		border-radius: var(--radius-full);
	}

	.user-avatar {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background-color: var(--primary);
		color: #ffffff;
		font-size: 0.75rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
	}

	.home-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.auth-welcome,
	.guest-welcome {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.description {
		font-size: 1.0625rem;
		color: var(--text-secondary);
		max-width: 600px;
		line-height: 1.6;
	}

	.user-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: var(--surface-variant);
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.9375rem;
	}

	.detail-label {
		font-weight: 700;
		color: var(--text-secondary);
		min-width: 80px;
	}

	.detail-val {
		color: var(--text);
	}

	.badges-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.actions-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.875rem;
		margin-top: 0.5rem;
	}
</style>
