import React from 'react';
import { Button } from './Button';
import { Shirt } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`card-base p-8 md:p-10 flex flex-col items-center text-center justify-center max-w-md mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-primary/70 mb-4">
        {icon || <Shirt className="w-8 h-8 stroke-[1.5]" />}
      </div>

      <h3 className="font-display text-xl font-semibold text-ink mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-ink-muted leading-relaxed mb-5 max-w-xs">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
