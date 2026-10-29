<script>
	/**
	 * @typedef {Object} ModalProps
	 * @property {boolean} [open=false] - Control de apertura bidireccional ($bindable)
	 * @property {string} [title] - Título del diálogo
	 * @property {'sm'|'md'|'lg'|'xl'} [size='md'] - Ancho máximo del modal
	 * @property {boolean} [closeOnBackdrop=true] - Si se cierra al hacer clic fuera
	 * @property {boolean} [closeOnEscape=true] - Si se cierra con la tecla Escape
	 * @property {() => void} [onclose] - Callback al cerrarse
	 * @property {import('svelte').Snippet} [header] - Snippet personalizado de cabecera
	 * @property {import('svelte').Snippet} [children] - Contenido del cuerpo del modal
	 * @property {import('svelte').Snippet} [footer] - Snippet de acciones o pie del modal
	 */

	/** @type {ModalProps} */
	let {
		open = $bindable(false),
		title,
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		onclose,
		header,
		children,
		footer
	} = $props();

	const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;

	function close() {
		open = false;
		if (onclose) onclose();
	}

	function handleKeydown(event) {
		if (event.key === 'Escape' && open && closeOnEscape) {
			event.preventDefault();
			close();
		}
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget && closeOnBackdrop) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="modal-backdrop" onclick={handleBackdropClick} role="presentation">
		<div
			class="modal-dialog modal-dialog--{size}"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
		>
			<div class="modal-header">
				{#if header}
					{@render header()}
				{:else}
					<h3 id={titleId} class="modal-title">{title || ''}</h3>
				{/if}
				<button
					type="button"
					class="modal-close-btn"
					onclick={close}
					aria-label="Cerrar ventana emergente"
				>
					<span class="material-symbols-rounded">close</span>
				</button>
			</div>

			<div class="modal-body">
				{@render children?.()}
			</div>

			{#if footer}
				<div class="modal-footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background-color: rgba(15, 23, 42, 0.6);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		animation: backdrop-in 0.2s ease-out;
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-dialog {
		background-color: var(--surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		width: 100%;
		max-height: calc(100vh - 2rem);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: dialog-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.modal-dialog--sm {
		max-width: 400px;
	}
	.modal-dialog--md {
		max-width: 540px;
	}
	.modal-dialog--lg {
		max-width: 760px;
	}
	.modal-dialog--xl {
		max-width: 980px;
	}

	.modal-header {
		padding: 1.125rem 1.5rem;
		border-bottom: 1px solid var(--border-light);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.modal-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}

	.modal-close-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		padding: 0.25rem;
		border-radius: var(--radius-sm);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition);
	}

	.modal-close-btn:hover {
		color: var(--text);
		background-color: var(--surface-variant);
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border-light);
		background-color: var(--surface-variant);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
	}
</style>
