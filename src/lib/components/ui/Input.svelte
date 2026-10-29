<script>
	/**
	 * @typedef {Object} InputProps
	 * @property {string} [id]
	 * @property {string} [name]
	 * @property {string} [label]
	 * @property {string} [type='text']
	 * @property {string} [value='']
	 * @property {string} [placeholder='']
	 * @property {string} [error]
	 * @property {string} [helper]
	 * @property {boolean} [required=false]
	 * @property {boolean} [disabled=false]
	 * @property {boolean} [readonly=false]
	 * @property {string} [iconLeading] - Icono Material Symbols a la izquierda
	 * @property {string} [iconTrailing] - Icono Material Symbols a la derecha
	 * @property {string} [autocomplete]
	 * @property {string} [class]
	 */

	/** @type {InputProps} */
	let {
		id,
		name,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		error,
		helper,
		required = false,
		disabled = false,
		readonly = false,
		iconLeading,
		iconTrailing,
		autocomplete,
		class: className = '',
		...restProps
	} = $props();

	// Generar id único si no se suministra
	const inputId = $derived(
		id || (name ? `input-${name}` : `input-${Math.random().toString(36).substring(2, 9)}`)
	);
	const errorId = $derived(error ? `${inputId}-error` : undefined);
	const helperId = $derived(helper && !error ? `${inputId}-helper` : undefined);

	// Estado para alternar visibilidad de contraseña
	let showPassword = $state(false);
	const effectiveType = $derived(type === 'password' && showPassword ? 'text' : type);
</script>

<div class="input-group {className}">
	{#if label}
		<label for={inputId} class="input-label">
			{label}
			{#if required}
				<span class="input-required" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<div
		class="input-wrapper"
		class:input-wrapper--error={!!error}
		class:input-wrapper--disabled={disabled}
	>
		{#if iconLeading}
			<span class="material-symbols-rounded input-icon input-icon--leading" aria-hidden="true">
				{iconLeading}
			</span>
		{/if}

		<input
			id={inputId}
			{name}
			type={effectiveType}
			bind:value
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{autocomplete}
			class="input-field"
			aria-invalid={!!error}
			aria-describedby={errorId || helperId}
			{...restProps}
		/>

		{#if type === 'password'}
			<button
				type="button"
				class="input-action-btn"
				onclick={() => (showPassword = !showPassword)}
				tabindex="-1"
				aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
			>
				<span class="material-symbols-rounded">
					{showPassword ? 'visibility_off' : 'visibility'}
				</span>
			</button>
		{:else if iconTrailing}
			<span class="material-symbols-rounded input-icon input-icon--trailing" aria-hidden="true">
				{iconTrailing}
			</span>
		{/if}
	</div>

	{#if error}
		<p id={errorId} class="input-feedback input-feedback--error" role="alert">
			<span class="material-symbols-rounded feedback-icon">error</span>
			<span>{error}</span>
		</p>
	{:else if helper}
		<p id={helperId} class="input-feedback input-feedback--helper">
			{helper}
		</p>
	{/if}
</div>

<style>
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		width: 100%;
		margin-bottom: 1rem;
	}

	.input-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.input-required {
		color: var(--error);
		font-weight: 700;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		position: relative;
		background-color: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		transition: var(--transition);
		box-shadow: var(--shadow-xs);
		overflow: hidden;
	}

	.input-wrapper:focus-within {
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-container);
	}

	.input-wrapper--error {
		border-color: var(--error) !important;
	}

	.input-wrapper--error:focus-within {
		box-shadow: 0 0 0 3px var(--error-container) !important;
	}

	.input-wrapper--disabled {
		background-color: var(--surface-variant);
		cursor: not-allowed;
		opacity: 0.7;
	}

	.input-field {
		flex: 1;
		width: 100%;
		height: 40px;
		padding: 0 0.875rem;
		font-family: var(--font);
		font-size: 0.9375rem;
		color: var(--text);
		background: transparent;
		border: none;
		outline: none;
	}

	.input-field::placeholder {
		color: var(--text-muted);
	}

	.input-field:disabled {
		cursor: not-allowed;
	}

	.input-icon {
		color: var(--text-muted);
		padding: 0 0.625rem;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		user-select: none;
	}

	.input-action-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		padding: 0 0.75rem;
		height: 100%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: var(--transition);
	}

	.input-action-btn:hover {
		color: var(--text);
	}

	.input-feedback {
		font-size: 0.8125rem;
		margin: 0;
		line-height: 1.3;
	}

	.input-feedback--error {
		color: var(--error);
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 500;
	}

	.feedback-icon {
		font-size: 1rem;
	}

	.input-feedback--helper {
		color: var(--text-secondary);
	}
</style>
