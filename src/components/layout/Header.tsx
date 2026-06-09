import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/cartStore';

const navItems = [
  { label: 'Carta', href: '/menu' },
  { label: 'Retiro', href: '/checkout' },
];

export function Header() {
  const totalItems = useCartStore((state) => state.totalItems());
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="sticky top-0 z-40 border-b border-flame/15 bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex items-center gap-3 text-cream">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-flame text-sm font-black text-ink shadow-glow">
            RT
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-black">Rikki-Tikki</span>
            <span className="block text-xs text-cream/55">Carta y retiro</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-flame/12 text-flame' : 'text-cream/70 hover:bg-cream/8 hover:text-cream'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Abrir carrito"
            size="icon"
            variant="secondary"
            onClick={openCart}
            className="relative"
            title="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-flame px-1 text-[11px] font-black text-ink">
                {totalItems}
              </span>
            ) : null}
          </Button>
          <Link
            to="/menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-cream hover:bg-cream/10 md:hidden"
            aria-label="Ir a la carta"
            title="Ir a la carta"
          >
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
