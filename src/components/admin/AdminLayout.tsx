import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ClipboardList, Home, LogOut, Package, Settings } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';

const navItems = [
  { label: 'Inicio', href: '/admin', icon: Home },
  { label: 'Pedidos', href: '/admin/orders', icon: ClipboardList },
  { label: 'Productos', href: '/admin/products', icon: Package },
  { label: 'Ajustes', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const user = useAdminStore((state) => state.user);
  const logout = useAdminStore((state) => state.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-40 border-b border-flame/14 bg-ink/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase text-flame">Rikki-Tikki Admin</p>
            <h1 className="text-sm font-black">{user?.name ?? 'Panel'}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-cream/68 transition hover:bg-cream/10 hover:text-cream"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 pb-24 sm:px-6 lg:grid-cols-[230px_1fr] lg:px-8 lg:pb-8">
        <aside className="hidden h-fit rounded-lg border border-flame/14 bg-coal p-2 lg:block">
          {navItems.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/admin'}
              className={({ isActive }) =>
                `mb-1 flex h-11 items-center gap-3 rounded-md px-3 text-sm font-bold transition ${
                  isActive ? 'bg-flame text-ink' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </aside>

        <main>
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-flame/14 bg-ink/94 px-2 py-2 backdrop-blur lg:hidden">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/admin'}
            className={({ isActive }) =>
              `grid justify-items-center gap-1 rounded-md px-2 py-2 text-[11px] font-bold transition ${
                isActive ? 'bg-flame text-ink' : 'text-cream/62'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
