import { cn } from '@/shared/utils/cn';

export interface HeadingProps {
  /** DESIGN_SYSTEM.md §3.1 — lg: subtítulo de sección · xl: título de página · 2xl: título de modal · 3xl: métrica destacada */
  size?: 'lg' | 'xl' | '2xl' | '3xl';
  /** `span`/`p` para métricas destacadas que no son encabezados semánticos (ej. precios) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  children: React.ReactNode;
}

const sizeStyles: Record<Required<HeadingProps>['size'], string> = {
  lg: 'text-lg font-semibold',
  xl: 'text-xl font-semibold',
  '2xl': 'text-2xl font-bold',
  '3xl': 'text-3xl font-bold',
};

export function Heading({ size = 'xl', as: Tag = 'h1', className, children }: HeadingProps) {
  return (
    <Tag className={cn(sizeStyles[size], 'text-foreground', className)}>
      {children}
    </Tag>
  );
}
