import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
};

function hasRenderableImage(src?: string) {
  const value = src?.trim();
  return Boolean(value) && !value?.includes('images.unsplash.com') && !value?.endsWith('/images/rikki-hero.jpg');
}

export function ProductImageFrame({ src, alt, className = '', imageClassName = '', children }: Props) {
  const [failed, setFailed] = useState(false);
  const shouldShowImage = hasRenderableImage(src) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-cream/12 bg-[linear-gradient(135deg,rgba(255,212,71,.08),rgba(255,248,232,.02)_42%,rgba(45,212,191,.08))] ${className}`}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imageClassName}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-2 rounded-[5px] border border-dashed border-cream/16" aria-hidden="true">
          <div className="absolute left-3 top-3 h-2 w-10 rounded-full bg-flame/22" />
          <div className="absolute bottom-3 right-3 h-2 w-16 rounded-full bg-cream/10" />
        </div>
      )}
      {children}
    </div>
  );
}
