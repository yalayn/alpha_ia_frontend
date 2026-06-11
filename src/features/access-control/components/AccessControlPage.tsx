import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardBody, CardHeader, Input, Button, Heading } from '@/shared';
import { useAccessControl } from '../hooks/use-access-control';
import { AccessResultCard } from './AccessResultCard';
import type { AccessControlFormValues } from '../types/access-control.types';

const schema = z.object({
  customerId: z.string().min(1, 'El ID del cliente es obligatorio'),
  featureId: z.string().min(1, 'El ID de la funcionalidad es obligatorio'),
});

export function AccessControlPage() {
  const { result, validate, isPending } = useAccessControl();
  const { register, handleSubmit, formState: { errors } } = useForm<AccessControlFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <Heading size="xl">Validar acceso</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(validate)} className="space-y-4">
            <Input label="ID del cliente" errorMessage={errors.customerId?.message} {...register('customerId')} />
            <Input label="ID de la funcionalidad" errorMessage={errors.featureId?.message} {...register('featureId')} />
            <Button type="submit" isLoading={isPending} className="w-full">Validar</Button>
          </form>
        </CardBody>
      </Card>

      {result && <AccessResultCard {...result} />}
    </div>
  );
}
