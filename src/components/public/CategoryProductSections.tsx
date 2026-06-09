import type { Category, Product } from '../../types';
import { ProductCard } from './ProductCard';

type Props = {
  categories: Category[];
  products: Product[];
};

const sectionTitles: Record<string, string> = {
  churrascos: 'Sándwiches y churrascos',
  completos: 'Completos',
  as: 'As',
  'para-compartir': 'Para compartir',
  acompanamientos: 'Acompañamientos',
  aderezos: 'Salsas y extras',
  bebidas: 'Bebidas',
};

export function CategoryProductSections({ categories, products }: Props) {
  const groups = categories
    .map((category) => ({
      category,
      products: products.filter((product) => product.categorySlug === category.slug),
    }))
    .filter((group) => group.products.length > 0);

  if (!groups.length) {
    return (
      <div className="rounded-lg border border-flame/14 bg-cream/5 p-8 text-center text-cream/70">
        No encontramos productos con esa búsqueda.
      </div>
    );
  }

  return (
    <div className="grid gap-12">
      {groups.map(({ category, products: categoryProducts }) => (
        <section key={category.slug} aria-labelledby={`section-${category.slug}`}>
          <div className="mb-5 flex flex-col gap-3 border-t border-flame/14 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-flame">Carta Rikki-Tikki</p>
              <h2 id={`section-${category.slug}`} className="mt-1 text-3xl font-black leading-tight text-cream">
                {sectionTitles[category.slug] ?? category.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-cream/62">{category.description}</p>
            </div>
            <span className="w-fit rounded-md bg-flame/10 px-3 py-1.5 text-xs font-black uppercase text-flame ring-1 ring-flame/20">
              {categoryProducts.length} productos
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
