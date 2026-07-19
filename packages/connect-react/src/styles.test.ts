import { STYLE_ELEMENT_ID } from '@pacto-connect/core';
import { afterEach, describe, expect, it } from 'vitest';
import { injectPactoCheckoutStyles } from './index.js';

describe('injectPactoCheckoutStyles', () => {
  afterEach(() => {
    document.getElementById(STYLE_ELEMENT_ID)?.remove();
  });

  it('injects the tokenized stylesheet once', () => {
    const first = injectPactoCheckoutStyles();
    const second = injectPactoCheckoutStyles();
    expect(first).toBeInstanceOf(HTMLStyleElement);
    expect(second).toBe(first);
    expect(first?.textContent).toContain('--pacto-color-primary');
  });
});
