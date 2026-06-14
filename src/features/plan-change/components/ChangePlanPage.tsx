import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListPlans } from '@/api/generated/admin/admin';
import { useToast } from '@/core/toast';
import type { Plan } from '@/api/generated/model';
import {
  Card, Button, Input, ErrorMessage, Modal, PageHeader,
  Heading, Text, CheckList, EmptyState, Skeleton,
} from '@/shared';
import { usePlanChange } from '../hooks/use-plan-change';
import { ChangePlanSummary } from './ChangePlanSummary';

function parseChangePlanError(err: unknown): string {
  const code = (err as any)?.response?.data?.error ?? (err as any)?.response?.data?.code;
  if (code === 'payment_processing_failed') return 'El método de pago fue rechazado. Verifica los datos e intenta de nuevo.';
  if (code === 'subscription_not_active') return 'La suscripción no está activa y no puede ser modificada.';
  if (code === 'same_plan_change') return 'Ya estás suscrito a este plan.';
  if (code === 'plan_not_found') return 'El plan seleccionado ya no está disponible. Recarga la página.';
  return 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo.';
}

export function ChangePlanPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error: plansError } = useListPlans();
  const plans = data?.data ?? [];

  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const { changePlan, result, isPending, isSuccess, reset } = usePlanChange(subscriptionId ?? '');

  async function handleConfirm() {
    if (!selectedPlan || !subscriptionId) return;

    try {
      await changePlan({
        newPlanId: selectedPlan.id,
        paymentMethodId: paymentMethodId.trim(),
      });
    } catch (err) {
      // DESIGN_SYSTEM.md §9.4 — error de mutación: toast, no inline
      toast.error(parseChangePlanError(err));
    }
  }

  function handleClose() {
    if (isPending) return;
    setSelectedPlan(null);
    setPaymentMethodId('');
    reset();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      </div>
    );
  }

  if (plansError) return <ErrorMessage error={plansError} className="m-6" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader
        title="Cambiar plan"
        description="Selecciona el plan al que deseas migrar tu suscripción."
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
                Elegir este plan
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedPlan} onClose={handleClose} title="Confirmar cambio de plan">
        {selectedPlan && (
          <div className="space-y-4">
            {isSuccess && result ? (
              <>
                <ChangePlanSummary result={result} />
                <div className="flex justify-end pt-2">
                  <Button onClick={() => navigate(`/subscriptions/${subscriptionId}`)}>
                    Ver suscripción
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Card variant="flat" className="space-y-1 p-4">
                  <Text variant="secondary">
                    <Text as="span" variant="label">Nuevo plan:</Text> {selectedPlan.name}
                  </Text>
                  <Text variant="secondary">
                    <Text as="span" variant="label">Precio:</Text> {selectedPlan.currency} {selectedPlan.price}
                    /{selectedPlan.interval === 'month' ? 'mes' : 'año'}
                  </Text>
                  {selectedPlan.interval === 'month' && (
                    <Text variant="muted" tone="warning">
                      Si tu plan actual es anual, el cambio se programará para el final del período pagado.
                    </Text>
                  )}
                </Card>

                <Input
                  label="ID de método de pago (Stripe)"
                  placeholder="ej. pm_1NXk2v..."
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  helperText="Requerido. Solo se cobra si el cambio es inmediato."
                  disabled={isPending}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={handleClose} disabled={isPending}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    isLoading={isPending}
                    disabled={!paymentMethodId.trim() || isPending}
                  >
                    Confirmar cambio
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
