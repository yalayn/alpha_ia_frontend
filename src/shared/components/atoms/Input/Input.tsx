import { forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

// DESIGN_SYSTEM.md §8.3
const inputVariantStyles = {
  default: 'border-border focus:border-border-focus focus:ring-[3px] focus:ring-brand-50',
  error: 'border-error-500 focus:border-error-500 focus:ring-[3px] focus:ring-error-100',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, errorMessage, className, id, ...props },
  ref,
) {
  const variant = errorMessage ? 'error' : 'default';
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-md font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'block h-9 w-full rounded-md border bg-surface px-3 text-base text-foreground',
          'placeholder:text-foreground-muted',
          'focus:outline-none',
          'disabled:bg-subtle disabled:text-foreground-muted disabled:cursor-not-allowed',
          inputVariantStyles[variant],
          className,
        )}
        {...props}
      />
      {errorMessage && (
        <p className="text-sm text-error-500">{errorMessage}</p>
      )}
      {helperText && !errorMessage && (
        <p className="text-sm text-foreground-muted">{helperText}</p>
      )}
    </div>
  );
});
