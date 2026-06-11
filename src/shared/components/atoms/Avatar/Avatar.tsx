import { cn } from '@/shared/utils/cn';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<Required<AvatarProps>['size'], string> = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// radius-full permitido solo en avatares y toggles (DESIGN_SYSTEM.md §5)
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-100 font-medium text-brand-600',
        sizeStyles[size],
        className,
      )}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
