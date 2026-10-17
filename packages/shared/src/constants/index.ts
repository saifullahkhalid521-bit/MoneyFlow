export const DEFAULT_CURRENCY = 'INR';
export const DEFAULT_LOCALE = 'en-IN';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const ACCOUNT_TYPES = [
  'CASH',
  'BANK',
  'SAVINGS',
  'CREDIT_CARD',
  'LOAN',
] as const;

export const TRANSACTION_TYPES = [
  'INCOME',
  'EXPENSE',
  'TRANSFER',
] as const;

export const CATEGORY_TYPES = [
  'INCOME',
  'EXPENSE',
] as const;

export const PAYMENT_FREQUENCIES = [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
] as const;

export const THEME_PREFERENCES = [
  'LIGHT',
  'DARK',
  'SYSTEM',
] as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Housing & Rent', icon: 'home', color: '#6366F1' },
  { name: 'Groceries', icon: 'shopping-cart', color: '#10B981' },
  { name: 'Dining Out', icon: 'utensils', color: '#F59E0B' },
  { name: 'Utilities & Bills', icon: 'zap', color: '#3B82F6' },
  { name: 'Transportation', icon: 'car', color: '#8B5CF6' },
  { name: 'Health & Medical', icon: 'heart-pulse', color: '#EC4899' },
  { name: 'Entertainment & Leisure', icon: 'film', color: '#F43F5E' },
  { name: 'Shopping & Electronics', icon: 'shopping-bag', color: '#14B8A6' },
  { name: 'Education & Learning', icon: 'book-open', color: '#06B6D4' },
  { name: 'Personal Care', icon: 'sparkles', color: '#A855F7' },
  { name: 'Subscriptions', icon: 'credit-card', color: '#EAB308' },
  { name: 'Miscellaneous', icon: 'more-horizontal', color: '#64748B' },
] as const;

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'briefcase', color: '#10B981' },
  { name: 'Freelance & Consulting', icon: 'laptop', color: '#3B82F6' },
  { name: 'Investments & Dividends', icon: 'trending-up', color: '#8B5CF6' },
  { name: 'Rental Income', icon: 'building', color: '#06B6D4' },
  { name: 'Gifts & Grants', icon: 'gift', color: '#EC4899' },
  { name: 'Other Income', icon: 'plus-circle', color: '#64748B' },
] as const;
