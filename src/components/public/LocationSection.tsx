import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export function LocationSection() {
  return (
    <section id="como-llegar" className="bg-ink py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div className="min-h-[360px] overflow-hidden rounded-lg border border-flame/14 bg-[linear-gradient(135deg,#171316,#0b0f14_52%,#ff4d2e)] p-5">
          <div className="grid h-full place-items-center rounded-md border border-dashed border-flame/40 bg-black/24 text-center">
            <div>
              <MapPin className="mx-auto h-12 w-12 text-flame" />
              <p className="mt-4 text-xl font-black text-cream">Mapa editable</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-cream/62">
                Cuando tengas la dirección exacta, aquí va el mapa embebido y el enlace real de Google Maps.
              </p>
            </div>
          </div>
        </div>

        <div className="grid content-center gap-5">
          <p className="text-sm font-black uppercase text-flame">Cómo llegar</p>
          <h2 className="text-4xl font-black leading-tight text-cream">Retiro en local, rápido y claro.</h2>
          <div className="grid gap-3 text-sm text-cream/70">
            <div className="rounded-lg border border-cream/10 bg-coal p-4">
              <strong className="block text-cream">Dirección</strong>
              <span>Editar dirección del local</span>
            </div>
            <div className="rounded-lg border border-cream/10 bg-coal p-4">
              <strong className="block text-cream">Horarios</strong>
              <span>Lunes a domingo, horarios por confirmar</span>
            </div>
            <div className="rounded-lg border border-cream/10 bg-coal p-4">
              <strong className="block text-cream">Modalidad</strong>
              <span>Solo retiro en local por ahora</span>
            </div>
          </div>
          <Button asChild icon={<ExternalLink className="h-5 w-5" />} className="w-fit">
            <a href="#" target="_blank" rel="noreferrer">
              Abrir en Google Maps
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
