import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, DollarSign, PackageCheck, TrendingUp } from 'lucide-react';
import type { Order } from '../../types';
import { formatCurrency } from '../../lib/format';
import { getOrders } from '../../services/orders';
import { StatusBadge } from '../../components/admin/StatusBadge';

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeRange, setTimeRange] = useState<'hoy' | 'semana' | 'mes' | 'todo'>('hoy');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders(true)
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrdersByRange = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (timeRange === 'hoy') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (timeRange === 'semana') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return orderDate >= oneWeekAgo;
      }
      if (timeRange === 'mes') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(now.getDate() - 30);
        return orderDate >= oneMonthAgo;
      }
      return true; // 'todo'
    });
  }, [orders, timeRange]);

  const metrics = [
    {
      label: 'Pedidos en rango',
      value: filteredOrdersByRange.length.toString(),
      icon: ClipboardList,
      tone: 'text-flame',
    },
    {
      label: 'Venta estimada',
      value: formatCurrency(filteredOrdersByRange.reduce((sum, order) => sum + order.total, 0)),
      icon: DollarSign,
      tone: 'text-emerald-200',
    },
    {
      label: 'Pendientes',
      value: orders.filter((order) => ['pendiente', 'tomado', 'en_preparacion'].includes(order.status)).length.toString(),
      icon: TrendingUp,
      tone: 'text-orange-200',
    },
    {
      label: 'Listos',
      value: orders.filter((order) => order.status === 'listo_retiro').length.toString(),
      icon: PackageCheck,
      tone: 'text-sky-200',
    },
  ];

  const bestSellers = useMemo(() => {
    const counts = new Map<string, number>();
    filteredOrdersByRange.forEach((order) => {
      order.items.forEach((item) => {
        counts.set(item.productName, (counts.get(item.productName) ?? 0) + item.quantity);
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredOrdersByRange]);

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase text-flame">Resumen de operaciones</p>
          <h2 className="mt-2 text-3xl font-black">Operación en vivo</h2>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg bg-coal p-1">
          {(['hoy', 'semana', 'mes', 'todo'] as const).map((range) => {
            const labels = { hoy: 'Hoy', semana: '7 días', mes: '30 días', todo: 'Todo' };
            return (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                  timeRange === range
                    ? 'bg-flame text-ink'
                    : 'text-cream/60 hover:text-cream'
                }`}
              >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-lg border border-cream/10 bg-coal p-4">
            <Icon className={`h-5 w-5 ${tone}`} />
            <p className="mt-4 text-sm font-bold text-cream/55">{label}</p>
            <strong className="mt-1 block text-2xl font-black">{value}</strong>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-lg border border-cream/10 bg-coal p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black">Últimos pedidos</h3>
            <span className="text-xs font-bold uppercase text-cream/45">{isLoading ? 'Cargando' : `${orders.length} total`}</span>
          </div>
          <div className="grid gap-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="grid gap-2 rounded-md bg-black/25 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-black">#{order.orderNumber} · {order.customerName}</p>
                  <p className="text-sm text-cream/58">{order.items.length} productos · {formatCurrency(order.total)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
            {!orders.length && !isLoading ? <p className="rounded-md bg-black/24 p-4 text-sm text-cream/62">Aún no hay pedidos registrados.</p> : null}
          </div>
        </article>

        <article className="rounded-lg border border-cream/10 bg-coal p-4">
          <h3 className="font-black">Más pedidos</h3>
          <div className="mt-4 grid gap-3">
            {bestSellers.map(([name, quantity]) => (
              <div key={name} className="flex items-center justify-between gap-3 rounded-md bg-black/25 p-3">
                <span className="text-sm font-bold">{name}</span>
                <strong className="text-flame">{quantity}</strong>
              </div>
            ))}
            {!bestSellers.length ? <p className="rounded-md bg-black/24 p-4 text-sm text-cream/62">Los más vendidos aparecerán cuando entren pedidos.</p> : null}
          </div>
        </article>
      </section>
    </div>
  );
}
