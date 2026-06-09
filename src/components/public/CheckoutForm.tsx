import { FormEvent, useMemo, useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/format';
import type { CheckoutCustomer } from '../../types';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

type Props = {
  isSubmitting: boolean;
  onSubmit: (customer: CheckoutCustomer) => Promise<void>;
  variant?: 'page' | 'drawer';
  formId?: string;
  submitLabel?: string;
  hideSubmit?: boolean;
};

const initialForm: CheckoutCustomer = {
  customerName: '',
  customerPhone: '',
  notes: '',
  pickupTime: '',
  acceptsPickup: true,
};

const steps = [
  { n: 1, label: 'Confirmas',   desc: 'Nombre y tel.' },
  { n: 2, label: 'Preparamos', desc: 'Al instante.' },
  { n: 3, label: 'Te avisamos', desc: 'Por WhatsApp.' },
  { n: 4, label: 'Retiras',    desc: 'Cuando quieras.' },
];

export function CheckoutForm({
  isSubmitting,
  onSubmit,
  variant = 'page',
  formId,
  submitLabel = 'Confirmar pedido',
  hideSubmit = false,
}: Props) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isDrawer = variant === 'drawer';
  const lines = useCartStore((state) => state.lines);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [lines]);

  function update<K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.customerName.trim()) nextErrors.customerName = 'Necesitamos tu nombre.';
    if (!form.customerPhone.trim()) nextErrors.customerPhone = 'Ingresa un WhatsApp de contacto.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSubmit({ ...form, acceptsPickup: true });
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={
        isDrawer
          ? 'grid gap-3 rounded-lg border border-cream/10 bg-black/22 p-3'
          : 'flex h-full flex-col gap-4 rounded-lg border border-flame/14 bg-coal p-4 sm:p-5'
      }
    >
      {/* Banner retiro — compacto: solo icono + label en línea */}
      <div className="flex items-center gap-2.5 rounded-md border border-flame/18 bg-flame/10 px-3 py-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-flame text-ink">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-black text-flame">Retiro en local</span>
      </div>

      {/* Campos */}
      <div className={`grid gap-3 ${isDrawer ? '' : 'sm:grid-cols-2'}`}>
        <Input
          label="Nombre"
          value={form.customerName}
          onChange={(event) => update('customerName', event.target.value)}
          placeholder="Ej: Camila"
          error={errors.customerName}
        />
        <Input
          label="Teléfono / WhatsApp"
          value={form.customerPhone}
          onChange={(event) => update('customerPhone', event.target.value)}
          placeholder="Ej: +56 9 1234 5678"
          error={errors.customerPhone}
        />
      </div>

      <Textarea
        label="Observaciones (opcional)"
        value={form.notes}
        onChange={(event) => update('notes', event.target.value)}
        placeholder="Ej: sin mayo, cortar en dos, retirar a nombre de..."
        className={isDrawer ? 'min-h-[72px]' : 'min-h-[64px]'}
      />

      {/* Pasos — flujo horizontal 1→2→3→4 — solo en página */}
      {!isDrawer && (
        <div className="rounded-xl border border-white/8 bg-[#1a2433] p-3">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-white/35">¿Qué pasa después?</p>
          <div className="flex items-center">
            {steps.map((step, i) => (
              <>
                {/* Card de paso */}
                <div
                  key={step.n}
                  className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-2 text-center"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C69635] text-[9px] font-black text-[#07111A]">
                    {step.n}
                  </span>
                  <span className="text-[10px] font-bold leading-tight text-white">{step.label}</span>
                  <span className="text-[9px] leading-tight text-white/45">{step.desc}</span>
                </div>

                {/* Flecha conectora (excepto después del último) */}
                {i < steps.length - 1 && (
                  <ChevronRight key={`arrow-${i}`} className="mx-0.5 h-3.5 w-3.5 shrink-0 text-[#C69635]" />
                )}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Footer del formulario: Total y botón */}
      {!isDrawer ? (
        <div className="mt-auto pt-2 flex flex-col gap-4">
          <div className="border-t border-cream/10 pt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-cream/62">Total estimado</span>
            <strong className="text-2xl text-flame">{formatCurrency(subtotal)}</strong>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-flame to-mustard px-5 py-1.5 shadow-glow">
              <span className="font-display text-sm font-black tracking-wide text-ink">Rikki-Tikki</span>
            </div>
          </div>

          {!hideSubmit ? (
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Confirmando pedido...' : submitLabel}
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          {!hideSubmit ? (
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Confirmando pedido...' : submitLabel}
            </Button>
          ) : null}
        </>
      )}
    </form>
  );
}
