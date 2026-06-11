import { Card, CardBody, Skeleton } from '@/shared';

export function SubscriptionSkeleton() {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
        <Skeleton className="h-9 w-32" />
      </CardBody>
    </Card>
  );
}
