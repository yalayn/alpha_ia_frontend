import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import {
  Card, CardBody, CardHeader, CardFooter, Button, Badge, ErrorMessage,
  Heading, Text, Skeleton, EmptyState, CheckList,
} from '@/shared';
import { useCancelSubscription, getGetCustomerSubscriptionQueryKey } from '@/api/generated/subscriptions/subscriptions';
import { useAuth } from '@/core/auth/use-auth';
import { useMySubscription } from '../hooks/use-my-subscription';
import type { SubscriptionStatus } from '@/api/generated/model';

function statusBadgeVariant(status: SubscriptionStatus): 'success' | 'warning' | 'error' | 'default' {
  const map: Record<SubscriptionStatus, 'success' | 'warning' | 'error' | 'default'> = {
    active: 'success',
    inactive: 'warning',
    canceled: 'error',
    expired: 'default',
  };
  return map[status];
}

function statusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Activa',
    inactive: 'Inactiva',
    canceled: 'Cancelada',
    expired: 'Vencida',
  };
  return labels[status];
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(dateString));
}

function SubscriptionCardSkeleton() {
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

export function MySubscriptionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const customerId = user?.id ?? '';

  const { subscription, plan, isLoading, hasNoSubscription, error } = useMySubscription(customerId);

  const cancelMutation = useCancelSubscription({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCustomerSubscriptionQueryKey(customerId),
        });
      },
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <SubscriptionCardSkeleton />
      </div>
    );
  }

  if (hasNoSubscription || !subscription) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardBody>
            <EmptyState
              icon={Package}
              title="Aún no tienes un plan"
              description="Elige uno para comenzar."
              action={
                <Button onClick={() => navigate('/subscription/new')}>
                  Elige tu plan
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} className="m-6" />;
  }

  const isExpired = subscription.status === 'expired';
  const isCanceled = subscription.status === 'canceled';
  const isActive = subscription.status === 'active';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Heading size="xl">Mi Suscripción</Heading>
            <Badge variant={statusBadgeVariant(subscription.status)}>
              {statusLabel(subscription.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardBody className="space-y-3">
          {plan && (
            <Text variant="secondary">
              <Text as="span" variant="label">Plan:</Text>{' '}
              {plan.name} — {plan.price} {plan.currency}/{plan.interval}
            </Text>
          )}
          <Text variant="secondary">
            <Text as="span" variant="label">Inicio:</Text> {formatDate(subscription.startDate)}
          </Text>
          {subscription.endDate && (
            <Text variant="secondary">
              <Text as="span" variant="label">
                {isCanceled ? 'Acceso hasta:' : 'Renovación:'}
              </Text>{' '}
              {formatDate(subscription.endDate)}
            </Text>
          )}

          {plan && plan.features.length > 0 && (
            <div className="pt-2">
              <Text variant="label" className="mb-1">Funcionalidades incluidas:</Text>
              <CheckList items={plan.features} />
            </div>
          )}

          {isExpired && (
            <Text variant="label" tone="warning">Tu plan ha expirado.</Text>
          )}
        </CardBody>

        <CardFooter className="flex flex-wrap gap-3">
          {isActive && (
            <>
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
                isLoading={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate({ subscriptionId: subscription.id })}
              >
                Cancelar
              </Button>
            </>
          )}
          {(isExpired || isCanceled) && (
            <Button onClick={() => navigate('/subscription/new')}>
              Elige tu plan
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
