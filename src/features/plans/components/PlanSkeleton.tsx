import { Card, Skeleton } from '@/shared';

export function PlanSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-3 h-8 w-1/3" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-3" />
            ))}
          </div>
          <Skeleton className="mt-6 h-9" />
        </Card>
      ))}
    </div>
  );
}
