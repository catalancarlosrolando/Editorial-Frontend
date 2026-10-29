<script>
	import Heading from '#lib/components/ui/Heading.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Modal from '#lib/components/ui/Modal.svelte';
	import { toast } from '#lib/stores/toastStore.svelte.js';

	// Estados reactivos locales para probar componentes
	let isBtnLoading = $state(false);
	let testModalOpen = $state(false);

	let inputStandard = $state('Texto de prueba');
	let inputPassword = $state('secreto123');
	let inputErrorVal = $state('correo-invalido');
	let searchVal = $state('');

	function toggleLoading() {
		isBtnLoading = !isBtnLoading;
		setTimeout(() => {
			isBtnLoading = false;
		}, 3000);
	}
</script>

<svelte:head>
	<title>Editorialv2 - Catálogo y Auditoría de Componentes Atómicos (Fase 0)</title>
</svelte:head>

<main class="audit-container">
	<!-- Encabezado de la página de auditoría -->
	<header class="audit-header">
		<div class="audit-brand">
			<Badge variant="primary" size="md" dot={true}>Fase 0: Auditoría</Badge>
			<Badge variant="success" size="md">Svelte 5 Runes</Badge>
		</div>

		<Heading
			level="h1"
			subtitle="Catálogo interactivo de componentes atómicos y tokens para la aprobación del usuario antes de implementar módulos de negocio."
		>
			Editorialv2 — Design System & Fundamentos
		</Heading>
	</header>

	<div class="audit-grid">
		<!-- 1. SECCIÓN: TIPOGRAFÍA / HEADING -->
		<section class="audit-section">
			<Card padding="md">
				{#snippet header()}
					<div class="section-title">
						<span class="material-symbols-rounded">title</span>
						<Heading level="h3" size="md">1. Tipografía Semántica (Heading.svelte)</Heading>
					</div>
				{/snippet}

				<div class="demo-stack">
					<Heading level="h1" subtitle="Subtítulo descriptivo complementario para h1">
						Encabezado Nivel 1 (h1)
					</Heading>

					<Heading level="h2" color="primary">Encabezado Nivel 2 (h2) — Color Primario</Heading>

					<Heading level="h3" color="secondary">Encabezado Nivel 3 (h3) — Color Secundario</Heading>

					<Heading level="h4" color="muted">Encabezado Nivel 4 (h4) — Color Atenuado</Heading>
				</div>
			</Card>
		</section>

		<!-- 2. SECCIÓN: BOTONES / BUTTON -->
		<section class="audit-section">
			<Card padding="md">
				{#snippet header()}
					<div class="section-title">
						<span class="material-symbols-rounded">smart_button</span>
						<Heading level="h3" size="md">2. Botones & Estados (Button.svelte)</Heading>
					</div>
				{/snippet}

				<div class="demo-stack">
					<div>
						<p class="demo-label">Variantes de Estilo:</p>
						<div class="demo-row">
							<Button variant="primary" iconLeading="save">Guardar (Primary)</Button>
							<Button variant="secondary" iconLeading="refresh">Refrescar</Button>
							<Button variant="danger" iconLeading="delete">Eliminar</Button>
							<Button variant="outline" iconLeading="filter_list">Filtros</Button>
							<Button variant="ghost" iconLeading="close">Cancelar</Button>
							<Button variant="link">Enlace de texto</Button>
						</div>
					</div>

					<div>
						<p class="demo-label">Tamaños:</p>
						<div class="demo-row">
							<Button size="sm" variant="primary">Pequeño (sm)</Button>
							<Button size="md" variant="primary">Mediano (md)</Button>
							<Button size="lg" variant="primary">Grande (lg)</Button>
						</div>
					</div>

					<div>
						<p class="demo-label">Estados Reactivos:</p>
						<div class="demo-row">
							<Button
								variant="primary"
								loading={isBtnLoading}
								onclick={toggleLoading}
								iconLeading="bolt"
							>
								{isBtnLoading ? 'Procesando...' : 'Probar Loading (3s)'}
							</Button>
							<Button variant="primary" disabled={true} iconLeading="block">Deshabilitado</Button>
						</div>
					</div>
				</div>
			</Card>
		</section>

		<!-- 3. SECCIÓN: CAMPOS DE ENTRADA / INPUT -->
		<section class="audit-section">
			<Card padding="md">
				{#snippet header()}
					<div class="section-title">
						<span class="material-symbols-rounded">edit_note</span>
						<Heading level="h3" size="md">3. Entradas de Formulario (Input.svelte)</Heading>
					</div>
				{/snippet}

				<div class="demo-grid-2">
					<Input
						label="Nombre de Usuario"
						placeholder="Ej: juan.perez"
						required={true}
						bind:value={inputStandard}
						helper="Tu identificador único en la editorial"
						iconLeading="person"
					/>

					<Input
						type="password"
						label="Contraseña"
						placeholder="••••••••"
						required={true}
						bind:value={inputPassword}
						helper="Soporta alternador nativo de visibilidad"
						iconLeading="lock"
					/>

					<Input
						type="email"
						label="Correo Electrónico (con Error)"
						placeholder="correo@ejemplo.com"
						bind:value={inputErrorVal}
						error="El formato del correo ingresado no es válido"
						iconLeading="mail"
					/>

					<Input
						type="search"
						label="Buscador Rápido"
						placeholder="Buscar publicaciones..."
						bind:value={searchVal}
						iconLeading="search"
						iconTrailing="filter_alt"
					/>
				</div>
			</Card>
		</section>

		<!-- 4. SECCIÓN: BADGES & PÍLDORAS DE ESTADO -->
		<section class="audit-section">
			<Card padding="md">
				{#snippet header()}
					<div class="section-title">
						<span class="material-symbols-rounded">label</span>
						<Heading level="h3" size="md">4. Píldoras de Estado (Badge.svelte)</Heading>
					</div>
				{/snippet}

				<div class="demo-row">
					<Badge variant="default">Por Defecto</Badge>
					<Badge variant="primary" dot={true}>Activo</Badge>
					<Badge variant="secondary" icon="devices">Dispositivo</Badge>
					<Badge variant="success" dot={true}>Aprobado</Badge>
					<Badge variant="warning" icon="schedule">Pendiente</Badge>
					<Badge variant="error" icon="block">Rechazado</Badge>
					<Badge variant="info" icon="info">Información</Badge>
				</div>
			</Card>
		</section>

		<!-- 5. SECCIÓN: TOASTS REACTIVOS & MODAL -->
		<section class="audit-section">
			<Card padding="md">
				{#snippet header()}
					<div class="section-title">
						<span class="material-symbols-rounded">notifications</span>
						<Heading level="h3" size="md">5. Notificaciones Toast & Ventanas Modales</Heading>
					</div>
				{/snippet}

				<div class="demo-stack">
					<div>
						<p class="demo-label">Disparadores del Store de Toasts:</p>
						<div class="demo-row">
							<Button
								variant="primary"
								size="sm"
								iconLeading="check_circle"
								onclick={() => toast.success('¡Operación realizada con éxito!')}
							>
								Toast Success
							</Button>
							<Button
								variant="danger"
								size="sm"
								iconLeading="error"
								onclick={() => toast.error('Ocurrió un error al procesar la solicitud.')}
							>
								Toast Error
							</Button>
							<Button
								variant="outline"
								size="sm"
								iconLeading="warning"
								onclick={() => toast.warning('Advertencia: El canal no tiene contenido.')}
							>
								Toast Warning
							</Button>
							<Button
								variant="secondary"
								size="sm"
								iconLeading="info"
								onclick={() => toast.info('Nueva actualización de sistema disponible.')}
							>
								Toast Info
							</Button>
						</div>
					</div>

					<div>
						<p class="demo-label">Diálogo Modal Accesible (Focus Trap, Escape, Backdrop):</p>
						<Button
							variant="primary"
							iconLeading="open_in_new"
							onclick={() => (testModalOpen = true)}
						>
							Abrir Modal de Demostración
						</Button>
					</div>
				</div>
			</Card>
		</section>
	</div>
</main>

<!-- Modal de Prueba -->
<Modal bind:open={testModalOpen} title="Modal de Demostración Profesional" size="md">
	<p style="margin-bottom: 1rem; color: var(--text-secondary);">
		Este modal incluye bloqueo de fondo (backdrop), soporte para cerrar presionando la tecla <strong
			>Escape</strong
		>, foco accesible y composición limpia mediante snippets de Svelte 5.
	</p>
	<Input label="Campo dentro del Modal" placeholder="Prueba interactiva..." iconLeading="chat" />

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (testModalOpen = false)}>Cancelar</Button>
		<Button
			variant="primary"
			iconLeading="check"
			onclick={() => {
				testModalOpen = false;
				toast.success('Cambios del modal confirmados.');
			}}
		>
			Confirmar Acción
		</Button>
	{/snippet}
</Modal>

<style>
	.audit-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem;
	}

	.audit-header {
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 1.5rem;
	}

	.audit-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.audit-grid {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.audit-section {
		width: 100%;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-dark);
	}

	.section-title .material-symbols-rounded {
		font-size: 1.5rem;
		color: var(--primary);
	}

	.demo-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.demo-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.demo-grid-2 {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.demo-label {
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}
</style>
