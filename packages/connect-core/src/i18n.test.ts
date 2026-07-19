import { describe, expect, it } from 'vitest';
import { en, es, formatMessage, resolveMessages } from './i18n.js';

describe('resolveMessages', () => {
  it('returns the English dictionary by default', () => {
    expect(resolveMessages()).toBe(en);
    expect(resolveMessages('en')).toBe(en);
  });

  it('returns the Spanish dictionary for "es"', () => {
    const msgs = resolveMessages('es');
    expect(msgs.actions.confirmDeposit).toBe(es.actions.confirmDeposit);
    expect(msgs.steps.deposit).toBe('Depositar en garantía');
  });

  it('falls back to English for an unknown locale', () => {
    expect(resolveMessages('fr')).toEqual(en);
  });

  it('deep-merges overrides over the base locale', () => {
    const msgs = resolveMessages('es', { actions: { confirmDeposit: 'Pagar ahora' } });
    expect(msgs.actions.confirmDeposit).toBe('Pagar ahora');
    // untouched keys keep the base value
    expect(msgs.actions.submitReceipt).toBe(es.actions.submitReceipt);
    expect(msgs.steps.deposit).toBe('Depositar en garantía');
  });

  it('does not mutate the base dictionaries', () => {
    resolveMessages('en', { actions: { retry: 'Again' } });
    expect(en.actions.retry).toBe('Retry');
  });

  it('keeps the current English strings verbatim (back-compat)', () => {
    expect(en.actions.confirmDeposit).toBe('Confirm deposit');
    expect(en.actions.submitReceipt).toBe('Submit receipt');
    expect(en.actions.closeAria).toBe('Close checkout');
    expect(en.labels.testBanner).toBe('TEST MODE — no real funds or Stellar transactions');
    expect(en.steps.deposit).toBe('Deposit to escrow');
    expect(en.milestones['fiat.reported']).toBe('Fiat payment reported');
  });
});

describe('formatMessage', () => {
  it('substitutes named placeholders', () => {
    expect(formatMessage(en.labels.depositInstruction, { amount: '100', asset: 'USDC' })).toBe(
      'Deposit 100 USDC to the escrow contract.',
    );
  });

  it('leaves unknown placeholders untouched', () => {
    expect(formatMessage('Hi {name}', {})).toBe('Hi {name}');
  });
});
