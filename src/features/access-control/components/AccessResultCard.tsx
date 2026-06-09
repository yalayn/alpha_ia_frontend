import { Card, CardBody, Badge } from '@/shared';
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
          <Badge variant={hasAccess ? 'success' : 'error'} size="md">
            {hasAccess ? 'Acceso permitido' : 'Acceso denegado'}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Cliente:</span> {customerId}</p>
          <p><span className="font-medium">Funcionalidad:</span> {featureId}</p>
        </div>
        {!hasAccess && reason && (
          <div className="rounded-md bg-red-50 p-3 space-y-2">
            <p className="text-sm text-red-700">{reasonToMessage(reason)}</p>
            {reason === 'feature_not_in_plan' && upgradePlans.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Disponible en:</span>{' '}
                {upgradePlans.map((p) => p.name).join(', ')}
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
