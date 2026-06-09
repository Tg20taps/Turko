import { cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: ReactNode;
  asChild?: boolean;
};

const variants = {
  primary: 'bg-flame text-ink shadow-glow hover:bg-mustard',
  secondary: 'bg-cream/10 text-cream ring-1 ring-cream/15 hover:bg-cream/18 hover:ring-flame/30',
  ghost: 'bg-transparent text-cream hover:bg-cream/10 hover:text-flame',
  danger: 'bg-ember text-cream hover:bg-red-700',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0',
};

export function Button({ className = '', variant = 'primary', size = 'md', icon, children, asChild, ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${className}`;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(child, {
      ...(props as Record<string, unknown>),
      className: `${classes} ${child.props.className ?? ''}`,
      children: (
        <>
          {icon}
          {child.props.children}
        </>
      ),
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
