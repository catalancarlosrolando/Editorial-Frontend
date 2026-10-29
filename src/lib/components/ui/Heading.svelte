<script>
	/**
	 * @typedef {Object} HeadingProps
	 * @property {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} [level='h1'] - Nivel de etiqueta semántica HTML
	 * @property {'2xl'|'xl'|'lg'|'md'|'sm'|'xs'} [size] - Tamaño visual (por defecto mapea al nivel)
	 * @property {'default'|'primary'|'secondary'|'muted'|'inverse'} [color='default'] - Variante de color
	 * @property {string} [subtitle] - Subtítulo o texto descriptivo complementario
	 * @property {string} [class] - Clases CSS adicionales
	 * @property {import('svelte').Snippet} [children] - Contenido del título
	 * @property {import('svelte').Snippet} [actions] - Snippet opcional para botones o acciones alineadas
	 */

	/** @type {HeadingProps} */
	let {
		level = 'h1',
		size,
		color = 'default',
		subtitle,
		class: className = '',
		children,
		actions
	} = $props();

	// Mapeo automático de tamaño visual si no se especifica explícitamente
	const computedSize = $derived(
		size ||
			(level === 'h1'
				? '2xl'
				: level === 'h2'
					? 'xl'
					: level === 'h3'
						? 'lg'
						: level === 'h4'
							? 'md'
							: level === 'h5'
								? 'sm'
								: 'xs')
	);
</script>

<div class="heading-wrapper {className}">
	<div class="heading-content">
		<svelte:element this={level} class="heading heading--{computedSize} heading--color-{color}">
			{@render children?.()}
		</svelte:element>
		{#if subtitle}
			<p class="heading-subtitle">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="heading-actions">
			{@render actions()}
		</div>
	{/if}
</div>

<style>
	.heading-wrapper {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.heading-content {
		flex: 1;
		min-width: 0;
	}

	.heading {
		font-family: var(--font);
		font-weight: 700;
		line-height: 1.25;
		margin: 0;
		letter-spacing: -0.02em;
	}

	/* Tamaños visuales */
	.heading--2xl {
		font-size: 2rem;
		font-weight: 800;
	}

	.heading--xl {
		font-size: 1.625rem;
	}

	.heading--lg {
		font-size: 1.25rem;
	}

	.heading--md {
		font-size: 1.125rem;
	}

	.heading--sm {
		font-size: 1rem;
	}

	.heading--xs {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Variantes de Color */
	.heading--color-default {
		color: var(--text);
	}

	.heading--color-primary {
		color: var(--primary);
	}

	.heading--color-secondary {
		color: var(--secondary);
	}

	.heading--color-muted {
		color: var(--text-secondary);
	}

	.heading--color-inverse {
		color: #ffffff;
	}

	.heading-subtitle {
		margin-top: 0.25rem;
		margin-bottom: 0;
		font-size: 0.9375rem;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.heading-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
