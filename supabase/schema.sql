create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  category_slug text not null,
  name text not null,
  slug text not null unique,
  description text not null,
  price int not null check (price >= 0),
  image_url text not null,
  is_available boolean default true,
  is_active boolean default true,
  is_featured boolean default false,
  serves int,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  pickup_type text not null default 'retiro',
  pickup_time text,
  status text not null default 'pendiente' check (
    status in ('pendiente', 'tomado', 'en_preparacion', 'listo_retiro', 'entregado', 'cancelado')
  ),
  total int not null check (total >= 0),
  is_archived boolean default false,
  handled_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price int not null,
  quantity int not null check (quantity > 0),
  subtotal int not null,
  created_at timestamptz default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.admin_profiles enable row level security;

create policy "public can read active categories"
on public.categories for select
using (true);

create policy "public can read active products"
on public.products for select
using (is_active = true or exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admins can manage products"
on public.products for all
using (exists (select 1 from public.admin_profiles where id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "clients can create orders"
on public.orders for insert
with check (pickup_type = 'retiro');

create policy "admins can read orders"
on public.orders for select
using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admins can update orders"
on public.orders for update
using (exists (select 1 from public.admin_profiles where id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "clients can create order items"
on public.order_items for insert
with check (true);

create policy "admins can read order items"
on public.order_items for select
using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admins can write status history"
on public.order_status_history for insert
with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admins can read status history"
on public.order_status_history for select
using (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "admins can read profiles"
on public.admin_profiles for select
using (id = auth.uid() or exists (select 1 from public.admin_profiles where id = auth.uid()));
