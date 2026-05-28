import { Link } from 'react-router-dom';
import { Card } from '@/shared';
import { formatPlanPrice } from '../utils/plans.utils';
import type { Plan } from '@/api/generated/model';

type PlanCardProps = Pick<Plan, 'id' | 'name' | 'price' | 'currency' | 'interval' | 'features'> & {
  isPopular?: boolean;
};

export function PlanCard({ id, name, price, currency, interval, features, isPopular }: PlanCardProps) {
  return (
    <Card 
      className={`relative flex flex-col h-full bg-white dark:bg-slate-900 border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isPopular 
          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-lg shadow-indigo-500/10 scale-105 z-10' 
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 -mr-2 -mt-2">
          <span className="inline-flex items-center rounded-bl-lg rounded-tr-lg bg-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
            Más Popular
          </span>
        </div>
      )}
      <div className="p-8 flex-1">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{name}</h3>
        <p className="flex items-baseline gap-x-2">
          <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatPlanPrice(price, currency, interval).replace(`/${interval}`, '')}
          </span>
          <span className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            /{interval === 'month' ? 'mes' : 'año'}
          </span>
        </p>
        <ul className="mt-8 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {features.map((f, i) => (
            <li key={i} className="flex gap-x-3 items-start">
              <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-8 pt-0 mt-auto">
        <Link
          to={`/plans/${id}`}
          className={`block w-full rounded-full px-4 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isPopular
              ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 shadow-md hover:shadow-lg'
              : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
          }`}
        >
          Seleccionar plan
        </Link>
      </div>
    </Card>
  );
}
