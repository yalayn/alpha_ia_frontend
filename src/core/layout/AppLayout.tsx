import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/use-auth';
import { Button } from '@/shared';
import { cn } from '@/shared/utils/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', adminOnly: false },
  { to: '/plans', label: 'Planes', adminOnly: false },
  { to: '/subscription', label: 'Suscripción', adminOnly: false },
  { to: '/access', label: 'Validar Acceso', adminOnly: false },
];

function navLinkClass(isActive: boolean) {
  return cn(
    'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-600'
      : 'text-foreground-secondary hover:bg-subtle hover:text-foreground',
  );
}

// DESIGN_SYSTEM.md §7.2 — Topbar: 56px fijo, fondo surface, borde inferior, sticky
export function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-[100] w-full border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <span className="text-base font-bold tracking-tight text-brand-500">
              Project Alpha
            </span>
            {/* Nav links */}
            <div className="hidden items-center gap-1 sm:flex">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
              <span className="text-xs capitalize text-foreground-muted">
                {user?.role}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 sm:hidden">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
