import { useQueryClient } from '@tanstack/react-query';
import {
  useChangePlan,
  getGetSubscriptionByIdQueryKey,
} from '@/api/generated/subscriptions/subscriptions';
import type { ChangePlanRequest } from '@/api/generated/model';

export function usePlanChange(subscriptionId: string) {
  const queryClient = useQueryClient();

  const mutation = useChangePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetSubscriptionByIdQueryKey(subscriptionId),
        });
      },
    },
  });

  return {
    changePlan: (data: ChangePlanRequest) =>
      mutation.mutateAsync({ subscriptionId, data }),
    result: mutation.data ?? null,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}
