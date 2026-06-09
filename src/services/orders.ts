import type { CartLine, CheckoutCustomer, Order, OrderItem, OrderStatus } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const LOCAL_ORDERS_KEY = 'rikki-tikki-orders';

function makeOrderNumber() {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `RT-${day}-${String(now.getTime()).slice(-5)}`;
}

function readLocalOrders(): Order[] {
  const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
  return raw ? (JSON.parse(raw) as Order[]) : [];
}

function writeLocalOrders(orders: Order[]) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

function toOrderItems(lines: CartLine[]): OrderItem[] {
  return lines.map((line) => ({
    productId: line.product.id,
    productName: line.product.name,
    unitPrice: line.product.price,
    quantity: line.quantity,
    subtotal: line.product.price * line.quantity,
  }));
}

function mapSupabaseOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    notes: row.notes ?? '',
    pickupType: 'retiro',
    pickupTime: row.pickup_time ?? '',
    status: row.status,
    total: row.total,
    handledBy: row.handled_by,
    isArchived: !!row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: (row.order_items ?? []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
  };
}

export async function createOrder(customer: CheckoutCustomer, lines: CartLine[]) {
  const now = new Date().toISOString();
  const orderItems = toOrderItems(lines);
  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: makeOrderNumber(),
    customerName: customer.customerName.trim(),
    customerPhone: customer.customerPhone.trim(),
    notes: customer.notes.trim(),
    pickupType: 'retiro',
    pickupTime: customer.pickupTime,
    status: 'pendiente',
    total,
    handledBy: null,
    items: orderItems,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: order.orderNumber,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        notes: order.notes,
        pickup_type: order.pickupType,
        pickup_time: order.pickupTime || null,
        status: order.status,
        total: order.total,
      })
      .select()
      .single();

    if (error) throw error;

    const createdOrderId = data.id;
    const { error: itemsError } = await supabase.from('order_items').insert(
      order.items.map((item) => ({
        order_id: createdOrderId,
        product_id: item.productId,
        product_name: item.productName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    );

    if (itemsError) throw itemsError;

    const saved = { ...order, id: createdOrderId };
    await supabase.functions.invoke('send-order-email', { body: { order: saved } }).catch((error) => {
      console.warn('Pedido guardado, pero el correo no pudo enviarse', error);
    });

    return saved;
  }

  const orders = [order, ...readLocalOrders()];
  writeLocalOrders(orders);
  return order;
}

export async function getOrders(includeArchived = false): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)');

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapSupabaseOrder);
  }

  const localOrders = readLocalOrders();
  if (!includeArchived) {
    return localOrders.filter((order) => !order.isArchived);
  }
  return localOrders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, changedBy?: string) {
  if (isSupabaseConfigured && supabase) {
    const { data: previous } = await supabase.from('orders').select('status').eq('id', orderId).single();
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    if (error) throw error;

    await supabase.from('order_status_history').insert({
      order_id: orderId,
      old_status: previous?.status ?? null,
      new_status: status,
      changed_by: changedBy ?? null,
    });
    return;
  }

  const orders = readLocalOrders().map((order) =>
    order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString(), handledBy: changedBy } : order,
  );
  writeLocalOrders(orders);
}

export async function archiveActiveOrders() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('orders')
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq('is_archived', false);
    if (error) throw error;
    return;
  }

  const archived = readLocalOrders().map((order) =>
    order.isArchived ? order : { ...order, isArchived: true, updatedAt: new Date().toISOString() }
  );
  writeLocalOrders(archived);
}
