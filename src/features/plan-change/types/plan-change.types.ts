export type { ChangePlanRequest, ChangePlanResult, ChangePlanResultChangeType } from '@/api/generated/model';

export interface PlanChangeFormValues {
  subscriptionId: string;
  newPlanId: string;
  paymentMethodId: string;
}
