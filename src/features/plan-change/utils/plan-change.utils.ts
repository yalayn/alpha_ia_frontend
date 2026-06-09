import type { ChangePlanResultChangeType } from '@/api/generated/model';

export function formatChangeTypeLabel(changeType: ChangePlanResultChangeType): string {
  return changeType === 'scheduled' ? 'Programado' : 'Inmediato';
}

export function formatEffectiveDateLabel(changeType: ChangePlanResultChangeType, effectiveDate: string): string {
  const formatted = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(effectiveDate));
  return changeType === 'scheduled' ? `Efecto el ${formatted}` : 'Efecto: Hoy';
}

export function getChangeTypeBadgeVariant(changeType: ChangePlanResultChangeType): 'warning' | 'success' {
  return changeType === 'scheduled' ? 'warning' : 'success';
}
