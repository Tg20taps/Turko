import { CheckCircle2, Database, Mail, Smartphone, TriangleAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const setup = [
  ['Android / Chrome', 'Abrir el enlace del panel, tocar los tres puntos, elegir Agregar a pantalla principal o Instalar app y confirmar.'],
  ['iPhone / Safari', 'Abrir el enlace del panel, tocar compartir, elegir Agregar a pantalla de inicio y confirmar.'],
];

export function AdminSettingsPage() {
  return (
    <div className="grid gap-6">
      <section>
        <p className="text-sm font-black uppercase text-flame">Ajustes</p>
        <h2 className="mt-2 text-3xl font-black">PWA e integraciones</h2>
        <p className="mt-2 text-sm text-cream/60">Estado técnico y pasos para dejar el panel listo en celular.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-cream/10 bg-coal p-4">
          <Database className="h-6 w-6 text-flame" />
          <h3 className="mt-4 font-black">Supabase</h3>
          <p className="mt-2 text-sm leading-6 text-cream/62">
            {isSupabaseConfigured ? 'Variables detectadas. El proyecto usará Supabase.' : 'Modo local activo. Agrega URL y anon key para producción.'}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
            {isSupabaseConfigured ? <CheckCircle2 className="h-4 w-4 text-emerald-200" /> : <TriangleAlert className="h-4 w-4 text-flame" />}
            {isSupabaseConfigured ? 'Conectado' : 'Pendiente'}
          </p>
        </article>
        <article className="rounded-lg border border-cream/10 bg-coal p-4">
          <Mail className="h-6 w-6 text-flame" />
          <h3 className="mt-4 font-black">Correo al dueño</h3>
          <p className="mt-2 text-sm leading-6 text-cream/62">
            La Edge Function usa Resend y OWNER_EMAIL para avisar a Rodrigo por cada pedido.
          </p>
        </article>
        <article className="rounded-lg border border-cream/10 bg-coal p-4">
          <Smartphone className="h-6 w-6 text-flame" />
          <h3 className="mt-4 font-black">PWA</h3>
          <p className="mt-2 text-sm leading-6 text-cream/62">
            Manifest, íconos, tema oscuro y modo standalone están configurados para el admin.
          </p>
        </article>
      </section>

      <section className="rounded-lg border border-cream/10 bg-coal p-4">
        <h3 className="font-black">Instalar en celular</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {setup.map(([title, copy]) => (
            <div key={title} className="rounded-md bg-black/25 p-4">
              <p className="font-black text-flame">{title}</p>
              <p className="mt-2 text-sm leading-6 text-cream/62">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-cream/10 bg-coal p-4">
        <h3 className="font-black">QR para clientes</h3>
        <p className="mt-2 text-sm leading-6 text-cream/62">
          Cuando esté publicado en Vercel, genera el QR apuntando a la URL pública de la carta, idealmente
          <code className="mx-1 rounded bg-black/40 px-1.5 py-0.5 text-flame">/menu</code>.
        </p>
      </section>
    </div>
  );
}
