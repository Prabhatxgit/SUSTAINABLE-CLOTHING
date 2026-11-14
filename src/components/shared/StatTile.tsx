import React from 'react';

export interface StatTileProps {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  className?: string;
  isAccent?: boolean;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  delta,
  hint,
  className = '',
  isAccent = false,
}) => {
  return (
    <div className={`card-base p-4 text-left flex flex-col justify-between ${className}`}>
      <span className="text-xs font-medium text-ink-muted tracking-tight">
        {label}
      </span>

      <div className="my-1.5 flex items-baseline gap-2">
        <span
          className={`font-display text-2xl md:text-3xl font-bold tracking-tight tabular-nums ${
            isAccent ? 'text-accent' : 'text-ink'
          }`}
        >
          {value}
        </span>
        {delta && (
          <span className="text-xs font-medium text-primary tabular-nums">
            {delta}
          </span>
        )}
      </div>

      {hint ? (
        <span className="text-[11px] text-ink-muted leading-tight">
          {hint}
        </span>
      ) : null}
    </div>
  );
};
