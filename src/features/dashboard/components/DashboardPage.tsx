import { Spinner, ErrorMessage, PageHeader } from '@/shared';
import { useAuth } from '@/core/auth/use-auth';
import { useDashboard } from '../hooks/use-dashboard';
import { HealthStatusCard } from './HealthStatusCard';

export function DashboardPage() {
  const { user } = useAuth();
  const { health, isLoading, error } = useDashboard();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <PageHeader
        title={`Bienvenido${user?.name ? `, ${user.name}` : ''}`}
        description={user?.role}
      />

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
      {error && <ErrorMessage error={error} />}
      {health && health.status && health.database && (
        <div className="max-w-sm">
          <HealthStatusCard
            status={health.status}
            database={health.database}
            timestamp={health.timestamp ?? new Date().toISOString()}
          />
        </div>
      )}
    </div>
  );
}
