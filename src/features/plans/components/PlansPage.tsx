import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ErrorMessage, PageHeader, Button } from '@/shared';
import { useAuth } from '@/core/auth/use-auth';
import { usePlans } from '../hooks/use-plans';
import { PlanSkeleton } from './PlanSkeleton';
import { PlanEmpty } from './PlanEmpty';
import { PlanList } from './PlanList';

export function PlansPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { plans, isLoading, error } = usePlans();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader
        title="Planes de Suscripción"
        description="Encuentra el plan perfecto para potenciar tus capacidades y las de tu equipo."
        action={
          isAdmin ? (
            <Button onClick={() => navigate('/plans/new')}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Crear plan
            </Button>
          ) : undefined
        }
      />

      {isLoading && <PlanSkeleton />}
      {!isLoading && error && <ErrorMessage error={error} className="mx-auto max-w-2xl" />}
      {!isLoading && !error && plans.length === 0 && <PlanEmpty />}
      {!isLoading && !error && plans.length > 0 && <PlanList plans={plans} />}
    </div>
  );
}
