import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListPlans } from '@/api/generated/admin/admin';
import { useSubscribeCustomer } from '@/api/generated/subscriptions/subscriptions';
import type { Plan } from '@/api/generated/model';
import { useAuthContext } from '@/core/auth/auth.context';
import { useToast } from '@/core/toast';
import {
  Card, Button, Input, ErrorMessage, Modal, PageHeader,
  Heading, Text, CheckList, EmptyState,
} from '@/shared';
import { SubscriptionSkeleton } from './SubscriptionSkeleton';
import { formatDate } from '../utils/subscriptions.utils';

function nextBillingDate(interval: Plan['interval']): string {
  const d = new Date();
  if (interval === 'year') {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString();
}

function parsePaymentError(err: unknown): string {
  const code = (err as any)?.response?.data?.error ?? (err as any)?.response?.data?.code;
  if (code === 'payment_processing_failed') return 'El método de pago fue rechazado. Verifica los datos e intenta de nuevo.';
  if (code === 'subscription_already_active') return 'Ya tienes una suscripción activa.';
  if (code === 'plan_not_found') return 'El plan seleccionado ya no está disponible. Recarga la página.';
  return 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo.';
}

export function SubscribePlanPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data, isLoading, error } = useListPlans();
  const plans = data?.data ?? [];

  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const mutation = useSubscribeCustomer();

  async function handleConfirm() {
    if (!selectedPlan || !user) return;

    try {
      const sub = await mutation.mutateAsync({
        data: {
          customerId: user.id!,
          planId: selectedPlan.id,
          paymentMethodId: paymentMethodId.trim(),
        },
      });
      toast.success(`Te has suscrito al plan ${selectedPlan.name}.`);
      navigate(`/subscriptions/${sub.id}`);
    } catch (err) {
      // DESIGN_SYSTEM.md §9.4 — error de mutación: toast, no inline
      toast.error(parsePaymentError(err));
    }
  }

  function handleClose() {
    if (mutation.isPending) return;
    setSelectedPlan(null);
    setPaymentMethodId('');
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <SubscriptionSkeleton />
      </div>
    );
  }

  if (error) return <ErrorMessage error={error} className="m-6" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader
        title="Elige tu plan"
        description="Selecciona el plan que mejor se adapte a las necesidades de tu empresa."
      />

      {plans.length === 0 ? (
        <EmptyState
          title="Aún no hay planes disponibles"
          description="Vuelve a intentarlo más tarde."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col p-6">
              <Heading size="lg" as="h3">{plan.name}</Heading>
              <p className="mt-2">
                <Heading size="3xl" as="span">
                  {plan.currency} {plan.price}
                </Heading>
                <Text as="span" variant="secondary">
                  /{plan.interval === 'month' ? 'mes' : 'año'}
                </Text>
              </p>
              <CheckList items={plan.features} className="mt-4 flex-1" />
              <Button className="mt-6 w-full" onClick={() => setSelectedPlan(plan)}>
                Suscribirse
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedPlan} onClose={handleClose} title="Confirmar suscripción">
        {selectedPlan && (
          <div className="space-y-4">
            <Card variant="flat" className="space-y-1 p-4">
              <Text variant="secondary">
                <Text as="span" variant="label">Plan:</Text> {selectedPlan.name}
              </Text>
              <Text variant="secondary">
                <Text as="span" variant="label">Precio:</Text> {selectedPlan.currency} {selectedPlan.price}
                /{selectedPlan.interval === 'month' ? 'mes' : 'año'}
              </Text>
              <Text variant="secondary">
                <Text as="span" variant="label">Próximo cobro:</Text>{' '}
                {formatDate(nextBillingDate(selectedPlan.interval))}
              </Text>
            </Card>

            <Input
              label="ID de método de pago (Stripe)"
              placeholder="ej. pm_1NXk2v..."
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              helperText="Ingresa el ID de tu método de pago de Stripe (pm_...)."
              disabled={mutation.isPending}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleClose} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                isLoading={mutation.isPending}
                disabled={!paymentMethodId.trim()}
              >
                Confirmar y pagar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
