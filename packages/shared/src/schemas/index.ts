import { z } from 'zod';
import {
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  CATEGORY_TYPES,
  PAYMENT_FREQUENCIES,
  THEME_PREFERENCES,
  DEFAULT_CURRENCY,
} from '../constants/index.js';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(64).trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(64).trim(),
  type: z.enum(ACCOUNT_TYPES).default('BANK'),
  currency: z.string().min(3).max(3).default(DEFAULT_CURRENCY),
  initialBalance: z.number().min(0, 'Initial balance cannot be negative').default(0),
});

export const createTransactionSchema = z
  .object({
    accountId: z.string().uuid('Valid account ID is required'),
    destinationAccountId: z.string().uuid('Valid destination account ID is required').optional().nullable(),
    categoryId: z.string().uuid('Valid category ID is required').optional().nullable(),
    type: z.enum(TRANSACTION_TYPES),
    amount: z.number().positive('Amount must be greater than 0'),
    date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')),
    description: z.string().min(1, 'Description is required').max(128).trim(),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === 'TRANSFER') {
        return !!data.destinationAccountId && data.destinationAccountId !== data.accountId;
      }
      return true;
    },
    {
      message: 'Transfer requires a distinct destination account',
      path: ['destinationAccountId'],
    }
  );

export const createBudgetSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  totalBudgetAmount: z.number().positive('Budget amount must be greater than 0'),
  categoryBudgets: z
    .array(
      z.object({
        categoryId: z.string().uuid(),
        amount: z.number().positive(),
      })
    )
    .optional(),
});

export const createSavingsGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(64).trim(),
  targetAmount: z.number().positive('Target amount must be greater than 0'),
  targetDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const updateUserPreferenceSchema = z.object({
  theme: z.enum(THEME_PREFERENCES).optional(),
  currency: z.string().min(3).max(3).optional(),
  locale: z.string().min(2).max(10).optional(),
  monthStartDay: z.number().int().min(1).max(28).optional(),
});
