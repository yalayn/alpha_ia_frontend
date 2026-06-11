import { cn } from '@/shared/utils/cn';

export interface TextProps {
  /** body: texto base · secondary: apoyo/descripciones · muted: metadatos/placeholders · label: etiquetas */
  variant?: 'body' | 'secondary' | 'muted' | 'label';
  /** Color semántico de feedback — sobreescribe el color del variant */
  tone?: 'success' | 'warning' | 'error' | 'info';
  as?: 'p' | 'span' | 'div';
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Required<TextProps>['variant'], string> = {
  body: 'text-base text-foreground',
  secondary: 'text-sm text-foreground-secondary',
  muted: 'text-sm text-foreground-muted',
  label: 'text-md font-medium text-foreground',
};

const toneStyles: Record<Required<TextProps>['tone'], string> = {
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-error-500',
  info: 'text-info-500',
};

export function Text({ variant = 'body', tone, as: Tag = 'p', className, children }: TextProps) {
  return (
    <Tag className={cn(variantStyles[variant], tone && toneStyles[tone], className)}>
      {children}
    </Tag>
  );
}
