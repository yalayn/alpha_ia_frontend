import { Badge } from '@/shared';
import type { ChangePlanResult } from '@/api/generated/model';
import { formatChangeTypeLabel, formatEffectiveDateLabel, getChangeTypeBadgeVariant } from '../utils/plan-change.utils';

interface ChangePlanSummaryProps {
  result: ChangePlanResult;
}

export function ChangePlanSummary({ result }: ChangePlanSummaryProps) {
  const { changeType, effectiveDate, planId, scheduledPlanId } = result;
  const isScheduled = changeType === 'scheduled';

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Tipo de cambio:</span>
        <Badge variant={getChangeTypeBadgeVariant(changeType)}>
          {formatChangeTypeLabel(changeType)}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Plan activo:</span>
        <span className="text-gray-600">{planId}</span>
      </div>

      {isScheduled && scheduledPlanId && (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Plan programado:</span>
          <span className="text-gray-600">{scheduledPlanId}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Efectivo:</span>
        <span className="text-gray-600">{formatEffectiveDateLabel(changeType, effectiveDate)}</span>
      </div>

      {isScheduled && (
        <p className="text-xs text-amber-600">
          El plan actual continúa activo hasta la fecha de efecto. Sin cobro inmediato.
        </p>
      )}
    </div>
  );
}
