import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, ErrorMessage, Spinner, Button } from '@/shared';
import { usePlanDetail, usePlanDelete } from '../hooks/use-plans';
import { formatPlanPrice } from '../utils/plans.utils';

export function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plan, isLoading, error } = usePlanDetail(planId ?? '');
  const { deletePlan, isPending: isDeleting, error: deleteError } = usePlanDelete();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  if (error) return <ErrorMessage error={error} className="m-6" />;
  if (!plan) return null;

  async function handleDelete() {
    await deletePlan(planId!);
    navigate('/plans');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to="/plans"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        ← Volver a Planes
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatPlanPrice(plan.price, plan.currency, plan.interval)}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/plans/${planId}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Características incluidas</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
          {deleteError && <ErrorMessage error={deleteError} className="mt-4" />}
        </CardBody>
      </Card>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Eliminar plan</h2>
            <p className="text-sm text-gray-600 mb-1">
              ¿Estás seguro de que quieres eliminar <strong>{plan.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              Esta acción es irreversible y no puede deshacerse.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
