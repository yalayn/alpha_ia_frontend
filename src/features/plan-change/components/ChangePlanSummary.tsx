import { Badge, Card, Text } from '@/shared';
import type { ChangePlanResult } from '@/api/generated/model';
import { formatChangeTypeLabel, formatEffectiveDateLabel, getChangeTypeBadgeVariant } from '../utils/plan-change.utils';

interface ChangePlanSummaryProps {
  result: ChangePlanResult;
}

export function ChangePlanSummary({ result }: ChangePlanSummaryProps) {
  const { changeType, effectiveDate, planId, scheduledPlanId } = result;
  const isScheduled = changeType === 'scheduled';

  return (
    <Card variant="flat" className="space-y-3 p-4">
      <div className="flex items-center gap-2">
        <Text as="span" variant="label">Tipo de cambio:</Text>
        <Badge variant={getChangeTypeBadgeVariant(changeType)}>
          {formatChangeTypeLabel(changeType)}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Text as="span" variant="label">Plan activo:</Text>
        <Text as="span" variant="secondary">{planId}</Text>
      </div>

      {isScheduled && scheduledPlanId && (
        <div className="flex items-center gap-2">
          <Text as="span" variant="label">Plan programado:</Text>
          <Text as="span" variant="secondary">{scheduledPlanId}</Text>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Text as="span" variant="label">Efectivo:</Text>
        <Text as="span" variant="secondary">{formatEffectiveDateLabel(changeType, effectiveDate)}</Text>
      </div>

      {isScheduled && (
        <Text variant="muted" tone="warning">
          El plan actual continúa activo hasta la fecha de efecto. Sin cobro inmediato.
        </Text>
      )}
    </Card>
  );
}
