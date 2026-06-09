import { useEffect, useRef } from 'react';
import { subscribeCatalogUpdates } from '../lib/catalogChannel';

/**
 * Hook que ejecuta `callback` cuando el catálogo de productos cambia.
 * Funciona tanto en modo local (BroadcastChannel) como con Supabase
 * (realtime postgres_changes) de forma automática y transparente.
 */
export function useCatalogUpdated(callback: () => void) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    // Usamos ref para que el listener no se remueva/agregue en cada render
    const unsubscribe = subscribeCatalogUpdates(() => cbRef.current());
    return unsubscribe;
  }, []);
}
