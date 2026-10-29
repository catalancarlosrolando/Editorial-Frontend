<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import { device } from '#lib/stores/deviceStore.svelte.js';
	import { deviceService } from '#lib/services/deviceService.js';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	/**
	 * @typedef {Object} DeviceLoginFormProps
	 * @property {(data: any) => void} [onsuccess]
	 * @property {boolean} [embedded=false]
	 */

	/** @type {DeviceLoginFormProps} */
	let { onsuccess, embedded = false } = $props();

	let uid = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';

		if (!uid.trim()) {
			errorMessage = 'Ingresa el código UID del dispositivo.';
			return;
		}

		loading = true;
		try {
			const res = await deviceService.login(uid.trim());
			toast.success(res.message || 'Pantalla conectada exitosamente.');
			uid = '';

			if (onsuccess) {
				onsuccess(res);
			}
		} catch (err) {
			errorMessage =
				err.message || 'No se pudo conectar el dispositivo. Verifica el UID ingresado.';
		} finally {
			loading = false;
		}
	}

	function handleDisconnect() {
		deviceService.logout();
		toast.info('Dispositivo de pantalla desconectado.');
	}
</script>

<div class="device-login-container" class:device-login-container--embedded={embedded}>
	{#if !embedded}
		<div class="device-header">
			<Heading
				level="h2"
				subtitle="Vincula una pantalla física ingresando su Identificador Único (UID)"
			>
				Acceso para Dispositivos
			</Heading>
		</div>
	{/if}

	{#if device.isAuthenticated}
		<div class="device-connected-card">
			<div class="device-icon-box">
				<span class="material-symbols-rounded">tv</span>
			</div>

			<Badge variant="success" size="md" dot={true}>Dispositivo Enlazado</Badge>

			<div class="device-meta">
				<span class="meta-label">UID Registrado:</span>
				<code class="meta-code">{device.device?.uid || '—'}</code>
			</div>

			{#if device.device?.name}
				<p class="device-name">{device.device.name}</p>
			{/if}

			<div class="device-actions">
				<Button
					variant="primary"
					size="md"
					fullWidth={true}
					href="/device/player"
					iconLeading="play_circle"
				>
					Iniciar Reproductor Kiosk
				</Button>

				<Button
					variant="outline"
					size="md"
					fullWidth={true}
					onclick={handleDisconnect}
					iconLeading="link_off"
				>
					Desconectar Pantalla
				</Button>
			</div>
		</div>
	{:else}
		{#if errorMessage}
			<div class="device-alert" role="alert">
				<span class="material-symbols-rounded alert-icon">error</span>
				<span class="alert-text">{errorMessage}</span>
			</div>
		{/if}

		<form onsubmit={handleSubmit} novalidate class="device-form">
			<Input
				type="text"
				name="deviceUid"
				label="Identificador UID de Pantalla"
				placeholder="Ej: DISP-A1B2 o 123456"
				required={true}
				bind:value={uid}
				iconLeading="devices"
				autocomplete="off"
				disabled={loading}
				helper="El identificador configurado por el administrador para este hardware"
			/>

			<div class="device-form-actions">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					fullWidth={true}
					{loading}
					iconLeading="sensors"
				>
					{loading ? 'Vinculando...' : 'Conectar Dispositivo'}
				</Button>
			</div>

			<div class="device-info-box">
				<span class="material-symbols-rounded info-icon">info</span>
				<p class="info-text">
					Este modo es exclusivo para pantallas de exhibición y monitores de cartelería digital. Si
					eres editor o administrador, inicia sesión como usuario.
				</p>
			</div>
		</form>
	{/if}
</div>

<style>
	.device-login-container {
		width: 100%;
	}

	.device-header {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.device-alert {
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

	.device-form {
		display: flex;
		flex-direction: column;
	}

	.device-form-actions {
		margin-top: 0.5rem;
	}

	.device-info-box {
		margin-top: 1.5rem;
		padding: 0.75rem 1rem;
		background-color: var(--surface-variant);
		border-radius: var(--radius-md);
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
	}

	.info-icon {
		font-size: 1.25rem;
		color: var(--text-muted);
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.info-text {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		line-height: 1.4;
		margin: 0;
	}

	.device-connected-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1rem 0;
		gap: 0.875rem;
	}

	.device-icon-box {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--primary-container);
		color: var(--on-primary-container);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.device-icon-box .material-symbols-rounded {
		font-size: 2.25rem;
	}

	.device-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.meta-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.meta-code {
		font-family: var(--font-mono);
		font-weight: 700;
		background-color: var(--surface-variant);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		color: var(--text);
	}

	.device-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.device-actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}
</style>
