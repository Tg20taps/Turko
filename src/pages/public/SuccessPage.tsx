import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';

export function SuccessPage() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order') ?? 'confirmado';

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main className="mx-auto grid min-h-[70svh] max-w-3xl place-items-center px-4 py-12">
        <section className="rounded-lg border border-cream/10 bg-coal p-8 text-center shadow-lift">
          <CheckCircle2 className="mx-auto h-14 w-14 text-flame" />
          <p className="mt-5 text-sm font-black uppercase text-flame">Pedido recibido</p>
          <h1 className="mt-3 text-4xl font-black">#{orderNumber}</h1>
          <p className="mt-4 text-cream/66">
            Tu pedido quedó registrado para retiro en local. El equipo puede contactarte por WhatsApp si necesita
            confirmar algún detalle.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild icon={<MessageCircle className="h-5 w-5" />}>
              <a href="https://wa.me/56900000000">Contactar local</a>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/menu">Volver a la carta</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
