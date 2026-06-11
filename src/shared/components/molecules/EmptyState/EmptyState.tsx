import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface EmptyStateProps {
  icon?: LucideIcon;
  /** Título contextual: "Aún no tienes X", no "Sin resultados" (DESIGN_SYSTEM.md §12) */
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// DESIGN_SYSTEM.md §9.1
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 py-16 text-center', className)}>
      {Icon && <Icon className="h-12 w-12 text-foreground-muted" aria-hidden="true" />}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-foreground-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
