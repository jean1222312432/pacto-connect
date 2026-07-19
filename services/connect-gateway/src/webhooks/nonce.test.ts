import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../db.js', () => ({
  prisma: { webhookNonce: { create: vi.fn() } },
}));

import { prisma } from '../db.js';
import { consumeNonce } from './nonce.js';

describe('consumeNonce', () => {
  beforeEach(() => {
    vi.mocked(prisma.webhookNonce.create).mockReset();
  });

  it('returns true when the nonce is fresh', async () => {
    vi.mocked(prisma.webhookNonce.create).mockResolvedValue({} as never);
    const fresh = await consumeNonce({ nonce: 'n1', expiresAt: new Date() });
    expect(fresh).toBe(true);
  });

  it('returns false when the nonce already exists (P2002)', async () => {
    vi.mocked(prisma.webhookNonce.create).mockRejectedValue({ code: 'P2002' });
    const fresh = await consumeNonce({ nonce: 'n1', expiresAt: new Date() });
    expect(fresh).toBe(false);
  });

  it('rethrows unexpected errors', async () => {
    vi.mocked(prisma.webhookNonce.create).mockRejectedValue(new Error('db down'));
    await expect(consumeNonce({ nonce: 'n1', expiresAt: new Date() })).rejects.toThrow('db down');
  });
});
