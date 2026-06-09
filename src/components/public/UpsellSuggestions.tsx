import { useEffect, useMemo, useState } from 'react';
import { CirclePlus, CupSoda, Sparkles, UsersRound, Utensils } from 'lucide-react';
import type { Product } from '../../types';
import { getProducts } from '../../services/products';
import { formatCurrency } from '../../lib/format';
import { useCartStore } from '../../store/cartStore';

const foodSlugs = ['churrascos', 'completos', 'as', 'para-compartir'];
const addonSlugs = ['acompanamientos', 'aderezos'];

function getCategoryLabel(slug: string): string {
  const map: Record<string, string> = {
    churrascos: 'Sándwich',
    completos: 'Completo',
    as: 'As',
    'para-compartir': 'Para compartir',
    acompanamientos: 'Acompañamiento',
    aderezos: 'Salsa',
    bebidas: 'Bebida',
  };
  return map[slug] ?? slug;
}

function scoreSuggestion(product: Product, hasFood: boolean, hasDrink: boolean, hasAddon: boolean, onlyDrinks: boolean) {
  let score = 0;
  if (onlyDrinks && foodSlugs.includes(product.categorySlug)) score += 60;
  if (hasFood && !hasDrink && product.categorySlug === 'bebidas') score += 52;
  if (!hasAddon && addonSlugs.includes(product.categorySlug)) score += 42;
  if (hasFood && addonSlugs.includes(product.categorySlug)) score += 24;
  if (hasDrink && addonSlugs.includes(product.categorySlug)) score += 18;
  if (hasFood && product.categorySlug === 'acompanamientos') score += 18;
  if (hasFood && product.categorySlug === 'para-compartir') score += 8;
  if (product.isFeatured) score += 4;
  return score;
}

function SuggestionIcon({ product }: { product: Product }) {
  if (product.categorySlug === 'bebidas') return <CupSoda className="h-4 w-4" />;
  if (product.categorySlug === 'aderezos') return <Sparkles className="h-4 w-4" />;
  if (product.categorySlug === 'para-compartir') return <UsersRound className="h-4 w-4" />;
  return <Utensils className="h-4 w-4" />;
}

export function UpsellSuggestions() {
  const lines = useCartStore((state) => state.lines);
  const addItem = useCartStore((state) => state.addItem);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  const suggestions = useMemo(() => {
    const productIds = new Set(lines.map((line) => line.product.id));
    const hasDrink = lines.some((line) => line.product.categorySlug === 'bebidas');
    const hasFood = lines.some((line) => foodSlugs.includes(line.product.categorySlug));
    const hasAddon = lines.some((line) => addonSlugs.includes(line.product.categorySlug));
    const onlyDrinks = lines.length > 0 && lines.every((line) => line.product.categorySlug === 'bebidas');

    return allProducts
      .filter((product) => product.isActive && product.isAvailable && !productIds.has(product.id))
      .map((product) => ({
        product,
        score: scoreSuggestion(product, hasFood, hasDrink, hasAddon, onlyDrinks),
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || a.product.sortOrder - b.product.sortOrder)
      .slice(0, 4)
      .map((s) => s.product);
  }, [allProducts, lines]);

  if (!suggestions.length) return null;

  return (
    <section className="rounded-lg border border-cream/8 bg-black/15 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-flame">Completa tu pedido</h3>
          <p className="mt-1 text-xs leading-5 text-cream/58">Papas, bebidas y salsas para que salga redondo.</p>
        </div>
        <span className="rounded-md border border-flame/20 bg-black/22 px-2 py-1 text-[11px] font-black uppercase text-flame">
          Extra
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {suggestions.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.name}`}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-cream/10 bg-black/28 p-3 text-left transition hover:border-flame/28 hover:bg-black/44 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame"
          >
            <span className="grid h-9 w-9 place-items-center rounded-md bg-cream/8 text-flame ring-1 ring-cream/10">
              <SuggestionIcon product={product} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-cream">{product.name}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cream/58">
                <span>{getCategoryLabel(product.categorySlug)}</span>
                <span>{formatCurrency(product.price)}</span>
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-flame text-ink shadow-[0_10px_24px_rgba(255,212,71,.22)] transition group-hover:bg-mustard">
              <CirclePlus className="h-5 w-5" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
