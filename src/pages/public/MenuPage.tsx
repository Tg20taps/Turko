import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CategoryTabs } from '../../components/public/CategoryTabs';
import { CategoryProductSections } from '../../components/public/CategoryProductSections';
import { ProductGrid } from '../../components/public/ProductGrid';
import { getProducts, getCategories } from '../../services/products';
import { useCatalogUpdated } from '../../hooks/useCatalogUpdated';
import type { Category, CategorySlug, Product } from '../../types';

export function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'todos'>('todos');
  const [query, setQuery] = useState('');

  function loadData() {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      // Solo mostrar categorías que tienen al menos un producto activo
      const activeSlugs = new Set(prods.filter((p) => p.isActive).map((p) => p.categorySlug));
      setCategories(cats.filter((c) => activeSlugs.has(c.slug)));
    });
  }

  useEffect(() => { loadData(); }, []);

  // Re-cargar automáticamente cuando el admin modifique el catálogo
  useCatalogUpdated(loadData);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products
      .filter((product) => product.isActive)
      .filter((product) => activeCategory === 'todos' || product.categorySlug === activeCategory)
      .filter((product) =>
        term ? `${product.name} ${product.description}`.toLowerCase().includes(term) : true,
      );
  }, [products, activeCategory, query]);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-flame">Carta digital</p>
            <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">Elige tu antojo.</h1>
            <p className="mt-2 max-w-2xl text-cream/64">
              Revisa la carta, suma productos al carrito y confirma tu retiro en minutos.
            </p>
          </div>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar producto"
              className="h-12 w-full rounded-md border border-flame/14 bg-coal pl-11 pr-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-flame focus:ring-2 focus:ring-flame/25"
            />
          </label>
        </div>

        <div className="mb-6">
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        </div>

        {activeCategory === 'todos' ? (
          <CategoryProductSections categories={categories} products={visibleProducts} />
        ) : (
          <ProductGrid products={visibleProducts} />
        )}
      </main>
      <Footer />
    </div>
  );
}
