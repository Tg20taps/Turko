import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LockKeyhole, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAdminStore } from '../../store/adminStore';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const user = useAdminStore((state) => state.user);
  const login = useAdminStore((state) => state.login);
  const isLoading = useAdminStore((state) => state.isLoading);
  const error = useAdminStore((state) => state.error);
  const [email, setEmail] = useState('rodrigo@rikki.local');
  const [password, setPassword] = useState('demo1234');

  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/admin');
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-cream">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-cream/10 bg-coal p-5 shadow-lift sm:p-6">
        <div className="mb-6">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-flame text-ink">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <p className="mt-5 text-sm font-black uppercase text-flame">Rikki-Tikki Admin</p>
          <h1 className="mt-2 text-3xl font-black">Entrar al panel</h1>
          <p className="mt-3 text-sm leading-6 text-cream/62">
            {isSupabaseConfigured
              ? 'Usa las credenciales creadas en Supabase Auth.'
              : 'Modo demo local activo hasta configurar Supabase.'}
          </p>
        </div>

        <div className="grid gap-4">
          <Input label="Correo" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Clave" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p className="rounded-md bg-ember/20 p-3 text-sm text-red-100">{error}</p> : null}
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>

        <div className="mt-5 rounded-md bg-flame/10 p-3 text-sm leading-6 text-cream/70 ring-1 ring-flame/18">
          <p className="inline-flex items-center gap-2 font-bold text-flame">
            <Smartphone className="h-4 w-4" />
            Instalación PWA
          </p>
          <p className="mt-1">Abre este panel desde el celular y agrégalo a la pantalla de inicio.</p>
        </div>
      </form>
    </div>
  );
}
