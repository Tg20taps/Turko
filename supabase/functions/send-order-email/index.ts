import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type OrderItem = {
  productName: string;
  quantity: number;
  subtotal: number;
};

type Order = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  total: number;
  status: string;
  pickupType: string;
  createdAt: string;
  items: OrderItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);
}

function html(order: Order) {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td>${item.quantity}x ${item.productName}</td><td align="right">${formatCurrency(item.subtotal)}</td></tr>`,
    )
    .join('');

  return `<!doctype html>
  <html lang="es">
    <body style="font-family:Arial,sans-serif;background:#050505;color:#fff4dc;padding:24px">
      <h1 style="color:#ffcb2e">Nuevo pedido Rikki-Tikki #${order.orderNumber}</h1>
      <p><strong>Cliente:</strong> ${order.customerName}</p>
      <p><strong>WhatsApp:</strong> ${order.customerPhone}</p>
      <p><strong>Modalidad:</strong> Retiro en local</p>
      <p><strong>Estado inicial:</strong> ${order.status}</p>
      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse">${rows}</table>
      <h2 style="color:#ffcb2e">Total: ${formatCurrency(order.total)}</h2>
      <p><strong>Observaciones:</strong> ${order.notes || 'Sin observaciones'}</p>
    </body>
  </html>`;
}

serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const ownerEmail = Deno.env.get('OWNER_EMAIL');

  if (!resendApiKey || !ownerEmail) {
    return new Response('Missing email configuration', { status: 500 });
  }

  const { order } = (await request.json()) as { order: Order };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Rikki-Tikki <pedidos@resend.dev>',
      to: [ownerEmail],
      subject: `Nuevo pedido Rikki-Tikki #${order.orderNumber}`,
      html: html(order),
    }),
  });

  if (!response.ok) {
    return new Response(await response.text(), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
