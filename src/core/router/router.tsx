import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '@/core/auth/use-auth';
import { AppLayout } from '@/core/layout/AppLayout';

const AuthLoginPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.AuthLoginPage })),
);
const AuthRegisterPage = lazy(() =>
  import('@/features/auth').then((m) => ({ default: m.AuthRegisterPage })),
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
);
const PlansPage = lazy(() =>
  import('@/features/plans').then((m) => ({ default: m.PlansPage })),
);
const PlanDetailPage = lazy(() =>
  import('@/features/plans').then((m) => ({ default: m.PlanDetailPage })),
);
const PlanCreatePage = lazy(() =>
  import('@/features/plans').then((m) => ({ default: m.PlanCreatePage })),
);
const PlanEditPage = lazy(() =>
  import('@/features/plans').then((m) => ({ default: m.PlanEditPage })),
);
const SubscriptionDetailPage = lazy(() =>
  import('@/features/subscriptions').then((m) => ({ default: m.SubscriptionDetailPage })),
);
const SubscribePlanPage = lazy(() =>
  import('@/features/subscriptions').then((m) => ({ default: m.SubscribePlanPage })),
);
const AccessControlPage = lazy(() =>
  import('@/features/access-control').then((m) => ({ default: m.AccessControlPage })),
);
const ChangePlanPage = lazy(() =>
  import('@/features/plan-change').then((m) => ({ default: m.ChangePlanPage })),
);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Rutas públicas (sin layout)
  {
    path: '/login',
    element: <SuspenseWrapper><AuthLoginPage /></SuspenseWrapper>,
  },
  {
    path: '/register',
    element: <SuspenseWrapper><AuthRegisterPage /></SuspenseWrapper>,
  },

  // Rutas protegidas (con AppLayout)
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/dashboard',
        element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
      },
      {
        path: '/plans',
        element: <SuspenseWrapper><PlansPage /></SuspenseWrapper>,
      },
      {
        path: '/plans/new',
        element: (
          <RequireAdmin>
            <SuspenseWrapper><PlanCreatePage /></SuspenseWrapper>
          </RequireAdmin>
        ),
      },
      {
        path: '/plans/:planId',
        element: <SuspenseWrapper><PlanDetailPage /></SuspenseWrapper>,
      },
      {
        path: '/plans/:planId/edit',
        element: (
          <RequireAdmin>
            <SuspenseWrapper><PlanEditPage /></SuspenseWrapper>
          </RequireAdmin>
        ),
      },
      {
        path: '/subscriptions/new',
        element: <SuspenseWrapper><SubscribePlanPage /></SuspenseWrapper>,
      },
      {
        path: '/subscriptions/:subscriptionId',
        element: <SuspenseWrapper><SubscriptionDetailPage /></SuspenseWrapper>,
      },
      {
        path: '/subscriptions/:subscriptionId/change-plan',
        element: <SuspenseWrapper><ChangePlanPage /></SuspenseWrapper>,
      },
      {
        path: '/access',
        element: <SuspenseWrapper><AccessControlPage /></SuspenseWrapper>,
      },
    ],
  },

  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
]);
