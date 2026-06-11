import { cn } from '@/shared/utils/cn';

export interface TextLinkProps {
  /** Elemento a renderizar — por defecto `a`; pasar `Link` de react-router desde la feature */
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export function TextLink({ as: Tag = 'a', className, children, ...props }: TextLinkProps) {
  return (
    <Tag className={cn('text-brand-500 hover:underline', className)} {...props}>
      {children}
    </Tag>
  );
}
