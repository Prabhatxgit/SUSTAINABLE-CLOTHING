import React, { useState } from 'react';
import { BadgeDefinition, UserBadge } from '../../types';
import {
  Sparkles,
  Flame,
  Zap,
  Repeat,
  Coffee,
  Shirt,
  HeartHandshake,
  Lock,
} from 'lucide-react';

export interface BadgeTileProps {
  definition: BadgeDefinition;
  userBadge?: UserBadge;
  className?: string;
}

export const BadgeTile: React.FC<BadgeTileProps> = ({
  definition,
  userBadge,
  className = '',
}) => {
  const [showHint, setShowHint] = useState(false);
  const isEarned = Boolean(userBadge);

  const renderIcon = () => {
    const iconProps = { className: 'w-7 h-7 stroke-[1.75]' };
    switch (definition.icon) {
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      case 'Repeat':
        return <Repeat {...iconProps} />;
      case 'Coffee':
        return <Coffee {...iconProps} />;
      case 'Shirt':
        return <Shirt {...iconProps} />;
      case 'HeartHandshake':
        return <HeartHandshake {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={() => setShowHint(!showHint)}
      className={`card-base p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-200 select-none relative active:scale-98 ${
        isEarned
          ? 'bg-surface border-border hover:border-accent/40'
          : 'bg-surface/50 border-dashed border-border/80 opacity-70 grayscale hover:opacity-90 hover:grayscale-70'
      } ${className}`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-2.5 transition-transform duration-200 ${
          isEarned
            ? 'bg-accent/15 text-accent shadow-xs'
            : 'bg-surface-2 text-ink-muted'
        }`}
      >
        {isEarned ? renderIcon() : <Lock className="w-5 h-5 text-ink-muted" />}
      </div>

      <span className="text-xs font-semibold text-ink leading-tight line-clamp-1">
        {definition.name}
      </span>

      {isEarned ? (
        <span className="text-[10px] text-ink-muted mt-1 tabular-nums font-medium">
          Earned {userBadge ? formatDate(userBadge.earned_at) : 'recently'}
        </span>
      ) : (
        <span className="text-[10px] text-ink-muted mt-1 line-clamp-1">
          {definition.rule}
        </span>
      )}

      {/* Popover hint on tap */}
      {showHint && (
        <div className="absolute inset-0 z-20 bg-surface/95 backdrop-blur-xs rounded-[20px] p-3 flex flex-col justify-center items-center text-center text-xs animate-in fade-in zoom-in-95 duration-150 border border-border shadow-md">
          <p className="font-semibold text-ink text-[11px] mb-1">{definition.name}</p>
          <p className="text-[10px] text-ink-muted leading-tight mb-2">
            {definition.description}
          </p>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-accent">
            {isEarned ? 'Unlocked' : `Goal: ${definition.rule}`}
          </span>
        </div>
      )}
    </div>
  );
};
