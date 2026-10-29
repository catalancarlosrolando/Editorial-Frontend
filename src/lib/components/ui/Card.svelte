<script>
	/**
	 * @typedef {Object} CardProps
	 * @property {'sm'|'md'|'lg'|'none'} [padding='md']
	 * @property {boolean} [hoverable=false]
	 * @property {string} [class]
	 * @property {import('svelte').Snippet} [header]
	 * @property {import('svelte').Snippet} [children]
	 * @property {import('svelte').Snippet} [footer]
	 */

	/** @type {CardProps} */
	let {
		padding = 'md',
		hoverable = false,
		class: className = '',
		header,
		children,
		footer
	} = $props();
</script>

<div class="card card--padding-{padding} {hoverable ? 'card--hoverable' : ''} {className}">
	{#if header}
		<div class="card__header">
			{@render header()}
		</div>
	{/if}

	<div class="card__body">
		{@render children?.()}
	</div>

	{#if footer}
		<div class="card__footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style>
	.card {
		background-color: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		transition: var(--transition);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.card--hoverable:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--primary-light);
		transform: translateY(-2px);
	}

	/* Relleno */
	.card--padding-none .card__body {
		padding: 0;
	}
	.card--padding-sm .card__body {
		padding: 0.875rem;
	}
	.card--padding-md .card__body {
		padding: 1.25rem;
	}
	.card--padding-lg .card__body {
		padding: 1.75rem;
	}

	.card__header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-light);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.card__footer {
		padding: 0.875rem 1.25rem;
		border-top: 1px solid var(--border-light);
		background-color: var(--surface-variant);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.card__body {
		flex: 1;
	}
</style>
