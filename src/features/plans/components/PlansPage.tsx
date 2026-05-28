import { Link } from 'react-router-dom';
import { ErrorMessage } from '@/shared';
import { useAuth } from '@/core/auth/use-auth';
import { usePlans } from '../hooks/use-plans';
import { PlanSkeleton } from './PlanSkeleton';
import { PlanEmpty } from './PlanEmpty';
import { PlanList } from './PlanList';

export function PlansPage() {
  const { isAdmin } = useAuth();
  const { plans, isLoading, error } = usePlans();

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-100/50 to-transparent dark:from-indigo-900/10 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
      <div className="absolute top-32 left-0 -ml-32 w-72 h-72 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Planes de Suscripción
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
            Encuentra el plan perfecto para potenciar tus capacidades y las de tu equipo.
          </p>
          {isAdmin && (
            <div className="mt-8">
              <Link
                to="/plans/new"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="mr-2">+</span> Crear nuevo plan
              </Link>
            </div>
          )}
        </div>

        {isLoading && <PlanSkeleton />}
        {!isLoading && error && <ErrorMessage error={error} className="max-w-2xl mx-auto" />}
        {!isLoading && !error && plans.length === 0 && <PlanEmpty />}
        {!isLoading && !error && plans.length > 0 && <PlanList plans={plans} />}
      </div>
    </div>
  );
}
