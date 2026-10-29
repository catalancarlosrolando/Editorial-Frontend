<script>
	/**
	 * @typedef {Object} ButtonProps
	 * @property {'primary'|'secondary'|'danger'|'outline'|'ghost'|'link'} [variant='primary']
	 * @property {'sm'|'md'|'lg'} [size='md']
	 * @property {'button'|'submit'|'reset'} [type='button']
	 * @property {boolean} [disabled=false]
	 * @property {boolean} [loading=false]
	 * @property {string} [href] - Si se provee, se renderiza como enlace <a> accesible
	 * @property {string} [target]
	 * @property {string} [rel]
	 * @property {string} [iconLeading] - Nombre del icono de Material Symbols al inicio
	 * @property {string} [iconTrailing] - Nombre del icono de Material Symbols al final
	 * @property {boolean} [fullWidth=false]
	 * @property {string} [class] - Clases CSS adicionales
	 * @property {((e: MouseEvent) => void)} [onclick]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {ButtonProps} */
	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		loading = false,
		href,
		target,
		rel,
		iconLeading,
		iconTrailing,
		fullWidth = false,
		class: className = '',
		onclick,
		children,
		...restProps
	} = $props();

	const isDisabled = $derived(disabled || loading);
	const computedRel = $derived(target === '_blank' ? rel || 'noopener noreferrer' : rel);
</script>

{#if href}
	<a
		{href}
		{target}
		rel={computedRel}
		class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {isDisabled
			? 'btn--disabled'
			: ''} {className}"
		aria-disabled={isDisabled}
		tabindex={isDisabled ? -1 : undefined}
		{onclick}
		{...restProps}
	>
		{#if loading}
			<span class="btn__spinner" aria-hidden="true"></span>
		{:else if iconLeading}
			<span class="material-symbols-rounded btn__icon btn__icon--leading">{iconLeading}</span>
		{/if}

		<span class="btn__label">
			{@render children?.()}
		</span>

		{#if !loading && iconTrailing}
			<span class="material-symbols-rounded btn__icon btn__icon--trailing">{iconTrailing}</span>
		{/if}
	</a>
{:else}
	<button
		{type}
		class="btn btn--{variant} btn--{size} {fullWidth ? 'btn--full' : ''} {className}"
		disabled={isDisabled}
		aria-busy={loading}
		{onclick}
		{...restProps}
	>
		{#if loading}
			<span class="btn__spinner" aria-hidden="true"></span>
		{:else if iconLeading}
			<span class="material-symbols-rounded btn__icon btn__icon--leading">{iconLeading}</span>
		{/if}

		<span class="btn__label">
			{@render children?.()}
		</span>

		{#if !loading && iconTrailing}
			<span class="material-symbols-rounded btn__icon btn__icon--trailing">{iconTrailing}</span>
		{/if}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font);
		font-weight: 600;
		line-height: 1;
		border-radius: var(--radius-md);
		border: 1px solid transparent;
		cursor: pointer;
		text-align: center;
		white-space: nowrap;
		transition: var(--transition);
		user-select: none;
		text-decoration: none;
	}

	.btn--full {
		width: 100%;
	}

	/* Tamaños */
	.btn--sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		height: 32px;
	}

	.btn--md {
		padding: 0.5rem 1.125rem;
		font-size: 0.9375rem;
		height: 40px;
	}

	.btn--lg {
		padding: 0.625rem 1.5rem;
		font-size: 1.0625rem;
		height: 48px;
	}

	/* Variantes */
	.btn--primary {
		background-color: var(--primary);
		color: var(--on-primary);
		border-color: var(--primary);
		box-shadow: var(--shadow-xs);
	}
	.btn--primary:hover:not(:disabled):not(.btn--disabled) {
		background-color: var(--primary-dark);
		border-color: var(--primary-dark);
		box-shadow: var(--shadow-sm);
	}

	.btn--secondary {
		background-color: var(--surface-variant);
		color: var(--text);
		border-color: var(--border);
	}
	.btn--secondary:hover:not(:disabled):not(.btn--disabled) {
		background-color: #e2e8f0;
		color: var(--text);
	}

	.btn--danger {
		background-color: var(--error);
		color: #ffffff;
		border-color: var(--error);
	}
	.btn--danger:hover:not(:disabled):not(.btn--disabled) {
		background-color: var(--on-error-container);
		border-color: var(--on-error-container);
	}

	.btn--outline {
		background-color: transparent;
		color: var(--primary);
		border-color: var(--primary);
	}
	.btn--outline:hover:not(:disabled):not(.btn--disabled) {
		background-color: var(--primary-container);
		color: var(--on-primary-container);
	}

	.btn--ghost {
		background-color: transparent;
		color: var(--text-secondary);
		border-color: transparent;
	}
	.btn--ghost:hover:not(:disabled):not(.btn--disabled) {
		background-color: var(--surface-variant);
		color: var(--text);
	}

	.btn--link {
		background-color: transparent;
		color: var(--primary);
		border-color: transparent;
		padding: 0;
		height: auto;
	}
	.btn--link:hover:not(:disabled):not(.btn--disabled) {
		text-decoration: underline;
	}

	/* Estados Disabled */
	.btn:disabled,
	.btn--disabled {
		opacity: 0.55;
		cursor: not-allowed;
		pointer-events: none;
		box-shadow: none;
	}

	/* Iconos */
	.btn__icon {
		font-size: 1.15em;
		flex-shrink: 0;
	}

	/* Spinner de carga */
	.btn__spinner {
		width: 1em;
		height: 1em;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: btn-spin 0.65s linear infinite;
		flex-shrink: 0;
	}

	@keyframes btn-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
