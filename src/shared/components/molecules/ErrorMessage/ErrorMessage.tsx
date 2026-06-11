import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/atoms/Button';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

export interface ErrorMessageProps {
  error: ApiError | Error | unknown;
  /** DESIGN_SYSTEM.md §9.4 — error de carga de página: inline con botón "Reintentar" */
  onRetry?: () => void;
  className?: string;
}

function extractMessage(error: ApiError | Error | unknown): string {
  if (!error) return 'Ha ocurrido un error inesperado.';
  const apiError = error as ApiError;
  return (
    apiError.response?.data?.message ??
    (error as Error).message ??
    'Ha ocurrido un error inesperado.'
  );
}

export function ErrorMessage({ error, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-center justify-between gap-4 rounded-md bg-error-100 px-4 py-3 text-sm text-error-500',
        className,
      )}
    >
      <span>{extractMessage(error)}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
