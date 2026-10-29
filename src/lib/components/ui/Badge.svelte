<script>
	/**
	 * @typedef {Object} BadgeProps
	 * @property {'default'|'primary'|'secondary'|'success'|'error'|'warning'|'info'} [variant='default']
	 * @property {'sm'|'md'} [size='md']
	 * @property {boolean} [dot=false]
	 * @property {string} [icon] - Icono opcional de Material Symbols
	 * @property {string} [class]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {BadgeProps} */
	let {
		variant = 'default',
		size = 'md',
		dot = false,
		icon,
		class: className = '',
		children
	} = $props();
</script>

<span class="badge badge--{variant} badge--{size} {className}">
	{#if dot}
		<span class="badge__dot" aria-hidden="true"></span>
	{/if}
	{#if icon}
		<span class="material-symbols-rounded badge__icon" aria-hidden="true">{icon}</span>
	{/if}
	<span class="badge__label">
		{@render children?.()}
	</span>
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-family: var(--font);
		font-weight: 600;
		line-height: 1;
		border-radius: var(--radius-full);
		white-space: nowrap;
		user-select: none;
		border: 1px solid transparent;
	}

	.badge--sm {
		padding: 0.1875rem 0.5rem;
		font-size: 0.6875rem;
	}

	.badge--md {
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
	}

	.badge__dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: currentColor;
	}

	.badge__icon {
		font-size: 0.875rem;
	}

	/* Variantes Semánticas */
	.badge--default {
		background-color: var(--surface-variant);
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.badge--primary {
		background-color: var(--primary-container);
		color: var(--on-primary-container);
	}

	.badge--secondary {
		background-color: var(--secondary-container);
		color: var(--secondary);
	}

	.badge--success {
		background-color: var(--success-container);
		color: var(--on-success-container);
	}

	.badge--error {
		background-color: var(--error-container);
		color: var(--on-error-container);
	}

	.badge--warning {
		background-color: var(--warning-container);
		color: var(--on-warning-container);
	}

	.badge--info {
		background-color: var(--info-container);
		color: var(--on-info-container);
	}
</style>
