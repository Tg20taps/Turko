import { useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { OrderCard } from '../../components/admin/OrderCard';
import { Button } from '../../components/ui/Button';
import { getOrders, updateOrderStatus } from '../../services/orders';
import { useAdminStore } from '../../store/adminStore';
import type { Order, OrderStatus } from '../../types';
import { orderStatuses, orderStatusMeta } from '../../types';

export function AdminOrdersPage() {
  const admin = useAdminStore((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(true);

  async function loadOrders() {
    setIsLoading(true);
    const nextOrders = await getOrders();
    setOrders(nextOrders);
    setIsLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    await updateOrderStatus(orderId, nextStatus, admin?.email);
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status: nextStatus, updatedAt: new Date().toISOString() } : order)),
    );
  }

  const filteredOrders = useMemo(
    () => orders.filter((order) => (status === 'todos' ? true : order.status === status)),
    [orders, status],
  );

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase text-flame">Pedidos</p>
          <h2 className="mt-2 text-3xl font-black">Bandeja de retiro</h2>
          <p className="mt-2 text-sm text-cream/60">Cambia estados y abre WhatsApp con mensajes listos para enviar.</p>
        </div>
        <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={loadOrders}>
          Actualizar
        </Button>
      </section>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setStatus('todos')}
          className={`h-10 shrink-0 rounded-md px-3 text-sm font-bold ${
            status === 'todos' ? 'bg-flame text-ink' : 'bg-cream/8 text-cream'
          }`}
        >
          Todos
        </button>
        {orderStatuses.map((orderStatus) => (
          <button
            key={orderStatus}
            type="button"
            onClick={() => setStatus(orderStatus)}
            className={`h-10 shrink-0 rounded-md px-3 text-sm font-bold ${
              status === orderStatus ? 'bg-flame text-ink' : 'bg-cream/8 text-cream'
            }`}
          >
            {orderStatusMeta[orderStatus].label}
          </button>
        ))}
      </div>

      <section className="grid gap-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} onStatusChange={(nextStatus) => handleStatusChange(order.id, nextStatus)} />
        ))}
        {!filteredOrders.length && !isLoading ? (
          <div className="rounded-lg border border-dashed border-cream/16 bg-coal p-8 text-center text-cream/62">
            No hay pedidos en este estado.
          </div>
        ) : null}
        {isLoading ? <div className="rounded-lg border border-cream/10 bg-coal p-8 text-center text-cream/62">Cargando pedidos...</div> : null}
      </section>
    </div>
  );
}
