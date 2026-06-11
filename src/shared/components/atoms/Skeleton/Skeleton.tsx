import { cn } from '@/shared/utils/cn';

export interface SkeletonProps {
  className?: string;
}

// DESIGN_SYSTEM.md §9.2 — solo formas, nunca texto; pulse suave sobre bg-muted
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} aria-hidden="true" />;
}
