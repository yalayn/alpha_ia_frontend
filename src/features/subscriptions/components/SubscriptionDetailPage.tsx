import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardFooter, Button, ErrorMessage, Heading, Text } from '@/shared';
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
            <Heading size="xl">Suscripción</Heading>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          <Text variant="secondary"><Text as="span" variant="label">ID:</Text> {subscription.id}</Text>
          <Text variant="secondary"><Text as="span" variant="label">Plan:</Text> {subscription.planId}</Text>
          <Text variant="secondary"><Text as="span" variant="label">Inicio:</Text> {formatDate(subscription.startDate)}</Text>
          {subscription.endDate && (
            <Text variant="secondary"><Text as="span" variant="label">Fin:</Text> {formatDate(subscription.endDate)}</Text>
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
