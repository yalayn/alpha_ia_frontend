import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

// DESIGN_SYSTEM.md §8.2 — un solo `primary` por vista
const variantStyles: Record<Required<ButtonProps>['variant'], string> = {
  primary: 'bg-brand-500 text-foreground-inverse hover:bg-brand-600 focus-visible:ring-brand-500',
  secondary: 'bg-surface text-foreground border border-border hover:bg-subtle focus-visible:ring-border-focus',
  danger: 'bg-error-500 text-foreground-inverse hover:opacity-90 focus-visible:ring-error-500',
  ghost: 'text-foreground-secondary hover:bg-muted focus-visible:ring-border-focus',
};

const sizeStyles: Record<Required<ButtonProps>['size'], string> = {
  sm: 'h-7 px-3 text-sm',
  md: 'h-9 px-4 text-md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
