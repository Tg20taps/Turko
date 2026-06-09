import { FormEvent, useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Star, Eye, EyeOff, Users, Plus, ChevronDown } from 'lucide-react';
import type { Category, Product } from '../../types';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { uploadProductImage, getCategories, addCategory } from '../../services/products';

type Props = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'slug' | 'categoryId'>, productId?: string) => Promise<void>;
};

const defaultForm: Omit<Product, 'id' | 'slug' | 'categoryId'> = {
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  categorySlug: 'churrascos',
  isAvailable: true,
  isActive: true,
  isFeatured: false,
  sortOrder: 100,
  serves: undefined,
};

// Opciones de "para cuántas personas"
const servesOptions = [
  { value: '', label: 'Individual (1 persona)' },
  { value: '2', label: 'Para 2 personas' },
  { value: '3', label: 'Para 3 personas' },
  { value: '4', label: 'Para 4 personas' },
  { value: '6', label: 'Para 6 personas' },
  { value: '8', label: 'Para 8+ personas' },
];

export function ProductFormModal({ product, isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id' | 'slug' | 'categoryId'>>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Categorías dinámicas
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getCategories().then(setCategories);
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categorySlug: product.categorySlug,
        isAvailable: product.isAvailable,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        sortOrder: product.sortOrder,
        serves: product.serves,
      });
    } else {
      setForm(defaultForm);
    }
    setUploadError(null);
    setShowNewCatForm(false);
    setNewCatName('');
    setNewCatDesc('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  function update<K extends keyof Omit<Product, 'id' | 'slug' | 'categoryId'>>(key: K, value: any) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  // Activo/Disponible unificado → isActive controla todo
  const isInStock = form.isActive && form.isAvailable;
  function toggleInStock() {
    const next = !isInStock;
    setForm((c) => ({ ...c, isActive: next, isAvailable: next }));
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadProductImage(file);
      update('imageUrl', url);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAddCategory(e: React.MouseEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      const created = await addCategory(newCatName.trim(), newCatDesc.trim());
      setCategories((prev) => [...prev, created]);
      update('categorySlug', created.slug);
      setShowNewCatForm(false);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      alert('Error al crear la categoría: ' + (err.message ?? err));
    } finally {
      setIsAddingCat(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    await onSave(form, product?.id);
    setIsSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[94svh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-cream/10 bg-ink shadow-lift sm:rounded-2xl"
      >
        {/* Header fijo */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-cream/8 px-4 py-4 sm:px-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-flame">
              {product ? 'Editar producto' : 'Nuevo producto'}
            </p>
            <h2 className="text-xl font-black leading-tight sm:text-2xl">
              {product ? product.name : 'Crear producto'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/8 hover:bg-cream/15 active:scale-95 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <div className="grid gap-5">

            {/* Imagen */}
            <div>
              <p className="mb-2 text-sm font-semibold text-cream">Foto del producto</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Uploader */}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cream/20 bg-black/10 p-4 text-center transition hover:border-flame/60 active:scale-[.98]">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-7 w-7 animate-spin text-flame" />
                      <span className="text-xs text-cream/70">Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 text-cream/40" />
                      <span className="text-xs font-bold text-cream">Subir foto</span>
                      <span className="text-[11px] text-cream/40">Toca aquí</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                </label>

                {/* Preview */}
                <div className="relative overflow-hidden rounded-xl border border-cream/10 bg-black/24">
                  {form.imageUrl ? (
                    <>
                      <img src={form.imageUrl} alt="Vista previa" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => update('imageUrl', '')}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition hover:opacity-100 active:opacity-100 text-xs font-bold text-red-200"
                      >
                        Quitar
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[96px] flex-col items-center justify-center gap-1 text-cream/25">
                      <ImageIcon className="h-7 w-7" />
                      <span className="text-[11px]">Sin imagen</span>
                    </div>
                  )}
                </div>
              </div>
              {uploadError && <p className="mt-1.5 text-xs text-red-400">{uploadError}</p>}
            </div>

            {/* Nombre y descripción */}
            <Input
              label="Nombre del producto"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
            <Textarea
              label="Descripción"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
            />

            {/* Precio + Porciones */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Precio CLP"
                type="number"
                value={form.price || ''}
                onChange={(e) => update('price', Number(e.target.value))}
                required
              />
              <label className="grid gap-2 text-sm font-semibold text-cream">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-flame" />
                  ¿Para cuántas personas?
                </span>
                <select
                  value={form.serves ?? ''}
                  onChange={(e) => update('serves', e.target.value ? Number(e.target.value) : undefined)}
                  className="h-12 rounded-md border border-cream/15 bg-ink/70 px-3 text-sm text-cream outline-none focus:border-flame focus:ring-2 focus:ring-flame/25"
                >
                  {servesOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Categoría */}
            <div>
              <label className="grid gap-2 text-sm font-semibold text-cream">
                Categoría
                <select
                  value={form.categorySlug}
                  onChange={(e) => update('categorySlug', e.target.value)}
                  className="h-12 rounded-md border border-cream/15 bg-ink/70 px-3 text-base text-cream outline-none focus:border-flame focus:ring-2 focus:ring-flame/25"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}{cat.isCustom ? ' ✦' : ''}
                    </option>
                  ))}
                </select>
              </label>

              {/* Toggle nueva categoría */}
              <button
                type="button"
                onClick={() => setShowNewCatForm((v) => !v)}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold text-flame/80 hover:text-flame transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Crear nueva categoría
                <ChevronDown className={`h-3 w-3 transition-transform ${showNewCatForm ? 'rotate-180' : ''}`} />
              </button>

              {showNewCatForm && (
                <div className="mt-3 rounded-xl border border-cream/10 bg-coal p-4 grid gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-cream/50">Nueva categoría</p>
                  <Input
                    label="Nombre"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Ej: Especiales de temporada"
                  />
                  <Input
                    label="Descripción (opcional)"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Ej: Platos disponibles solo en temporada"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!newCatName.trim() || isAddingCat}
                    onClick={handleAddCategory}
                  >
                    {isAddingCat ? 'Creando...' : 'Agregar categoría'}
                  </Button>
                </div>
              )}
            </div>

            {/* Toggles: En carta / Destacado */}
            <div className="grid grid-cols-2 gap-3">
              {/* En carta (unifica isActive + isAvailable) */}
              <button
                type="button"
                onClick={toggleInStock}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition active:scale-[.97] ${
                  isInStock
                    ? 'border-green-500/40 bg-green-500/10 text-green-300'
                    : 'border-cream/12 bg-coal text-cream/50'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isInStock ? 'bg-green-500/20' : 'bg-cream/8'}`}>
                  {isInStock ? <Eye className="h-5 w-5 text-green-400" /> : <EyeOff className="h-5 w-5 text-cream/40" />}
                </div>
                <div>
                  <p className="text-sm font-black">{isInStock ? 'En carta' : 'Oculto'}</p>
                  <p className="text-xs opacity-70">{isInStock ? 'Visible y disponible' : 'No visible al cliente'}</p>
                </div>
              </button>

              {/* Destacado */}
              <button
                type="button"
                onClick={() => update('isFeatured', !form.isFeatured)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition active:scale-[.97] ${
                  form.isFeatured
                    ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
                    : 'border-cream/12 bg-coal text-cream/50'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${form.isFeatured ? 'bg-yellow-500/20' : 'bg-cream/8'}`}>
                  <Star className={`h-5 w-5 ${form.isFeatured ? 'fill-yellow-400 text-yellow-400' : 'text-cream/40'}`} />
                </div>
                <div>
                  <p className="text-sm font-black">{form.isFeatured ? 'Destacado' : 'Normal'}</p>
                  <p className="text-xs opacity-70">{form.isFeatured ? 'Aparece primero' : 'Toca para destacar'}</p>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Footer fijo con botón */}
        <div className="shrink-0 border-t border-cream/8 px-4 py-4 sm:px-5">
          <Button type="submit" disabled={isSaving || isUploading} className="w-full">
            {isSaving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
