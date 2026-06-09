import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CheckoutForm } from '../../components/public/CheckoutForm';
import { UpsellSuggestions } from '../../components/public/UpsellSuggestions';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/format';
import { createOrder } from '../../services/orders';
import { useCartStore } from '../../store/cartStore';
import type { CheckoutCustomer } from '../../types';

export function CheckoutPage() {
  const navigate = useNavigate();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [lines]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(customer: CheckoutCustomer) {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await createOrder(customer, lines);
      sessionStorage.setItem('rikki-tikki-last-order', JSON.stringify(order));
      clearCart();
      navigate(`/success?order=${order.orderNumber}`);
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : 'No se pudo confirmar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Título y navegación — FUERA del grid para que ambas columnas partan del mismo nivel */}
        <div className="mb-6">
          <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/65 hover:text-flame">
            <ArrowLeft className="h-4 w-4" />
            Volver a la carta
          </Link>
          <h1 className="mt-4 text-3xl font-black">Confirmar pedido</h1>
          <p className="mt-2 text-sm text-cream/64">
            Deja tus datos y confirmamos el pedido. El local puede contactarte si hace falta.
          </p>
        </div>

        {/* Grid de 2 columnas: ambas arrancan al mismo nivel */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Izquierda: formulario o estado vacío */}
          <section className="h-full">
            {lines.length ? (
              <CheckoutForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
            ) : (
              <div className="rounded-lg border border-dashed border-flame/24 bg-coal p-8 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-flame" />
                <h2 className="mt-4 text-xl font-black">No hay productos en el carrito</h2>
                <p className="mt-2 text-cream/62">Agrega algo a la carta antes de confirmar.</p>
                <Button asChild className="mt-5">
                  <Link to="/menu">Ir a la carta</Link>
                </Button>
              </div>
            )}
            {error ? <p className="mt-4 rounded-md bg-ember/20 p-3 text-sm text-red-100">{error}</p> : null}
          </section>

          {/* Derecha: resumen estático, siempre al mismo nivel */}
          <aside className="flex h-full flex-col rounded-lg border border-flame/14 bg-coal p-4">
            <h2 className="font-black">Resumen del pedido</h2>
            {/* Lista de productos con scroll si hay muchos */}
            <div className="mt-4 max-h-[200px] overflow-y-auto pr-1 [scrollbar-color:theme(colors.flame/0.3)_transparent] [scrollbar-width:thin]">
              <div className="grid gap-3">
                {lines.length ? (
                  lines.map((line) => (
                    <div key={line.product.id} className="flex items-center justify-between gap-2 border-b border-cream/5 pb-2 last:border-b-0 last:pb-0 text-sm">
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-cream font-bold">{line.product.name}</strong>
                        <p className="text-xs text-cream/54">{formatCurrency(line.product.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Control de cantidad compacto */}
                        <div className="grid h-7 grid-cols-3 overflow-hidden rounded-md border border-cream/12 bg-black/24">
                          <button
                            type="button"
                            className="grid w-6 place-items-center transition hover:bg-cream/10 text-cream/80"
                            onClick={() => decreaseQuantity(line.product.id)}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="grid min-w-6 place-items-center border-x border-cream/10 text-xs font-black">{line.quantity}</span>
                          <button
                            type="button"
                            className="grid w-6 place-items-center transition hover:bg-cream/10 text-cream/80"
                            onClick={() => increaseQuantity(line.product.id)}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        {/* Botón eliminar */}
                        <button
                          type="button"
                          className="grid h-7 w-7 place-items-center rounded-md text-cream/45 transition hover:bg-ember/18 hover:text-red-100"
                          onClick={() => removeItem(line.product.id)}
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {/* Subtotal del item */}
                        <span className="min-w-[64px] text-right font-bold text-flame">{formatCurrency(line.product.price * line.quantity)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-cream/45">Sin productos aún.</p>
                )}
              </div>
            </div>

            {lines.length ? (
              <div className="mt-auto pt-4 border-t border-cream/10">
                <UpsellSuggestions />
              </div>
            ) : null}
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}
