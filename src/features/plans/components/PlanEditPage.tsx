import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardBody, CardHeader, Spinner, ErrorMessage, Button, Heading, Text } from '@/shared';
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
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate(`/plans/${planId}`)}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al plan
      </Button>
      <Card>
        <CardHeader>
          <Heading size="xl">Editar plan</Heading>
          <Text variant="secondary" className="mt-1">{plan.name}</Text>
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
