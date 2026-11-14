import React from 'react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  count?: number;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  count,
  icon,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected
          ? 'bg-primary text-primary-ink shadow-sm'
          : 'bg-surface text-ink-muted border border-border hover:text-ink hover:border-ink/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
            selected
              ? 'bg-primary-ink/20 text-primary-ink'
              : 'bg-surface-2 text-ink-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
