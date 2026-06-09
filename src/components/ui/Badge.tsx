import type { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  tone?: 'yellow' | 'blue' | 'orange' | 'green' | 'neutral' | 'red';
  className?: string;
};

const tones = {
  yellow: 'bg-flame/15 text-flame ring-flame/25',
  blue: 'bg-sky-400/12 text-sky-200 ring-sky-300/20',
  orange: 'bg-orange-400/12 text-orange-200 ring-orange-300/20',
  green: 'bg-leaf/20 text-emerald-100 ring-emerald-300/20',
  neutral: 'bg-cream/10 text-cream/80 ring-cream/15',
  red: 'bg-ember/20 text-red-100 ring-red-300/25',
};

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-bold uppercase tracking-normal ring-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
