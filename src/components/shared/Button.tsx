import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-[14px]';

  const sizeClasses = {
    sm: 'text-xs h-9 px-3.5 gap-1.5 min-w-[70px]',
    md: 'text-sm h-11 px-5 gap-2 min-w-[90px]',
    lg: 'text-base h-13 px-6 gap-2.5 min-w-[120px]',
  };

  const variantClasses = {
    primary:
      'bg-primary text-primary-ink hover:opacity-95 shadow-sm active:bg-primary/90',
    secondary:
      'bg-surface-2 text-ink hover:bg-surface-2/80 border border-border/60 active:bg-surface-2/70',
    ghost:
      'bg-transparent text-ink hover:bg-surface-2 active:bg-surface-2/60',
    danger:
      'bg-danger text-white hover:opacity-95 shadow-sm active:bg-danger/90',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span className="opacity-80">Please wait...</span>
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
