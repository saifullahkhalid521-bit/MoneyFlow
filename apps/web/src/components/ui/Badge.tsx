import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'brand' | 'income' | 'expense' | 'warning' | 'info';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  hasDot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    neutral: 'bg-card text-text-secondary border-border-subtle',
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
    income: 'bg-income-500/10 text-income-600 dark:text-income-400 border-income-500/20',
    expense: 'bg-expense-500/10 text-expense-600 dark:text-expense-400 border-expense-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  const dotColors = {
    neutral: 'bg-text-muted',
    brand: 'bg-brand-500',
    income: 'bg-income-500',
    expense: 'bg-expense-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {hasDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
