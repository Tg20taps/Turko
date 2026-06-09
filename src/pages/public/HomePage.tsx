import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Hero } from '../../components/public/Hero';
import { ProductGrid } from '../../components/public/ProductGrid';
import { AboutSection } from '../../components/public/AboutSection';
import { LocationSection } from '../../components/public/LocationSection';
import { Button } from '../../components/ui/Button';
import { getProducts } from '../../services/products';
import { useCatalogUpdated } from '../../hooks/useCatalogUpdated';
import type { Product } from '../../types';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  function loadFeatured() {
    getProducts().then((prods) => {
      setFeatured(prods.filter((p) => p.isFeatured && p.isActive).slice(0, 6));
    });
  }

  useEffect(() => { loadFeatured(); }, []);

  // Re-cargar automáticamente cuando el admin modifique el catálogo
  useCatalogUpdated(loadFeatured);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main>
        <Hero />

        <section className="bg-ink py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-black uppercase text-flame">
                  <Sparkles className="h-4 w-4" />
                  Carta destacada
                </p>
                <h2 className="mt-3 text-4xl font-black leading-tight">Lo que entra por los ojos.</h2>
                <p className="mt-3 max-w-2xl text-cream/64">
                  Una probada rápida de la carta antes de entrar al menú completo.
                </p>
              </div>
              <Button asChild variant="secondary" icon={<ArrowRight className="h-5 w-5" />}>
                <Link to="/menu">Ver carta completa</Link>
              </Button>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>

        <AboutSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
