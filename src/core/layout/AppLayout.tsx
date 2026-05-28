import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/use-auth';
import { Button } from '@/shared';
import { cn } from '@/shared/utils/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', adminOnly: false },
  { to: '/plans', label: 'Planes', adminOnly: false },
  { to: '/access', label: 'Validar Acceso', adminOnly: false },
];

export function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <span className="text-base font-bold tracking-tight text-indigo-600">
              Project Alpha
            </span>
            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-1">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.name}
              </span>
              <span className="text-xs capitalize text-slate-500 dark:text-slate-400">
                {user?.role}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden overflow-x-auto border-t border-slate-100 dark:border-slate-800 px-4 py-2 gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100',
                )
              }
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
