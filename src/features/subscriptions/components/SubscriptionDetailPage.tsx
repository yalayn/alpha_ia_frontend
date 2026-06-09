import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardFooter, Button, ErrorMessage } from '@/shared';
import { useSubscriptionDetail, useSubscriptionActions } from '../hooks/use-subscription';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';
import { SubscriptionSkeleton } from './SubscriptionSkeleton';
import { formatDate } from '../utils/subscriptions.utils';

export function SubscriptionDetailPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const { subscription, isLoading, error } = useSubscriptionDetail(subscriptionId ?? '');
  const { cancel, isPending } = useSubscriptionActions();

  if (isLoading) return <div className="mx-auto max-w-2xl px-4 py-8"><SubscriptionSkeleton /></div>;
  if (error) return <ErrorMessage error={error} className="m-6" />;
  if (!subscription) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Suscripción</h1>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardBody className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium">ID:</span> {subscription.id}</p>
          <p><span className="font-medium">Plan:</span> {subscription.planId}</p>
          <p><span className="font-medium">Inicio:</span> {formatDate(subscription.startDate)}</p>
          {subscription.endDate && (
            <p><span className="font-medium">Fin:</span> {formatDate(subscription.endDate)}</p>
          )}
        </CardBody>
        {subscription.status === 'active' && (
          <CardFooter className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/subscriptions/${subscription.id}/change-plan`)}
            >
              Cambiar plan
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isPending}
              onClick={() => cancel(subscription.id)}
            >
              Cancelar suscripción
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
