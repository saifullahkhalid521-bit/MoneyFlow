import {
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  CATEGORY_TYPES,
  PAYMENT_FREQUENCIES,
  THEME_PREFERENCES,
} from '../constants/index.js';

export type AccountType = (typeof ACCOUNT_TYPES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type CategoryType = (typeof CATEGORY_TYPES)[number];
export type PaymentFrequency = (typeof PAYMENT_FREQUENCIES)[number];
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface HealthStatusDto {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AccountDto {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDto {
  id: string;
  userId: string | null;
  name: string;
  type: CategoryType;
  icon?: string | null;
  color?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDto {
  id: string;
  userId: string;
  accountId: string;
  accountName?: string;
  destinationAccountId?: string | null;
  destinationAccountName?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  notes?: string | null;
  isRecurringInstance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetDto {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalBudgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
}

export interface SavingsGoalDto {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  currentSavedAmount: number;
  progressPercentage: number;
  requiredMonthlySavings: number;
  isCompleted: boolean;
}
