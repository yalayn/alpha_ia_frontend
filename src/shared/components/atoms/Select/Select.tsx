import { forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  errorMessage?: string;
}

// Mismos patrones visuales que Input (DESIGN_SYSTEM.md §8.3)
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, helperText, errorMessage, className, id, ...props },
  ref,
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-md font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'block h-9 w-full rounded-md border bg-surface px-3 text-base text-foreground',
          'focus:outline-none focus:ring-[3px]',
          'disabled:bg-subtle disabled:text-foreground-muted disabled:cursor-not-allowed',
          errorMessage
            ? 'border-error-500 focus:border-error-500 focus:ring-error-100'
            : 'border-border focus:border-border-focus focus:ring-brand-50',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errorMessage && <p className="text-sm text-error-500">{errorMessage}</p>}
      {helperText && !errorMessage && (
        <p className="text-sm text-foreground-muted">{helperText}</p>
      )}
    </div>
  );
});
