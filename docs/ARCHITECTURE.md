# Arquitectura Rikki-Tikki

## Superficies

- Publico: landing, carta, carrito, checkout y confirmacion.
- Admin: login, dashboard, pedidos, productos y ajustes PWA.
- Integraciones: Supabase Auth, tablas de pedidos/productos, Edge Function de correo con Resend.

## Flujo cliente

1. Cliente escanea QR y entra a `/menu`.
2. Filtra productos, agrega al carrito y recibe sugerencias de bebidas o acompanamientos.
3. Completa nombre, WhatsApp, observaciones y confirma retiro en local.
4. El pedido se guarda y queda visible en admin.
5. En produccion, Supabase invoca el correo al dueno.

## Flujo admin

1. Rodrigo o empleado entra a `/admin`.
2. Revisa metricas del dia y pedidos.
3. Cambia estados: pendiente, tomado, en preparacion, listo para retiro, entregado o cancelado.
4. Abre WhatsApp con mensajes prearmados o copia resumen del pedido.
5. Edita disponibilidad, precio, descripcion e imagen de productos.

## Decisiones

- PWA web en vez de app nativa para reducir costo y facilitar mantenimiento.
- Fallback local para poder probar sin credenciales.
- RLS en Supabase para separar clientes y administradores.
- Edge Function para correo, sin exponer secretos en frontend.
