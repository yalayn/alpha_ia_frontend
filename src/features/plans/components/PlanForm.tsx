import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/shared';
import type { PlanFormValues } from '../types/plans.types';

const planSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  currency: z.string().length(3, 'Usa código ISO (ej: EUR)'),
  interval: z.enum(['month', 'year']),
  features: z.array(z.object({ value: z.string().min(1) })).min(1, 'Agrega al menos una característica'),
});

type PlanFormSchema = z.infer<typeof planSchema>;

interface PlanFormProps {
  onSubmit: (values: PlanFormValues) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<PlanFormValues>;
  intervalLocked?: boolean;
  submitLabel?: string;
}

export function PlanForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
  intervalLocked = false,
  submitLabel = 'Crear plan',
}: PlanFormProps) {
  const initialFeatures = defaultValues?.features?.map((v) => ({ value: v })) ?? [{ value: '' }];

  const { register, handleSubmit, control, formState: { errors } } = useForm<PlanFormSchema>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      currency: defaultValues?.currency ?? 'EUR',
      interval: defaultValues?.interval ?? 'month',
      name: defaultValues?.name ?? '',
      price: defaultValues?.price ?? 0,
      features: initialFeatures,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'features' });

  async function handleValid(data: PlanFormSchema) {
    await onSubmit({ ...data, features: data.features.map((f) => f.value) });
  }

  return (
    <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
      <Input label="Nombre del plan" errorMessage={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Precio" type="number" step="0.01" errorMessage={errors.price?.message} {...register('price')} />
        <Input label="Moneda (ISO)" errorMessage={errors.currency?.message} {...register('currency')} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Intervalo</label>
        <select
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={intervalLocked}
          {...register('interval')}
        >
          <option value="month">Mensual</option>
          <option value="year">Anual</option>
        </select>
        {intervalLocked && (
          <p className="mt-1 text-xs text-amber-600">
            El intervalo no puede modificarse mientras el plan tenga suscripciones activas.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Características</label>
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input {...register(`features.${i}.value`)} className="flex-1" />
            {fields.length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => remove(i)}>✕</Button>
            )}
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: '' })}>
          + Agregar característica
        </Button>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="w-full">{submitLabel}</Button>
    </form>
  );
}
