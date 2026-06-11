import { useNavigate } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { EmptyState, Button } from '@/shared';

export function PlanEmpty() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={PackageOpen}
      title="Aún no tienes planes"
      description="Crea el primer plan de suscripción."
      action={
        <Button onClick={() => navigate('/plans/new')}>Crear plan</Button>
      }
    />
  );
}
