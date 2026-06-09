# Rikki-Tikki PWA

Web app mobile-first para carta digital, pedidos de retiro y panel admin instalable.

## Correr localmente

```bash
npm install
npm run icons
npm run dev
```

La app publica queda en `/`, la carta en `/menu` y el panel en `/admin`.

## Variables

Copia `.env.example` a `.env.local` y completa:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
RESEND_API_KEY=
OWNER_EMAIL=
PUBLIC_SITE_URL=
```

Sin Supabase configurado, la app funciona en modo demo local con `localStorage`.

## Supabase

1. Ejecuta `supabase/schema.sql` en el SQL Editor.
2. Crea usuarios admin en Supabase Auth.
3. Publica la Edge Function `send-order-email`.
4. Configura secretos de la funcion: `RESEND_API_KEY`, `OWNER_EMAIL`, `PUBLIC_SITE_URL`.

## PWA

El manifest esta configurado con `start_url: /admin`, modo `standalone` e iconos en `public/icons`.

Android/Chrome: abrir el panel, tocar los tres puntos y elegir `Agregar a pantalla principal` o `Instalar app`.

iPhone/Safari: abrir el panel, tocar compartir y elegir `Agregar a pantalla de inicio`.
