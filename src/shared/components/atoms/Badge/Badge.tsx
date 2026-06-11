import { cn } from '@/shared/utils/cn';

export interface BadgeProps {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
}

// DESIGN_SYSTEM.md §8.4 — solo texto, sin iconos inline
const variantStyles: Record<Required<BadgeProps>['variant'], string> = {
  default: 'bg-subtle text-foreground-secondary',
  brand: 'bg-brand-100 text-brand-600',
  success: 'bg-success-100 text-success-500',
  warning: 'bg-warning-100 text-warning-500',
  error: 'bg-error-100 text-error-500',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
