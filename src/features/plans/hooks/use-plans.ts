import { useQueryClient } from '@tanstack/react-query';
import {
  useListPlans,
  useGetPlanById,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  getListPlansQueryKey,
  getGetPlanByIdQueryKey,
} from '@/api/generated/admin/admin';
import type { CreatePlanRequest, UpdatePlanRequest } from '@/api/generated/model';

export function usePlans() {
  const { data, isLoading, error } = useListPlans();

  return {
    plans: data?.data ?? [],
    isLoading,
    error,
  };
}

export function usePlanDetail(planId: string) {
  const { data, isLoading, error } = useGetPlanById(planId, {
    query: { enabled: !!planId },
  });

  return { plan: data ?? null, isLoading, error };
}

export function usePlanCreate() {
  const queryClient = useQueryClient();

  const mutation = useCreatePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
      },
    },
  });

  return {
    createPlan: (data: CreatePlanRequest) => mutation.mutateAsync({ data }),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function usePlanEdit(planId: string) {
  const queryClient = useQueryClient();

  const mutation = useUpdatePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetPlanByIdQueryKey(planId) });
      },
    },
  });

  return {
    updatePlan: (data: UpdatePlanRequest) => mutation.mutateAsync({ planId, data }),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function usePlanDelete() {
  const queryClient = useQueryClient();

  const mutation = useDeletePlan({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPlansQueryKey() });
      },
    },
  });

  return {
    deletePlan: (planId: string) => mutation.mutateAsync({ planId }),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
