import { describe, expect, it } from 'vitest';
import {
  buildCheckoutStylesheet,
  DEFAULT_THEME,
  STYLE_ELEMENT_ID,
  themeToCssVars,
} from './theme.js';

describe('themeToCssVars', () => {
  it('returns an empty map when no theme is provided', () => {
    expect(themeToCssVars()).toEqual({});
    expect(themeToCssVars({})).toEqual({});
  });

  it('emits only the tokens that are provided (sparse)', () => {
    const vars = themeToCssVars({ colors: { primary: '#e11d48' } });
    expect(vars).toEqual({ '--pacto-color-primary': '#e11d48' });
  });

  it('maps nested tokens to their CSS variable names', () => {
    const vars = themeToCssVars({
      colors: { primary: '#111', surface: '#fff' },
      typography: { fontFamily: 'Inter' },
      radius: '4px',
      spacing: '2rem',
    });
    expect(vars).toEqual({
      '--pacto-color-primary': '#111',
      '--pacto-color-surface': '#fff',
      '--pacto-font-family': 'Inter',
      '--pacto-radius': '4px',
      '--pacto-space': '2rem',
    });
  });

  it('ignores undefined token values', () => {
    const vars = themeToCssVars({ colors: { primary: undefined, text: '#000' } });
    expect(vars).toEqual({ '--pacto-color-text': '#000' });
  });
});

describe('buildCheckoutStylesheet', () => {
  it('references the pacto CSS variables with DEFAULT_THEME fallbacks', () => {
    const css = buildCheckoutStylesheet();
    expect(css).toContain('.pacto-checkout-overlay');
    expect(css).toContain(`var(--pacto-color-primary, ${DEFAULT_THEME.colors.primary})`);
    expect(css).toContain(`var(--pacto-color-surface, ${DEFAULT_THEME.colors.surface})`);
    expect(css).toContain('var(--pacto-radius,');
    expect(css).toContain('.pacto-checkout-logo');
  });

  it('does not contain a raw duplicate of the primary color outside the fallback', () => {
    const css = buildCheckoutStylesheet();
    const occurrences = css.split(DEFAULT_THEME.colors.primary).length - 1;
    expect(occurrences).toBe(1); // only inside the var() fallback
  });
});

describe('STYLE_ELEMENT_ID', () => {
  it('is the shared style element id', () => {
    expect(STYLE_ELEMENT_ID).toBe('pacto-checkout-styles');
  });
});
