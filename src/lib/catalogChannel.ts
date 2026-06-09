import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

/**
 * Canal de comunicación para sincronizar cambios del catálogo
 * entre pestañas del mismo navegador (modo local) y en tiempo real
 * desde Supabase (modo producción).
 *
 * - Modo local:     BroadcastChannel entre pestañas del mismo origen
 * - Modo Supabase:  Realtime subscription en postgres_changes
 */

const EVENT_NAME = 'rikki:catalog-updated';

// BroadcastChannel para comunicación cross-tab en modo local
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel('rikki:catalog');
} catch {
  broadcastChannel = null;
}

/** Llámalo cada vez que el catálogo cambie localmente */
export function broadcastCatalogUpdate() {
  // Notifica en la misma pestaña
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  // Notifica en otras pestañas del mismo origen
  broadcastChannel?.postMessage('updated');
}

type Unsubscribe = () => void;

/**
 * Suscribe un callback a cambios del catálogo.
 * - En modo local: escucha CustomEvent + BroadcastChannel + evento storage
 * - En modo Supabase: escucha realtime postgres_changes en tablas products y categories
 *
 * @returns función para cancelar la suscripción
 */
export function subscribeCatalogUpdates(callback: () => void): Unsubscribe {
  // ── Modo Supabase: realtime ────────────────────────────────────────────────
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel('catalog-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, callback)
      .subscribe();

    return () => { supabase?.removeChannel(channel); };
  }

  // ── Modo local: eventos DOM + BroadcastChannel + storage ──────────────────
  window.addEventListener(EVENT_NAME, callback);

  function handleBroadcast() { callback(); }
  if (broadcastChannel) broadcastChannel.addEventListener('message', handleBroadcast);

  function handleStorage(e: StorageEvent) {
    if (e.key === 'rikki-tikki-products' || e.key === 'rikki-tikki-categories') {
      callback();
    }
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', handleStorage);
    if (broadcastChannel) broadcastChannel.removeEventListener('message', handleBroadcast);
  };
}
