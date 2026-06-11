import { Card, CardBody, Badge, Text, ErrorMessage } from '@/shared';
import { useListPlans } from '@/api/generated/admin/admin';
import { reasonToMessage, getPlansWithFeature } from '../utils/access-control.utils';
import type { AccessResult } from '@/api/generated/model';

type AccessResultCardProps = Pick<AccessResult, 'hasAccess' | 'reason' | 'customerId' | 'featureId'>;

export function AccessResultCard({ hasAccess, reason, customerId, featureId }: AccessResultCardProps) {
  const { data: plansData } = useListPlans({
    query: { enabled: reason === 'feature_not_in_plan' },
  });
  const upgradePlans = getPlansWithFeature(plansData?.data ?? [], featureId ?? '');

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant={hasAccess ? 'success' : 'error'}>
            {hasAccess ? 'Acceso permitido' : 'Acceso denegado'}
          </Badge>
        </div>
        <div className="space-y-1">
          <Text variant="secondary"><Text as="span" variant="label">Cliente:</Text> {customerId}</Text>
          <Text variant="secondary"><Text as="span" variant="label">Funcionalidad:</Text> {featureId}</Text>
        </div>
        {!hasAccess && reason && (
          <div className="space-y-2">
            <ErrorMessage error={new Error(reasonToMessage(reason))} />
            {reason === 'feature_not_in_plan' && upgradePlans.length > 0 && (
              <Text variant="secondary">
                <Text as="span" variant="label">Disponible en:</Text>{' '}
                {upgradePlans.map((p) => p.name).join(', ')}
              </Text>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
