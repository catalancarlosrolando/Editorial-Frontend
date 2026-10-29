<script>
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import DeviceLoginForm from '#lib/components/auth/DeviceLoginForm.svelte';
	import Button from '#lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>Conectar Pantalla — Editorialv2</title>
</svelte:head>

<div class="device-page">
	<div class="device-wrapper">
		<div class="brand-badge">
			<Badge variant="secondary" size="md" dot={true}>Dispositivo de Pantalla</Badge>
			<Badge variant="default" size="md">Modo Kiosk</Badge>
		</div>

		<Card padding="lg" class="auth-card">
			<DeviceLoginForm />
		</Card>

		<div class="device-footer-actions">
			<Button variant="ghost" size="sm" href="/login" iconLeading="arrow_back">
				Volver a Acceso de Usuarios
			</Button>
		</div>

		<div class="device-legal">
			<p>© 2026 Editorialv2. Plataforma de Cartelería y Gestión Editorial.</p>
		</div>
	</div>
</div>

<style>
	.device-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	}

	.device-wrapper {
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

	.device-footer-actions {
		display: flex;
		justify-content: center;
	}

	.device-legal {
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: center;
	}
</style>
