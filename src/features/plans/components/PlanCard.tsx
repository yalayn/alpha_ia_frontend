import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Heading, Text, CheckList } from '@/shared';
import { formatPlanPrice } from '../utils/plans.utils';
import type { Plan } from '@/api/generated/model';

type PlanCardProps = Pick<Plan, 'id' | 'name' | 'price' | 'currency' | 'interval' | 'features'> & {
  isPopular?: boolean;
};

export function PlanCard({ id, name, price, currency, interval, features, isPopular }: PlanCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <Heading size="lg" as="h3">{name}</Heading>
        {isPopular && <Badge variant="brand">Más popular</Badge>}
      </div>
      <p className="mt-2 flex items-baseline gap-x-2">
        <Heading size="3xl" as="span">
          {formatPlanPrice(price, currency, interval).replace(`/${interval}`, '')}
        </Heading>
        <Text as="span" variant="secondary">
          /{interval === 'month' ? 'mes' : 'año'}
        </Text>
      </p>
      <CheckList items={features} className="mt-6 flex-1" />
      <Button
        variant={isPopular ? 'primary' : 'secondary'}
        className="mt-6 w-full"
        onClick={() => navigate(`/plans/${id}`)}
      >
        Seleccionar plan
      </Button>
    </Card>
  );
}
