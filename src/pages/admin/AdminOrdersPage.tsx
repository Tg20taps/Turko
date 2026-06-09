import { useEffect, useMemo, useState } from 'react';
import { Download, Archive, RefreshCw } from 'lucide-react';
import { OrderCard } from '../../components/admin/OrderCard';
import { Button } from '../../components/ui/Button';
import { getOrders, updateOrderStatus, archiveActiveOrders } from '../../services/orders';
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

  function handleExportCSV() {
    if (orders.length === 0) {
      alert('No hay pedidos para exportar.');
      return;
    }

    const headers = [
      'Numero de Pedido',
      'Fecha',
      'Cliente',
      'Telefono',
      'Hora de Retiro',
      'Estado',
      'Total',
      'Productos',
      'Notas'
    ];

    const rows = orders.map((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('es-CL');
      const timeStr = new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
      const productList = order.items.map((i) => `${i.productName} (x${i.quantity})`).join(' | ');
      const escapedNotes = order.notes ? order.notes.replace(/"/g, '""') : '';

      return [
        order.orderNumber,
        `${dateStr} ${timeStr}`,
        order.customerName,
        order.customerPhone,
        order.pickupTime || 'No especificada',
        order.status,
        order.total,
        `"${productList}"`,
        `"${escapedNotes}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_pedidos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleClearOrders() {
    if (orders.length === 0) {
      alert('No hay pedidos en la bandeja para archivar.');
      return;
    }

    const confirmClear = window.confirm(
      '¿Estás seguro de cerrar la bandeja? Esto exportará automáticamente un respaldo en Excel y archivará todos los pedidos activos para comenzar el día limpio.'
    );

    if (!confirmClear) return;

    // Exportar primero para asegurar respaldo
    handleExportCSV();

    setIsLoading(true);
    try {
      await archiveActiveOrders();
      setOrders([]);
      alert('Bandeja limpiada con éxito. Se ha descargado el archivo Excel de respaldo.');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al archivar los pedidos.');
    } finally {
      setIsLoading(false);
    }
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
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" icon={<Download className="h-4 w-4" />} onClick={handleExportCSV} aria-label="Exportar a Excel">
            Exportar Excel
          </Button>
          <Button variant="secondary" icon={<Archive className="h-4 w-4" />} onClick={handleClearOrders} aria-label="Limpiar Bandeja">
            Limpiar Bandeja
          </Button>
          <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={loadOrders} aria-label="Actualizar">
            Actualizar
          </Button>
        </div>
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
