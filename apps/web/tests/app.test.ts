import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CURRENCY,
  CURRENCY_SYMBOLS,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
} from '@moneyflow/shared';
import { formatCurrency, formatPercentage } from '../src/lib/formatters';
import { cn } from '../src/lib/utils';

describe('Frontend Foundation & UI Shell Integration', () => {
  it('should successfully consume shared constants in frontend', () => {
    expect(DEFAULT_CURRENCY).toBe('INR');
    expect(CURRENCY_SYMBOLS[DEFAULT_CURRENCY]).toBe('₹');
    expect(ACCOUNT_TYPES).toContain('BANK');
    expect(TRANSACTION_TYPES).toContain('EXPENSE');
  });

  it('formatCurrency should output properly formatted currency string', () => {
    const formatted = formatCurrency(125000);
    expect(formatted).toContain('1,25,000');
  });

  it('formatPercentage should format percentages with requested decimals', () => {
    expect(formatPercentage(64.2857, 1)).toBe('64.3%');
    expect(formatPercentage(100, 0)).toBe('100%');
  });

  it('cn utility should merge and handle conditional class names', () => {
    expect(cn('px-4', true && 'py-2', false && 'hidden')).toBe('px-4 py-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
