import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="rounded-lg border border-cream/10 bg-cream/5 p-8 text-center text-cream/70">
        No hay productos disponibles en esta categoría.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
