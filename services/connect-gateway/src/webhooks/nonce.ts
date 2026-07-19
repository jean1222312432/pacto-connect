import { prisma } from '../db.js';

export interface ConsumeNonceInput {
  nonce: string;
  expiresAt: Date;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

/**
 * Records the nonce. Returns true if it was fresh, false if it was already
 * seen (a replay). Relies on the unique constraint to win concurrent races.
 */
export async function consumeNonce(input: ConsumeNonceInput): Promise<boolean> {
  try {
    await prisma.webhookNonce.create({
      data: { nonce: input.nonce, expiresAt: input.expiresAt },
    });
    return true;
  } catch (error) {
    if (isUniqueViolation(error)) {
      return false;
    }
    throw error;
  }
}
