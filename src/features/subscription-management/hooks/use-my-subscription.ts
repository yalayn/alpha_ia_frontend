import { useGetCustomerSubscription } from '@/api/generated/subscriptions/subscriptions';
import { useGetPlanById } from '@/api/generated/admin/admin';

export function useMySubscription(customerId: string) {
  const subscriptionQuery = useGetCustomerSubscription(customerId, {
    query: {
      enabled: !!customerId,
      retry: (_, error) => (error as any)?.response?.status !== 404,
    },
  });

  const planId = subscriptionQuery.data?.planId;
  const planQuery = useGetPlanById(planId ?? '', {
    query: { enabled: !!planId },
  });

  const is404 = (subscriptionQuery.error as any)?.response?.status === 404;

  return {
    subscription: subscriptionQuery.data ?? null,
    plan: planQuery.data ?? null,
    isLoading: subscriptionQuery.isLoading || (!!planId && planQuery.isLoading),
    hasNoSubscription: is404,
    error: is404 ? null : subscriptionQuery.error ?? planQuery.error,
  };
}
