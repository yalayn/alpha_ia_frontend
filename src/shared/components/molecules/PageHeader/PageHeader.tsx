import { cn } from '@/shared/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Acción primaria de la página — solo un botón `primary` por vista (DESIGN_SYSTEM.md §8.2) */
  action?: React.ReactNode;
  className?: string;
}

// DESIGN_SYSTEM.md §7.4
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-start justify-between gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-foreground-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
