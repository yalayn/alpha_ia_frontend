import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Spinner, ErrorMessage } from '@/shared';
import { usePlanDetail, usePlanEdit } from '../hooks/use-plans';
import { PlanForm } from './PlanForm';
import type { PlanFormValues } from '../types/plans.types';

export function PlanEditPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading, error } = usePlanDetail(planId ?? '');
  const { updatePlan, isPending, error: updateError } = usePlanEdit(planId ?? '');

  if (isLoading) return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  if (error) return <ErrorMessage error={error} className="m-6" />;
  if (!plan) return null;

  const defaultValues: PlanFormValues = {
    name: plan.name,
    price: plan.price,
    currency: plan.currency,
    interval: plan.interval as 'month' | 'year',
    features: plan.features,
  };

  async function handleSubmit(values: PlanFormValues) {
    await updatePlan(values);
    navigate(`/plans/${planId}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link
        to={`/plans/${planId}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        ← Volver al plan
      </Link>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">Editar plan</h1>
          <p className="text-sm text-gray-500 mt-1">{plan.name}</p>
        </CardHeader>
        <CardBody>
          {updateError && <ErrorMessage error={updateError} className="mb-4" />}
          <PlanForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            defaultValues={defaultValues}
            submitLabel="Guardar cambios"
          />
        </CardBody>
      </Card>
    </div>
  );
}
