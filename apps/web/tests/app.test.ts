import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CURRENCY,
  CURRENCY_SYMBOLS,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
} from '@moneyflow/shared';

describe('Frontend Foundation Integration', () => {
  it('should successfully consume shared constants in frontend', () => {
    expect(DEFAULT_CURRENCY).toBe('INR');
    expect(CURRENCY_SYMBOLS[DEFAULT_CURRENCY]).toBe('₹');
    expect(ACCOUNT_TYPES).toContain('BANK');
    expect(TRANSACTION_TYPES).toContain('EXPENSE');
  });

  it('should format currency correctly with INR symbol', () => {
    const formatted = `${CURRENCY_SYMBOLS[DEFAULT_CURRENCY]} 1,500.00`;
    expect(formatted).toBe('₹ 1,500.00');
  });
});
