import { PlanCard } from './PlanCard';
import type { Plan } from '@/api/generated/model';

interface PlanListProps {
  plans: Plan[];
}

export function PlanList({ plans }: PlanListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id}
          {...plan}
          isPopular={plans.length > 1 ? index === 1 : index === 0}
        />
      ))}
    </div>
  );
}
