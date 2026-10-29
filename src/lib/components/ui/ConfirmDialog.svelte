<script>
	import Modal from '#lib/components/ui/Modal.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	/**
	 * @typedef {Object} ConfirmDialogProps
	 * @property {boolean} [open=false]
	 * @property {string} [title='Confirmar Acción']
	 * @property {string} [message='¿Estás seguro de realizar esta acción?']
	 * @property {string} [confirmText='Confirmar']
	 * @property {string} [cancelText='Cancelar']
	 * @property {'primary'|'danger'|'secondary'} [confirmVariant='danger']
	 * @property {string} [icon='help']
	 * @property {boolean} [loading=false]
	 * @property {() => void} [onconfirm]
	 * @property {() => void} [oncancel]
	 */

	/** @type {ConfirmDialogProps} */
	let {
		open = $bindable(false),
		title = 'Confirmar Acción',
		message = '¿Estás seguro de realizar esta acción?',
		confirmText = 'Confirmar',
		cancelText = 'Cancelar',
		confirmVariant = 'danger',
		icon = 'warning',
		loading = false,
		onconfirm,
		oncancel
	} = $props();

	function handleCancel() {
		open = false;
		if (oncancel) oncancel();
	}

	function handleConfirm() {
		if (onconfirm) onconfirm();
	}
</script>

<Modal bind:open size="sm" {title}>
	<div class="confirm-content">
		<div class="confirm-icon confirm-icon--{confirmVariant}">
			<span class="material-symbols-rounded">{icon}</span>
		</div>
		<p class="confirm-message">{message}</p>
	</div>

	{#snippet footer()}
		<Button variant="ghost" disabled={loading} onclick={handleCancel}>
			{cancelText}
		</Button>
		<Button variant={confirmVariant} {loading} onclick={handleConfirm} iconLeading="check">
			{confirmText}
		</Button>
	{/snippet}
</Modal>

<style>
	.confirm-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 0.5rem 0;
	}

	.confirm-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.confirm-icon .material-symbols-rounded {
		font-size: 1.5rem;
	}

	.confirm-icon--danger {
		background-color: var(--error-container);
		color: var(--error);
	}

	.confirm-icon--primary {
		background-color: var(--primary-container);
		color: var(--primary);
	}

	.confirm-icon--secondary {
		background-color: var(--surface-variant);
		color: var(--text-secondary);
	}

	.confirm-message {
		font-size: 0.9375rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
		padding-top: 0.25rem;
	}
</style>
