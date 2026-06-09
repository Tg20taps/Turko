import { useEffect, useState } from 'react';
import { Edit3, Eye, EyeOff, Plus, RefreshCw, Star, Trash2, Users } from 'lucide-react';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProductImageFrame } from '../../components/ui/ProductImageFrame';
import { formatCurrency } from '../../lib/format';
import { getProducts, updateProduct, addProduct, deleteProduct, getCategories } from '../../services/products';
import type { Category, Product } from '../../types';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [editing, setEditing] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    const [nextProducts, nextCategories] = await Promise.all([getProducts(), getCategories()]);
    setProducts(nextProducts);
    setCategories(nextCategories);
    setIsLoading(false);
  }

  useEffect(() => { load(); }, []);

  function getCategoryName(slug: string) {
    return categories.find((c) => c.slug === slug)?.name ?? slug;
  }

  function getServesLabel(serves?: number) {
    if (!serves) return null;
    if (serves === 1) return 'Para 1 persona';
    return `Para ${serves} personas`;
  }

  async function handleSave(productData: Omit<Product, 'id' | 'slug' | 'categoryId'>, productId?: string) {
    if (productId) {
      await updateProduct(productId, productData);
      setProducts((cur) => cur.map((p) => (p.id === productId ? { ...p, ...productData } : p)));
    } else {
      const created = await addProduct(productData);
      setProducts((cur) => [...cur, created].sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }

  async function handleDelete(productId: string) {
    if (window.confirm('¿Seguro que deseas eliminar este producto de la carta?')) {
      await deleteProduct(productId);
      setProducts((cur) => cur.filter((p) => p.id !== productId));
    }
  }

  async function toggleInStock(product: Product) {
    const next = !(product.isActive && product.isAvailable);
    await updateProduct(product.id, { isActive: next, isAvailable: next });
    setProducts((cur) => cur.map((p) => (p.id === product.id ? { ...p, isActive: next, isAvailable: next } : p)));
  }

  async function toggleFeatured(product: Product) {
    const next = !product.isFeatured;
    await updateProduct(product.id, { isFeatured: next });
    setProducts((cur) => cur.map((p) => (p.id === product.id ? { ...p, isFeatured: next } : p)));
  }

  const filteredProducts = filterCategory === 'todas'
    ? products
    : products.filter((p) => p.categorySlug === filterCategory);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase text-flame">Productos</p>
          <h2 className="mt-2 text-3xl font-black">Carta administrable</h2>
          <p className="mt-2 text-sm text-cream/60">Agrega platos, sube fotos, edita precios y controla la disponibilidad.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={load}>
            Recargar
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => { setEditing(null); setIsModalOpen(true); }}
          >
            Agregar plato
          </Button>
        </div>
      </section>

      {/* Filtros por categoría */}
      {categories.length > 0 && (
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterCategory('todas')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
              filterCategory === 'todas'
                ? 'bg-flame text-ink'
                : 'bg-cream/8 text-cream/70 hover:bg-cream/14'
            }`}
          >
            Todas ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setFilterCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${
                  filterCategory === cat.slug
                    ? 'bg-flame text-ink'
                    : 'bg-cream/8 text-cream/70 hover:bg-cream/14'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Lista de productos — diseño mobile-first */}
      <section className="grid gap-3">
        {filteredProducts.map((product) => {
          const inStock = product.isActive && product.isAvailable;
          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl border border-cream/10 bg-coal"
            >
              {/* Fila principal */}
              <div className="flex items-start gap-3 p-3">
                {/* Imagen cuadrada compacta */}
                <ProductImageFrame
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-20 w-20 shrink-0 rounded-lg"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-black">{product.name}</h3>
                    {!inStock && <Badge tone="red">Oculto</Badge>}
                    {product.isFeatured && <Badge tone="yellow">★</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-cream/50">{getCategoryName(product.categorySlug)}</p>
                  {product.serves && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-cream/50">
                      <Users className="h-3 w-3 text-flame/70" />
                      {getServesLabel(product.serves)}
                    </p>
                  )}
                  <p className="mt-1.5 text-base font-black text-flame">{formatCurrency(product.price)}</p>
                </div>
              </div>

              {/* Barra de acciones táctil */}
              <div className="flex items-stretch border-t border-cream/8">
                {/* En carta / Oculto */}
                <button
                  type="button"
                  onClick={() => toggleInStock(product)}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold transition active:scale-95 ${
                    inStock
                      ? 'text-green-400 hover:bg-green-500/10'
                      : 'text-cream/40 hover:bg-cream/5'
                  }`}
                >
                  {inStock ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {inStock ? 'En carta' : 'Oculto'}
                </button>

                <div className="w-px bg-cream/8" />

                {/* Destacado */}
                <button
                  type="button"
                  onClick={() => toggleFeatured(product)}
                  className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold transition active:scale-95 ${
                    product.isFeatured
                      ? 'text-yellow-400 hover:bg-yellow-500/10'
                      : 'text-cream/40 hover:bg-cream/5'
                  }`}
                >
                  <Star className={`h-4 w-4 ${product.isFeatured ? 'fill-yellow-400' : ''}`} />
                  Destacar
                </button>

                <div className="w-px bg-cream/8" />

                {/* Editar */}
                <button
                  type="button"
                  onClick={() => { setEditing(product); setIsModalOpen(true); }}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold text-cream/60 transition hover:bg-cream/5 hover:text-cream active:scale-95"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </button>

                <div className="w-px bg-cream/8" />

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center px-4 py-3 text-red-400 transition hover:bg-red-500/10 active:scale-95"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}

        {isLoading && (
          <div className="rounded-xl border border-cream/10 bg-coal p-10 text-center text-cream/50">
            Cargando productos...
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && products.length > 0 && (
          <div className="rounded-xl border border-dashed border-cream/16 p-10 text-center text-cream/50">
            No hay productos en esta categoría.
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-cream/16 p-10 text-center text-cream/50">
            No hay productos aún. ¡Agrega el primero!
          </div>
        )}
      </section>

      <ProductFormModal
        product={editing}
        isOpen={isModalOpen}
        onClose={() => { setEditing(null); setIsModalOpen(false); }}
        onSave={handleSave}
      />
    </div>
  );
}
