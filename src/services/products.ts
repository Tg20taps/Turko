import { products as seedProducts, categories as seedCategories } from '../data/menu';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { slugify } from '../lib/format';
import { broadcastCatalogUpdate } from '../lib/catalogChannel';
import type { Category, CategorySlug, Product, ProductUpdate } from '../types';

const LOCAL_PRODUCTS_KEY = 'rikki-tikki-products';
const LOCAL_CATEGORIES_KEY = 'rikki-tikki-categories';

function readLocalProducts(): Product[] {
  const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  return raw ? (JSON.parse(raw) as Product[]) : seedProducts;
}

function writeLocalProducts(products: Product[]) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  broadcastCatalogUpdate();
}

function categoryIdFor(slug: CategorySlug) {
  return `cat-${
    slug === 'para-compartir'
      ? 'share'
      : slug === 'acompanamientos'
        ? 'sides'
        : slug === 'aderezos'
          ? 'sauces'
          : slug === 'bebidas'
            ? 'drinks'
            : slug
  }`;
}

function mapSupabaseProduct(row: any): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    isAvailable: row.is_available,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    serves: row.serves ?? undefined,
    sortOrder: row.sort_order,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapSupabaseProduct);
  }

  return readLocalProducts().sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function updateProduct(productId: string, update: ProductUpdate) {
  const normalized = {
    ...update,
    slug: update.name ? slugify(update.name) : undefined,
    categoryId: update.categorySlug ? categoryIdFor(update.categorySlug) : undefined,
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('products')
      .update({
        name: normalized.name,
        slug: normalized.slug,
        description: normalized.description,
        price: normalized.price,
        image_url: normalized.imageUrl,
        category_slug: normalized.categorySlug,
        category_id: normalized.categoryId,
        is_available: normalized.isAvailable,
        is_active: normalized.isActive,
        is_featured: normalized.isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    if (error) throw error;
    return;
  }

  const nextProducts = readLocalProducts().map((product) =>
    product.id === productId
      ? {
          ...product,
          ...update,
          slug: normalized.slug ?? product.slug,
          categoryId: normalized.categoryId ?? product.categoryId,
        }
      : product,
  );
  writeLocalProducts(nextProducts);
}

export async function addProduct(product: Omit<Product, 'id' | 'slug' | 'categoryId'>) {
  const id = crypto.randomUUID();
  const slug = slugify(product.name);
  const categoryId = categoryIdFor(product.categorySlug);

  const newProduct: Product = {
    ...product,
    id,
    slug,
    categoryId,
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').insert({
      id,
      name: product.name,
      slug,
      description: product.description,
      price: product.price,
      image_url: product.imageUrl,
      category_slug: product.categorySlug,
      category_id: categoryId,
      is_available: product.isAvailable,
      is_active: product.isActive,
      is_featured: product.isFeatured,
      sort_order: product.sortOrder,
    });
    if (error) throw error;
    return newProduct;
  }

  const nextProducts = [...readLocalProducts(), newProduct];
  writeLocalProducts(nextProducts);
  return newProduct;
}

export async function deleteProduct(productId: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    return;
  }

  const nextProducts = readLocalProducts().filter((p) => p.id !== productId);
  writeLocalProducts(nextProducts);
}

export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Fallback local: convertir a base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Categorías dinámicas ──────────────────────────────────────────────────────

function readLocalCategories(): Category[] {
  const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
  if (!raw) return seedCategories;
  try {
    const custom = JSON.parse(raw) as Category[];
    // Merge: categorías semilla + las personalizadas del admin (sin duplicados)
    const seedSlugs = new Set(seedCategories.map((c) => c.slug));
    const customOnly = custom.filter((c) => !seedSlugs.has(c.slug));
    return [...seedCategories, ...customOnly];
  } catch {
    return seedCategories;
  }
}

function writeCustomCategories(categories: Category[]) {
  // Solo persiste las que NO son parte del seed original
  const seedSlugs = new Set(seedCategories.map((c) => c.slug));
  const customOnly = categories.filter((c) => !seedSlugs.has(c.slug));
  localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(customOnly));
  broadcastCatalogUpdate();
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.warn('Error al leer categorías de Supabase, usando datos locales.', error);
      return readLocalCategories();
    }
    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? '',
      sortOrder: row.sort_order,
      isCustom: row.is_custom ?? false,
    }));
  }
  return readLocalCategories();
}

export async function addCategory(name: string, description: string): Promise<Category> {
  const slug = slugify(name);
  const allCurrent = readLocalCategories();
  const newCat: Category = {
    id: `cat-custom-${slug}`,
    name,
    slug,
    description,
    sortOrder: (allCurrent[allCurrent.length - 1]?.sortOrder ?? 0) + 1,
    isCustom: true,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        sort_order: newCat.sortOrder,
        is_custom: true,
      })
      .select()
      .single();
    if (error) throw error;
    return { ...newCat, id: data.id };
  }

  writeCustomCategories([...allCurrent, newCat]);
  return newCat;
}

