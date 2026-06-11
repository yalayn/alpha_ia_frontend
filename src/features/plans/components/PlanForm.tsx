import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Button, Input, Select, Text } from '@/shared';
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

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PlanFormSchema>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      currency: defaultValues?.currency ?? 'EUR',
      interval: defaultValues?.interval ?? 'month',
      name: defaultValues?.name ?? '',
      price: defaultValues?.price ?? 0,
      features: initialFeatures,
    },
  });

  // Aplica los valores cuando vienen de props (modo edición con datos async)
  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? '',
        price: defaultValues.price ?? 0,
        currency: defaultValues.currency ?? 'EUR',
        interval: defaultValues.interval ?? 'month',
        features: (defaultValues.features ?? []).map((v) => ({ value: v })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name, defaultValues?.price, defaultValues?.currency, defaultValues?.interval]);

  const { fields, append, remove } = useFieldArray({ control, name: 'features' });

  async function handleValid(data: PlanFormSchema) {
    await onSubmit({ ...data, features: data.features.map((f) => f.value) });
  }

  return (
    <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
      <Input label="Nombre del plan" placeholder="ej. Plan Profesional" errorMessage={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Precio" type="number" step="0.01" errorMessage={errors.price?.message} {...register('price')} />
        <Input label="Moneda (ISO)" placeholder="ej. EUR" errorMessage={errors.currency?.message} {...register('currency')} />
      </div>
      <div>
        <Select
          label="Intervalo"
          options={[
            { value: 'month', label: 'Mensual' },
            { value: 'year', label: 'Anual' },
          ]}
          disabled={intervalLocked}
          {...register('interval')}
        />
        {intervalLocked && (
          <Text variant="muted" tone="warning" className="mt-1">
            El intervalo no puede modificarse mientras el plan tenga suscripciones activas.
          </Text>
        )}
      </div>
      <div className="space-y-2">
        <Text variant="label" as="span">Características</Text>
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input {...register(`features.${i}.value`)} className="flex-1" />
            {fields.length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => remove(i)} aria-label="Quitar característica">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: '' })}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Agregar característica
        </Button>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="w-full">{submitLabel}</Button>
    </form>
  );
}
