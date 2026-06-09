import type { AccessResultReason, Plan } from '@/api/generated/model';

const reasonMessages: Record<string, string> = {
  no_active_subscription: 'Tu empresa no tiene un plan activo. Contacta a tu administrador.',
  subscription_expired: 'El plan de tu empresa ha expirado. Contacta a tu administrador.',
  feature_not_in_plan: 'Esta funcionalidad requiere un plan superior.',
};

export function reasonToMessage(reason: AccessResultReason | null | undefined): string {
  if (!reason) return '';
  return reasonMessages[reason] ?? reason;
}

export function getPlansWithFeature(plans: Plan[], featureId: string): Plan[] {
  return plans.filter((p) => p.features.includes(featureId));
}
