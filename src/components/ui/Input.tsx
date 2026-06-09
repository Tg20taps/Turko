import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-cream">
      {label}
      <input
        className={`h-12 rounded-md border border-flame/14 bg-ink/75 px-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-flame focus:ring-2 focus:ring-flame/25 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-200">{error}</span> : null}
    </label>
  );
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-cream">
      {label}
      <textarea
        className={`min-h-28 rounded-md border border-flame/14 bg-ink/75 px-3 py-3 text-base text-cream outline-none transition placeholder:text-cream/35 focus:border-flame focus:ring-2 focus:ring-flame/25 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-medium text-red-200">{error}</span> : null}
    </label>
  );
}
