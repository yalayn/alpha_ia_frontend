import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListPlans } from '@/api/generated/admin/admin';
import { useSubscribeCustomer } from '@/api/generated/subscriptions/subscriptions';
import type { Plan } from '@/api/generated/model';
import { useAuthContext } from '@/core/auth/auth.context';
import { Card, Button, Input, ErrorMessage, Modal } from '@/shared';
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

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const mutation = useSubscribeCustomer();

  async function handleConfirm() {
    if (!selectedPlan || !user) return;
    setPaymentError(null);

    try {
      const sub = await mutation.mutateAsync({
        data: {
          customerId: user.id!,
          planId: selectedPlan.id,
          paymentMethodId: paymentMethodId.trim(),
        },
      });
      navigate(`/subscriptions/${sub.id}`);
    } catch (err) {
      setPaymentError(parsePaymentError(err));
    }
  }

  function handleClose() {
    if (mutation.isPending) return;
    setSelectedPlan(null);
    setPaymentMethodId('');
    setPaymentError(null);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Elige tu plan</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Selecciona el plan que mejor se adapte a las necesidades de tu empresa.
      </p>

      {plans.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No hay planes disponibles en este momento.</p>
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
                Suscribirse
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedPlan} onClose={handleClose} title="Confirmar suscripción">
        {selectedPlan && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 text-sm space-y-1 text-gray-700">
              <p>
                <span className="font-medium">Plan:</span> {selectedPlan.name}
              </p>
              <p>
                <span className="font-medium">Precio:</span> {selectedPlan.currency} {selectedPlan.price}
                /{selectedPlan.interval === 'month' ? 'mes' : 'año'}
              </p>
              <p>
                <span className="font-medium">Próximo cobro:</span>{' '}
                {formatDate(nextBillingDate(selectedPlan.interval))}
              </p>
            </div>

            <Input
              label="ID de método de pago (Stripe)"
              placeholder="pm_..."
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              helperText="Ingresa el ID de tu método de pago de Stripe (pm_...)."
              errorMessage={paymentError ?? undefined}
              disabled={mutation.isPending}
            />

            <div className="flex gap-3 justify-end pt-2">
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
