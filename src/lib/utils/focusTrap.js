/**
 * Acción Svelte para atrapar el foco dentro de un elemento interactivo (Modal / Dialog)
 * Cumple con WCAG 2.1 (2.1.2 No Keyboard Trap y 2.4.3 Focus Order)
 *
 * @param {HTMLElement} node
 */
export function focusTrap(node) {
	const previousActiveElement =
		document.activeElement instanceof HTMLElement ? document.activeElement : null;

	const focusableSelector =
		'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

	/**
	 * @returns {HTMLElement[]}
	 */
	function getFocusableElements() {
		return Array.from(node.querySelectorAll(focusableSelector)).filter(
			(el) => el instanceof HTMLElement && el.offsetParent !== null
		);
	}

	// Enfocar el primer elemento interactivo disponible
	const elements = getFocusableElements();
	if (elements.length > 0) {
		requestAnimationFrame(() => {
			elements[0]?.focus();
		});
	} else {
		node.setAttribute('tabindex', '-1');
		requestAnimationFrame(() => {
			node.focus();
		});
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function handleKeydown(event) {
		if (event.key !== 'Tab') return;

		const focusable = getFocusableElements();
		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}

		const firstElement = focusable[0];
		const lastElement = focusable[focusable.length - 1];

		if (event.shiftKey) {
			if (document.activeElement === firstElement || document.activeElement === node) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
				previousActiveElement.focus();
			}
		}
	};
}

