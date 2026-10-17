import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerSchema,
  createTransactionSchema,
  DEFAULT_CURRENCY,
  CURRENCY_SYMBOLS,
} from '../dist/index.js';

describe('Shared Package Schemas & Constants', () => {
  it('DEFAULT_CURRENCY should be INR with ₹ symbol', () => {
    assert.equal(DEFAULT_CURRENCY, 'INR');
    assert.equal(CURRENCY_SYMBOLS['INR'], '₹');
  });

  it('registerSchema should validate valid registration payload', () => {
    const valid = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'StrongPassword123',
      name: 'Test User',
    });
    assert.equal(valid.success, true);
  });

  it('registerSchema should reject short password', () => {
    const invalid = registerSchema.safeParse({
      email: 'user@example.com',
      password: '123',
      name: 'Test User',
    });
    assert.equal(invalid.success, false);
  });

  it('createTransactionSchema should require distinct destination account for TRANSFER', () => {
    const accountId = '550e8400-e29b-41d4-a716-446655440000';
    const sameAccountTransfer = createTransactionSchema.safeParse({
      accountId,
      destinationAccountId: accountId,
      type: 'TRANSFER',
      amount: 100,
      date: '2026-10-17',
      description: 'Transfer to same account',
    });
    assert.equal(sameAccountTransfer.success, false);
  });
});
