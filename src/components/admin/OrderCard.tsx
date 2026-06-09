import { useState } from 'react';
import { ClipboardCopy, Clock, MessageCircle, Phone, Search, Send } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { orderStatuses, orderStatusMeta } from '../../types';
import { formatCurrency, formatDateTime } from '../../lib/format';
import {
  buildOrderSummary,
  buildOrderTakenMessage,
  buildQuestionMessage,
  buildReadyMessage,
  generateWhatsappLink,
} from '../../lib/whatsapp';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';

type Props = {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
};

export function OrderCard({ order, onStatusChange }: Props) {
  const [estimatedTime, setEstimatedTime] = useState(order.pickupTime ?? '');

  function copySummary() {
    navigator.clipboard.writeText(buildOrderSummary(order));
  }

  return (
    <article className="rounded-lg border border-cream/10 bg-coal p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black">#{order.orderNumber}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-cream/58">{formatDateTime(order.createdAt)}</p>
        </div>
        <strong className="text-2xl text-flame">{formatCurrency(order.total)}</strong>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-black/24 p-3">
          <p className="text-xs font-bold uppercase text-cream/45">Cliente</p>
          <p className="mt-1 font-black">{order.customerName}</p>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-cream/62">
            <Phone className="h-4 w-4 text-flame" />
            {order.customerPhone}
          </p>
        </div>
        <div className="rounded-md bg-black/24 p-3">
          <p className="text-xs font-bold uppercase text-cream/45">Retiro</p>
          <p className="mt-1 font-black">Retiro en local</p>
          <p className="mt-1 text-sm text-cream/62">{order.pickupTime ? `Hora estimada: ${order.pickupTime}` : 'Sin hora definida'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-cream/10 p-3">
        <p className="mb-2 text-xs font-bold uppercase text-cream/45">Productos</p>
        <div className="grid gap-2">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.productName}`} className="flex items-center justify-between gap-3 text-sm">
              <span>{item.quantity}x {item.productName}</span>
              <strong className="text-flame">{formatCurrency(item.subtotal)}</strong>
            </div>
          ))}
        </div>
        {order.notes ? <p className="mt-3 rounded bg-cream/8 p-2 text-sm text-cream/70">Obs: {order.notes}</p> : null}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-2 text-sm font-bold">
          Estado
          <select
            value={order.status}
            onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
            className="h-11 rounded-md border border-cream/12 bg-ink px-3 text-cream outline-none focus:border-flame focus:ring-2 focus:ring-flame/20"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {orderStatusMeta[status].label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-flame" />
            Hora estimada de retiro (para mensaje WS)
          </span>
          <input
            type="time"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="h-11 rounded-md border border-cream/12 bg-ink px-3 text-cream outline-none focus:border-flame focus:ring-2 focus:ring-flame/20"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="secondary" icon={<MessageCircle className="h-4 w-4" />}>
            <a href={generateWhatsappLink(order.customerPhone, buildOrderTakenMessage(order))} target="_blank" rel="noreferrer">
              Tomado
            </a>
          </Button>
          <Button asChild variant="secondary" icon={<Send className="h-4 w-4" />}>
            <a href={generateWhatsappLink(order.customerPhone, buildReadyMessage(order, estimatedTime))} target="_blank" rel="noreferrer">
              Listo
            </a>
          </Button>
          <Button asChild variant="secondary" icon={<Search className="h-4 w-4" />}>
            <a href={generateWhatsappLink(order.customerPhone, buildQuestionMessage(order))} target="_blank" rel="noreferrer">
              Consulta
            </a>
          </Button>
          <Button variant="ghost" icon={<ClipboardCopy className="h-4 w-4" />} onClick={copySummary}>
            Copiar
          </Button>
        </div>
      </div>
    </article>
  );
}
