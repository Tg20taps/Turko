import type { Order } from '../types';
import { formatCurrency } from './format';

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('56')) return digits;
  if (digits.startsWith('9')) return `56${digits}`;
  return digits;
}

export function generateWhatsappLink(phone: string, message: string) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function buildOrderTakenMessage(order: Order) {
  return `¡Hola, ${order.customerName}! 👋
Somos Rikki-Tikki 🍟🌭

Tu pedido #${order.orderNumber} ya fue recibido y tomado por nuestro equipo ✅

Estamos comenzando a prepararlo. Te avisaremos por este mismo medio cuando esté listo para retiro.

📍 Modalidad: Retiro en local
🧾 Total: ${formatCurrency(order.total)}

¡Gracias por preferirnos! 💛🖤`;
}

export function buildReadyMessage(order: Order, estimatedTime?: string) {
  const timeInfo = estimatedTime
    ? `⏰ Hora estimada de retiro: *${estimatedTime} hrs*`
    : '📍 Modalidad: Retiro en local';

  return `¡Hola, ${order.customerName}! 👋
Tu pedido #${order.orderNumber} de Rikki-Tikki ya está listo para retiro ✅🔥

Puedes pasar por el local cuando gustes.

${timeInfo}
🧾 Total: ${formatCurrency(order.total)}

¡Te esperamos! 💛🖤`;
}

export function buildQuestionMessage(order: Order) {
  return `¡Hola, ${order.customerName}! 👋
Somos Rikki-Tikki 🍟🌭

Necesitamos confirmar un detalle de tu pedido #${order.orderNumber} antes de prepararlo.

¿Nos puedes responder este mensaje, por favor? 🙌

Quedamos atentos. 💛🖤`;
}

export function buildOrderSummary(order: Order) {
  const products = order.items
    .map((item) => `${item.quantity}x ${item.productName} - ${formatCurrency(item.subtotal)}`)
    .join('\n');

  return `Pedido #${order.orderNumber}
Cliente: ${order.customerName}
WhatsApp: ${order.customerPhone}
Modalidad: Retiro en local

${products}

Total: ${formatCurrency(order.total)}
Observaciones: ${order.notes || 'Sin observaciones'}`;
}
