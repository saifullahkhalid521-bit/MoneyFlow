import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/70 dark:bg-slate-800/70',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
