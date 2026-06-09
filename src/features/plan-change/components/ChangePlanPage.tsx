import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListPlans } from '@/api/generated/admin/admin';
import type { Plan } from '@/api/generated/model';
import { Card, Button, Input, ErrorMessage, Modal } from '@/shared';
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

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { changePlan, result, isPending, isSuccess, reset } = usePlanChange(subscriptionId ?? '');

  async function handleConfirm() {
    if (!selectedPlan || !subscriptionId) return;
    setPaymentError(null);

    try {
      await changePlan({
        newPlanId: selectedPlan.id,
        paymentMethodId: paymentMethodId.trim(),
      });
    } catch (err) {
      setPaymentError(parseChangePlanError(err));
    }
  }

  function handleClose() {
    if (isPending) return;
    setSelectedPlan(null);
    setPaymentMethodId('');
    setPaymentError(null);
    reset();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (plansError) return <ErrorMessage error={plansError} className="m-6" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cambiar plan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona el plan al que deseas migrar tu suscripción.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No hay planes disponibles en este momento.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col p-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.currency} {plan.price}
                </span>
                <span className="text-sm text-gray-500">
                  /{plan.interval === 'month' ? 'mes' : 'año'}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-none text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
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
                <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium">Nuevo plan:</span> {selectedPlan.name}
                  </p>
                  <p>
                    <span className="font-medium">Precio:</span> {selectedPlan.currency} {selectedPlan.price}
                    /{selectedPlan.interval === 'month' ? 'mes' : 'año'}
                  </p>
                  {selectedPlan.interval === 'month' && (
                    <p className="text-xs text-amber-600">
                      Si tu plan actual es anual, el cambio se programará para el final del período pagado.
                    </p>
                  )}
                </div>

                <Input
                  label="ID de método de pago (Stripe)"
                  placeholder="pm_..."
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  helperText="Requerido. Solo se cobra si el cambio es inmediato."
                  errorMessage={paymentError ?? undefined}
                  disabled={isPending}
                />

                <div className="flex gap-3 justify-end pt-2">
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
