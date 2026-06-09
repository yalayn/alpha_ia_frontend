import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useValidateAccess, validateAccess } from '@/api/generated/orchestration/orchestration';
import type { AccessResult } from '@/api/generated/model';
import type { AccessControlFormValues } from '../types/access-control.types';

export function useAccessControl() {
  const [result, setResult] = useState<AccessResult | null>(null);

  const mutation = useValidateAccess({
    mutation: {
      onSuccess: (data) => setResult(data),
    },
  });

  function validate(values: AccessControlFormValues) {
    mutation.mutate({ data: values });
  }

  return { result, validate, isPending: mutation.isPending, error: mutation.error };
}

export function useFeatureAccess(customerId: string, featureId: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['access', customerId, featureId],
    queryFn: ({ signal }) => validateAccess({ customerId, featureId }, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!customerId && !!featureId,
  });

  return {
    hasAccess: data?.hasAccess ?? false,
    reason: data?.reason ?? null,
    subscriptionStatus: data?.subscriptionStatus ?? null,
    isLoading,
    isError,
  };
}
