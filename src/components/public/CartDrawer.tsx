import { useRef, useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/format';
import { createOrder } from '../../services/orders';
import type { CheckoutCustomer } from '../../types';
import { Button } from '../ui/Button';
import { ProductImageFrame } from '../ui/ProductImageFrame';
import { CheckoutForm } from './CheckoutForm';
import { UpsellSuggestions } from './UpsellSuggestions';

type Step = 'cart' | 'form';

export function CartDrawer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lines = useCartStore((state) => state.lines);
  const isOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.subtotal());
  const isAdmin = pathname.startsWith('/admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('cart');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pickupFormId = 'cart-pickup-form';

  async function handlePickupSubmit(customer: CheckoutCustomer) {
    if (!lines.length) return;
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

  function goToForm() {
    setStep('form');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToCart() {
    setStep('cart');
    setError(null);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            className="absolute inset-0 bg-black/66 backdrop-blur-sm"
            aria-label="Cerrar carrito"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-flame/14 bg-ink text-cream shadow-lift"
          >
            {/* ── Header ── */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-flame/14 px-4">
              <div className="flex items-center gap-2">
                {step === 'form' ? (
                  <button
                    onClick={goToCart}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-cream/10 transition"
                    aria-label="Volver al carrito"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <ShoppingBag className="h-5 w-5 text-flame" />
                )}
                <h2 className="font-black">
                  {step === 'cart' ? 'Tu carrito' : 'Tus datos'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full transition-colors ${step === 'cart' ? 'bg-flame' : 'bg-cream/25'}`} />
                  <span className={`h-2 w-2 rounded-full transition-colors ${step === 'form' ? 'bg-flame' : 'bg-cream/25'}`} />
                </div>
                <button
                  className="grid h-10 w-10 place-items-center rounded-md hover:bg-cream/10"
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ── Body (scrollable) ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {step === 'cart' ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.18 }}
                    className="p-4"
                  >
                    {lines.length ? (
                      <div className="grid gap-3">
                        {/* Product list */}
                        {lines.map((line) => (
                          <article key={line.product.id} className="grid gap-2 rounded-lg border border-cream/10 bg-coal/95 p-2.5 shadow-[0_8px_20px_rgba(0,0,0,.18)]">
                            <div className="grid grid-cols-[56px_1fr_auto] items-center gap-2.5">
                              <ProductImageFrame
                                src={line.product.imageUrl}
                                alt={line.product.name}
                                className="h-14 w-14"
                              />
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-black">{line.product.name}</h3>
                                <p className="text-xs text-flame">{formatCurrency(line.product.price)}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border border-cream/12 bg-black/24">
                                  <button
                                    className="grid w-8 place-items-center transition hover:bg-cream/10"
                                    onClick={() => decreaseQuantity(line.product.id)}
                                    aria-label="Disminuir cantidad"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="grid min-w-8 place-items-center border-x border-cream/10 text-xs font-black">{line.quantity}</span>
                                  <button
                                    className="grid w-8 place-items-center transition hover:bg-cream/10"
                                    onClick={() => increaseQuantity(line.product.id)}
                                    aria-label="Aumentar cantidad"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <button
                                  className="grid h-8 w-8 place-items-center rounded-md text-cream/45 transition hover:bg-ember/18 hover:text-red-100"
                                  onClick={() => removeItem(line.product.id)}
                                  aria-label="Quitar producto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}

                        {/* Upsell always visible */}
                        <UpsellSuggestions />

                        {/* Brand stamp */}
                        <div className="flex justify-center py-3">
                          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-flame to-mustard px-5 py-1.5 shadow-glow">
                            <span className="font-display text-sm font-black tracking-wide text-ink">Rikki-Tikki</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid h-64 place-items-center rounded-lg border border-dashed border-cream/16 p-8 text-center">
                        <div>
                          <ShoppingBag className="mx-auto h-10 w-10 text-flame" />
                          <h3 className="mt-4 font-black">Tu carrito está vacío</h3>
                          <p className="mt-2 text-sm text-cream/62">Agrega un completo, churrasco o bebida para partir.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.18 }}
                    className="p-4"
                  >
                    <CheckoutForm
                      formId={pickupFormId}
                      variant="drawer"
                      isSubmitting={isSubmitting}
                      onSubmit={handlePickupSubmit}
                      hideSubmit
                    />
                    {error ? <p className="mt-3 rounded-md bg-ember/20 p-3 text-sm text-red-100">{error}</p> : null}

                    {/* Brand stamp */}
                    <div className="flex justify-center py-3">
                      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-flame to-mustard px-5 py-1.5 shadow-glow">
                        <span className="font-display text-sm font-black tracking-wide text-ink">Rikki-Tikki</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer (always visible, never scrolls) ── */}
            <div className="shrink-0 border-t border-flame/14 p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-cream/62">Total estimado</span>
                <strong className="text-2xl text-flame">{formatCurrency(subtotal)}</strong>
              </div>

              {step === 'cart' ? (
                <div className="grid gap-2">
                  <Button
                    disabled={!lines.length}
                    className="w-full"
                    onClick={goToForm}
                  >
                    Continuar con el pedido →
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="secondary" onClick={closeCart}>
                      <Link to="/menu">Seguir comprando</Link>
                    </Button>
                    <Button variant="ghost" disabled={!lines.length} onClick={clearCart} icon={<Trash2 className="h-4 w-4" />}>
                      Vaciar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Button
                    type="submit"
                    form={pickupFormId}
                    disabled={!lines.length || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Confirmando pedido...' : 'Confirmar pedido'}
                  </Button>
                  <Button variant="secondary" onClick={goToCart}>
                    ← Volver al carrito
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
