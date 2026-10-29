<script>
	import { toast } from '#lib/stores/toastStore.svelte.js';

	/**
	 * @param {import('#lib/stores/toastStore.svelte.js').ToastType} type
	 */
	function getIcon(type) {
		switch (type) {
			case 'success':
				return 'check_circle';
			case 'error':
				return 'cancel';
			case 'warning':
				return 'warning';
			case 'info':
			default:
				return 'info';
		}
	}
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
	{#each toast.items as item (item.id)}
		<div class="toast toast--{item.type}" role="status">
			<span class="material-symbols-rounded toast__icon" aria-hidden="true">
				{getIcon(item.type)}
			</span>
			<div class="toast__content">
				<p class="toast__message">{item.message}</p>
			</div>
			<button
				type="button"
				class="toast__close"
				onclick={() => toast.remove(item.id)}
				aria-label="Cerrar notificación"
			>
				<span class="material-symbols-rounded">close</span>
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 420px;
		width: calc(100% - 2.5rem);
		pointer-events: none;
	}

	.toast {
		pointer-events: auto;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-radius: var(--radius-md);
		background-color: var(--surface);
		box-shadow: var(--shadow-lg);
		border-left: 4px solid transparent;
		animation: toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		transition: var(--transition);
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.toast--success {
		border-left-color: var(--success);
	}
	.toast--success .toast__icon {
		color: var(--success);
	}

	.toast--error {
		border-left-color: var(--error);
	}
	.toast--error .toast__icon {
		color: var(--error);
	}

	.toast--warning {
		border-left-color: var(--warning);
	}
	.toast--warning .toast__icon {
		color: var(--warning);
	}

	.toast--info {
		border-left-color: var(--info);
	}
	.toast--info .toast__icon {
		color: var(--info);
	}

	.toast__icon {
		font-size: 1.35rem;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.toast__content {
		flex: 1;
		min-width: 0;
	}

	.toast__message {
		font-size: 0.875rem;
		line-height: 1.4;
		color: var(--text);
		margin: 0;
		word-break: break-word;
	}

	.toast__close {
		background: none;
		border: none;
		color: var(--text-muted);
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition);
	}

	.toast__close:hover {
		color: var(--text);
	}

	.toast__close .material-symbols-rounded {
		font-size: 1.125rem;
	}
</style>
