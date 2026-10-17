import { DEFAULT_CURRENCY, DEFAULT_LOCALE, CURRENCY_SYMBOLS } from '@moneyflow/shared';

export function formatCurrency(
  amount: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol} ${amount.toFixed(2)}`;
  }
}

export function formatDate(
  dateInput: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options || defaultOptions).format(date);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
