<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import ConfirmDialog from '#lib/components/ui/ConfirmDialog.svelte';
	import { auth } from '#lib/stores/authStore.svelte.js';
	import { authService } from '#lib/services/authService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	let refreshing = $state(false);
	let resendingVerification = $state(false);
	let showLogoutConfirm = $state(false);
	let loggingOut = $state(false);
	let copiedToken = $state(false);

	const isEmailVerified = $derived(Boolean(auth.user?.email_verified_at));

	const maskedToken = $derived.by(() => {
		const token = auth.token || '';
		if (!token) return '—';
		if (token.length <= 16) return token;
		return `${token.substring(0, 8)}••••••••${token.substring(token.length - 6)}`;
	});

	async function handleRefreshProfile() {
		refreshing = true;
		try {
			await authService.getProfile();
			toast.success('Datos de perfil actualizados.');
		} catch (err) {
			toast.error('No se pudo actualizar el perfil: ' + (err.message || 'Error del servidor'));
		} finally {
			refreshing = false;
		}
	}

	async function handleResendVerification() {
		resendingVerification = true;
		try {
			const res = await authService.resendEmailVerification();
			toast.success(res.message || 'Correo de verificación reenviado.');
		} catch (err) {
			toast.error(err.message || 'No se pudo enviar el correo de verificación.');
		} finally {
			resendingVerification = false;
		}
	}

	async function handleConfirmLogout() {
		loggingOut = true;
		try {
			await authService.logout();
			showLogoutConfirm = false;
			toast.info('Has cerrado sesión correctamente.');
			if (typeof window !== 'undefined') {
				window.location.href = '/login';
			}
		} catch (err) {
			toast.error('Error al cerrar sesión: ' + err.message);
		} finally {
			loggingOut = false;
		}
	}

	async function copyTokenToClipboard() {
		if (!auth.token || typeof navigator === 'undefined') return;
		try {
			await navigator.clipboard.writeText(auth.token);
			copiedToken = true;
			toast.info('Token copiado al portapapeles.');
			setTimeout(() => {
				copiedToken = false;
			}, 3000);
		} catch {
			toast.error('No se pudo copiar el token.');
		}
	}
</script>

<div class="profile-view">
	<div class="profile-header">
		<div>
			<Heading
				level="h1"
				subtitle="Consulta tus datos de cuenta, roles asignados y estado de sesión"
			>
				Perfil de Usuario
			</Heading>
		</div>

		<div class="header-actions">
			<Button
				variant="outline"
				size="sm"
				loading={refreshing}
				onclick={handleRefreshProfile}
				iconLeading="refresh"
			>
				Actualizar Datos
			</Button>
		</div>
	</div>

	<div class="profile-grid">
		<!-- 1. INFORMACIÓN PERSONAL -->
		<Card padding="md" class="profile-card">
			{#snippet header()}
				<div class="card-title-group">
					<span class="material-symbols-rounded">person</span>
					<Heading level="h3" size="md">Información Personal</Heading>
				</div>
			{/snippet}

			<div class="personal-info">
				<div class="avatar-large">
					{auth.userInitials}
				</div>

				<div class="info-list">
					<div class="info-row">
						<span class="info-label">Identificador (ID):</span>
						<span class="info-value font-mono">#{auth.user?.id || '—'}</span>
					</div>

					<div class="info-row">
						<span class="info-label">Nombre Completo:</span>
						<span class="info-value font-bold">{auth.user?.name || '—'}</span>
					</div>

					<div class="info-row">
						<span class="info-label">Correo Electrónico:</span>
						<span class="info-value">{auth.user?.email || '—'}</span>
					</div>

					<div class="info-row">
						<span class="info-label">Estado de Verificación:</span>
						<div class="verification-status">
							{#if isEmailVerified}
								<Badge variant="success" dot={true}>Correo Verificado</Badge>
							{:else}
								<Badge variant="warning" dot={true}>Sin Verificar</Badge>
								<Button
									variant="ghost"
									size="sm"
									loading={resendingVerification}
									onclick={handleResendVerification}
									iconLeading="mail"
								>
									Reenviar Verificación
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</Card>

		<!-- 2. ROLES Y PERMISOS -->
		<Card padding="md" class="profile-card">
			{#snippet header()}
				<div class="card-title-group">
					<span class="material-symbols-rounded">shield_person</span>
					<Heading level="h3" size="md">Roles y Permisos de Acceso</Heading>
				</div>
			{/snippet}

			<div class="roles-perms-container">
				<div class="access-group">
					<p class="group-title">Roles Asignados:</p>
					<div class="badges-wrap">
						{#if auth.roles && auth.roles.length > 0}
							{#each auth.roles as role}
								<Badge variant="primary" icon="workspace_premium">{role}</Badge>
							{/each}
						{:else}
							<span class="empty-hint">Sin roles específicos asignados</span>
						{/if}
					</div>
				</div>

				<div class="access-group">
					<p class="group-title">Permisos Operativos:</p>
					<div class="badges-wrap">
						{#if auth.permissions && auth.permissions.length > 0}
							{#each auth.permissions as perm}
								<Badge variant="info" icon="key">{perm}</Badge>
							{/each}
						{:else}
							<span class="empty-hint">Sin permisos individuales otorgados</span>
						{/if}
					</div>
				</div>
			</div>
		</Card>

		<!-- 3. SEGURIDAD Y SESIÓN ACTIVA -->
		<Card padding="md" class="profile-card full-span">
			{#snippet header()}
				<div class="card-title-group">
					<span class="material-symbols-rounded">security</span>
					<Heading level="h3" size="md">Sesión Activa & Seguridad</Heading>
				</div>
			{/snippet}

			<div class="session-container">
				<div class="token-box">
					<div class="token-label-group">
						<span class="token-label">Token de Sesión (JWT):</span>
						<span class="token-hint"
							>Utilizado para autorizar peticiones hacia los microservicios</span
						>
					</div>

					<div class="token-display-row">
						<code class="token-code">{maskedToken}</code>
						<Button
							variant="secondary"
							size="sm"
							onclick={copyTokenToClipboard}
							iconLeading={copiedToken ? 'done' : 'content_copy'}
						>
							{copiedToken ? 'Copiado' : 'Copiar Token'}
						</Button>
					</div>
				</div>

				<div class="session-actions">
					<Button
						variant="danger"
						size="md"
						onclick={() => (showLogoutConfirm = true)}
						iconLeading="logout"
					>
						Cerrar Sesión
					</Button>
				</div>
			</div>
		</Card>
	</div>
</div>

<!-- Modal de Confirmación de Cierre de Sesión -->
<ConfirmDialog
	bind:open={showLogoutConfirm}
	title="¿Cerrar Sesión?"
	message="Se cerrará tu sesión actual en este navegador. Tendrás que volver a autenticarte para gestionar contenidos."
	confirmText="Cerrar Sesión"
	cancelText="Permanecer conectado"
	confirmVariant="danger"
	icon="logout"
	loading={loggingOut}
	onconfirm={handleConfirmLogout}
/>

<style>
	.profile-view {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.profile-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--border);
		padding-bottom: 1.25rem;
	}

	.card-title-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-dark);
	}

	.card-title-group .material-symbols-rounded {
		font-size: 1.35rem;
		color: var(--primary);
	}

	.profile-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 840px) {
		.profile-grid {
			grid-template-columns: 1fr 1fr;
		}
		:global(.full-span) {
			grid-column: 1 / -1;
		}
	}

	.personal-info {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: center;
	}

	@media (min-width: 480px) {
		.personal-info {
			flex-direction: row;
			align-items: flex-start;
		}
	}

	.avatar-large {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: var(--primary);
		color: #ffffff;
		font-size: 2rem;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-shadow: var(--shadow-md);
	}

	.info-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.info-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-light);
	}

	@media (min-width: 540px) {
		.info-row {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.info-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 600;
	}

	.info-value {
		font-size: 0.9375rem;
		color: var(--text);
	}

	.font-mono {
		font-family: var(--font-mono);
	}

	.font-bold {
		font-weight: 700;
	}

	.verification-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.roles-perms-container {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.access-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.group-title {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin: 0;
	}

	.badges-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.empty-hint {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-style: italic;
	}

	.session-container {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.token-box {
		background-color: var(--surface-variant);
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.token-label-group {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.token-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text);
	}

	.token-hint {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.token-display-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.token-code {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		background-color: var(--surface);
		padding: 0.375rem 0.75rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		color: var(--text);
		flex: 1;
		min-width: 220px;
	}

	.session-actions {
		display: flex;
		justify-content: flex-end;
	}
</style>
