import { Ban, Plus, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { formatCurrency } from '../../lib/format';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProductImageFrame } from '../ui/ProductImageFrame';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const servesLabel =
    product.serves === 1
      ? 'Para 1 persona'
      : product.serves
        ? `Para ${product.serves} personas`
        : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-lg border border-flame/14 bg-coal shadow-lift"
    >
      <ProductImageFrame
        src={product.imageUrl}
        alt={product.name}
        className="aspect-[4/3]"
        imageClassName="transition duration-500 group-hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isFeatured ? <Badge tone="yellow">Destacado</Badge> : null}
          {!product.isAvailable ? <Badge tone="red">Agotado</Badge> : null}
        </div>
        {product.serves ? (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-bold text-cream ring-1 ring-cream/12 backdrop-blur">
            <UsersRound className="h-4 w-4 text-flame" />
            {servesLabel}
          </div>
        ) : null}
      </ProductImageFrame>
      <div className="grid gap-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-black text-cream">{product.name}</h3>
            <p className="shrink-0 text-base font-black text-flame">{formatCurrency(product.price)}</p>
          </div>
          <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-cream/68">{product.description}</p>
        </div>
        <Button
          disabled={!product.isAvailable}
          onClick={() => addItem(product)}
          icon={product.isAvailable ? <Plus className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
          className="w-full"
        >
          {product.isAvailable ? 'Agregar' : 'No disponible'}
        </Button>
      </div>
    </motion.article>
  );
}
