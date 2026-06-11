import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardBody, CardHeader, Button, Heading } from '@/shared';
import { usePlanCreate } from '../hooks/use-plans';
import { PlanForm } from './PlanForm';
import type { PlanFormValues } from '../types/plans.types';

export function PlanCreatePage() {
  const navigate = useNavigate();
  const { createPlan, isPending } = usePlanCreate();

  async function handleSubmit(values: PlanFormValues) {
    await createPlan(values);
    navigate('/plans');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/plans')}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Planes
      </Button>
      <Card>
        <CardHeader>
          <Heading size="xl">Nuevo plan</Heading>
        </CardHeader>
        <CardBody>
          <PlanForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </CardBody>
      </Card>
    </div>
  );
}
