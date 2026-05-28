import { useNavigate } from 'react-router-dom';
import { useLoginUser, useRegisterUser } from '@/api/generated/auth/auth';
import { useAuth } from '@/core/auth/use-auth';

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useLoginUser({
    mutation: {
      onSuccess: (data) => {
        if (data.user && data.accessToken) login(data.user, data.accessToken);
        navigate('/dashboard');
      },
    },
  });

  return {
    loginMutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

export function useRegisterForm() {
  const navigate = useNavigate();

  const mutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        // registerUser devuelve User sin token — redirigir al login
        navigate('/login');
      },
    },
  });

  return {
    registerMutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
