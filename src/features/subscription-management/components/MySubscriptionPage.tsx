import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardFooter, Button, Badge, ErrorMessage } from '@/shared';
import { useCancelSubscription, getGetCustomerSubscriptionQueryKey } from '@/api/generated/subscriptions/subscriptions';
import { useAuth } from '@/core/auth/use-auth';
import { useMySubscription } from '../hooks/use-my-subscription';
import type { SubscriptionStatus } from '@/api/generated/model';

function statusBadgeVariant(status: SubscriptionStatus): 'success' | 'warning' | 'error' | 'neutral' {
  const map: Record<SubscriptionStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
    active: 'success',
    inactive: 'warning',
    canceled: 'error',
    expired: 'neutral',
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
    <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-100" />
        ))}
      </div>
      <div className="h-9 w-32 rounded bg-gray-200" />
    </div>
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
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <Card>
          <CardBody className="py-12 flex flex-col items-center gap-4">
            <div className="text-5xl">📦</div>
            <h2 className="text-xl font-semibold text-gray-900">Sin suscripción activa</h2>
            <p className="text-sm text-gray-500">
              Aún no tienes un plan. Elige uno para comenzar.
            </p>
            <Button onClick={() => navigate('/subscription/new')}>
              Elige tu plan
            </Button>
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
            <h1 className="text-xl font-bold text-gray-900">Mi Suscripción</h1>
            <Badge variant={statusBadgeVariant(subscription.status)}>
              {statusLabel(subscription.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardBody className="space-y-3 text-sm text-gray-700">
          {plan && (
            <p>
              <span className="font-medium">Plan:</span>{' '}
              {plan.name} — {plan.price} {plan.currency}/{plan.interval}
            </p>
          )}
          <p><span className="font-medium">Inicio:</span> {formatDate(subscription.startDate)}</p>
          {subscription.endDate && (
            <p>
              <span className="font-medium">
                {isCanceled ? 'Acceso hasta:' : 'Renovación:'}
              </span>{' '}
              {formatDate(subscription.endDate)}
            </p>
          )}

          {plan && plan.features.length > 0 && (
            <div className="pt-2">
              <p className="font-medium mb-1">Funcionalidades incluidas:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {isExpired && (
            <p className="text-amber-600 font-medium">Tu plan ha expirado.</p>
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
