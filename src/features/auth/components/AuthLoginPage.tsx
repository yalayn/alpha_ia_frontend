import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input, ErrorMessage, Heading, Text, TextLink } from '@/shared';
import { loginSchema } from '../utils/auth.utils';
import { useLoginForm } from '../hooks/use-auth-form';
import type { LoginFormValues } from '../types/auth.types';

export function AuthLoginPage() {
  const { loginMutate, isPending, error } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(data: LoginFormValues) {
    loginMutate({ data });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Heading size="2xl">Iniciar sesión</Heading>
          <Text variant="secondary" className="mt-1">Accede a tu cuenta de Project Alpha</Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          {error && <ErrorMessage error={error} />}

          <Button type="submit" isLoading={isPending} className="w-full">
            Entrar
          </Button>
        </form>

        <Text variant="secondary" className="text-center">
          ¿No tienes cuenta?{' '}
          <TextLink as={Link} to="/register">Regístrate</TextLink>
        </Text>
      </div>
    </div>
  );
}
