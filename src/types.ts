// Categorías base conocidas — extendible dinámicamente por el administrador
export type CategorySlug = string;

export type OrderStatus =
  | 'pendiente'
  | 'tomado'
  | 'en_preparacion'
  | 'listo_retiro'
  | 'entregado'
  | 'cancelado';

export const orderStatuses: OrderStatus[] = [
  'pendiente',
  'tomado',
  'en_preparacion',
  'listo_retiro',
  'entregado',
  'cancelado',
];

export type OrderStatusMeta = {
  label: string;
  tone: 'yellow' | 'blue' | 'orange' | 'green' | 'neutral' | 'red';
};

export const orderStatusMeta: Record<OrderStatus, OrderStatusMeta> = {
  pendiente: { label: 'Pendiente', tone: 'yellow' },
  tomado: { label: 'Tomado', tone: 'blue' },
  en_preparacion: { label: 'En preparación', tone: 'orange' },
  listo_retiro: { label: 'Listo para retiro', tone: 'green' },
  entregado: { label: 'Entregado', tone: 'neutral' },
  cancelado: { label: 'Cancelado', tone: 'red' },
};

export type Category = {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  sortOrder: number;
  isCustom?: boolean; // true = creada por el admin
};

export type Product = {
  id: string;
  categoryId: string;
  categorySlug: CategorySlug;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  serves?: number;
  sortOrder: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type CheckoutCustomer = {
  customerName: string;
  customerPhone: string;
  notes: string;
  pickupTime: string;
  acceptsPickup: boolean;
};

export type OrderItem = {
  id?: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  pickupType: 'retiro';
  pickupTime?: string;
  status: OrderStatus;
  total: number;
  handledBy?: string | null;
  items: OrderItem[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductUpdate = Partial<
  Pick<Product, 'name' | 'description' | 'price' | 'imageUrl' | 'categorySlug' | 'isAvailable' | 'isActive' | 'isFeatured' | 'serves'>
>;
