import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const heroImage = '/images/rikki-hero.jpg';

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-ink"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(11,15,20,.97) 0%, rgba(11,15,20,.78) 44%, rgba(255,77,46,.16) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />
      <div className="mx-auto grid min-h-[360px] max-w-7xl content-center px-4 py-12 sm:min-h-[430px] sm:px-6 lg:min-h-[460px] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-flame/16 px-3 py-2 text-xs font-bold uppercase text-flame ring-1 ring-flame/35">
            <Flame className="h-4 w-4" />
            Retiro en local
          </div>
          <h1 className="text-balance text-5xl font-black leading-none text-cream drop-shadow-[0_14px_28px_rgba(0,0,0,.35)] sm:text-6xl lg:text-7xl">
            Rikki-Tikki
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cream/80 sm:text-xl">
            Completos, churrascos, papas y bebidas para pedir rápido y retirar en el local.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              <Link to="/menu">Ver carta</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" icon={<MapPin className="h-5 w-5" />}>
              <a href="#como-llegar">Cómo llegar</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
