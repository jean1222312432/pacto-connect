import { buildCheckoutStylesheet, STYLE_ELEMENT_ID } from '@pacto-connect/core';

/**
 * Inject the default (tokenized) checkout stylesheet into the document head
 * once. React hosts that already provide their own `pacto-checkout-*` CSS can
 * skip this by passing `injectStyles={false}` to `<PactoCheckout/>`.
 */
export function injectPactoCheckoutStyles(doc: Document = document): HTMLStyleElement | null {
  if (typeof doc === 'undefined' || !doc.head) {
    return null;
  }
  const existing = doc.getElementById(STYLE_ELEMENT_ID);
  if (existing instanceof HTMLStyleElement) {
    return existing;
  }
  const style = doc.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = buildCheckoutStylesheet();
  doc.head.append(style);
  return style;
}
