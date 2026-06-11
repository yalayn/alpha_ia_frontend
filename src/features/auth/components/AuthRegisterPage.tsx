import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button, Input, ErrorMessage, Heading, Text, TextLink } from '@/shared';
import { registerSchema } from '../utils/auth.utils';
import { useRegisterForm } from '../hooks/use-auth-form';
import type { RegisterFormValues } from '../types/auth.types';

export function AuthRegisterPage() {
  const { registerMutate, isPending, error } = useRegisterForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  function onSubmit(data: RegisterFormValues) {
    registerMutate({ data });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Heading size="2xl">Crear cuenta</Heading>
          <Text variant="secondary" className="mt-1">Únete a Project Alpha</Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            autoComplete="name"
            errorMessage={errors.name?.message}
            {...register('name')}
          />
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
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            {...register('password')}
          />

          {error && <ErrorMessage error={error} />}

          <Button type="submit" isLoading={isPending} className="w-full">
            Crear cuenta
          </Button>
        </form>

        <Text variant="secondary" className="text-center">
          ¿Ya tienes cuenta?{' '}
          <TextLink as={Link} to="/login">Inicia sesión</TextLink>
        </Text>
      </div>
    </div>
  );
}
