import { Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface CheckListProps {
  items: string[];
  className?: string;
}

export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={cn('space-y-2 text-sm text-foreground-secondary', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <Check className="h-4 w-4 flex-none text-success-500" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
