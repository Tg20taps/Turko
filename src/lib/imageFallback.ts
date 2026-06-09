import type { SyntheticEvent } from 'react';

export function useBrandImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.src.endsWith('/images/rikki-hero.jpg')) return;
  image.src = '/images/rikki-hero.jpg';
  image.style.objectFit = 'cover';
  image.style.padding = '0';
  image.style.background = '#050505';
}
