<script>
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import ForgotPasswordForm from '#lib/components/auth/ForgotPasswordForm.svelte';
</script>

<svelte:head>
	<title>Recuperar Contraseña — Editorialv2</title>
</svelte:head>

<div class="forgot-page">
	<div class="forgot-wrapper">
		<div class="brand-badge">
			<Badge variant="primary" size="md" dot={true}>Editorialv2</Badge>
			<Badge variant="default" size="md">Seguridad & Acceso</Badge>
		</div>

		<Card padding="lg" class="auth-card">
			<ForgotPasswordForm />
		</Card>

		<div class="forgot-legal">
			<p>© 2026 Editorialv2. Plataforma de Gestión Editorial.</p>
		</div>
	</div>
</div>

<style>
	.forgot-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
	}

	.forgot-wrapper {
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

	.forgot-legal {
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: center;
	}
</style>