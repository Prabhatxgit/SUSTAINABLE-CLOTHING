import React, { useState } from 'react';
import { Garment, GarmentStats } from '../../types';
import { useApp } from '../../context/AppContext';
import { Sparkles, Shirt } from 'lucide-react';

export interface GarmentCardProps {
  garment: Garment;
  stats?: GarmentStats;
  onClick?: () => void;
  selected?: boolean;
  selectable?: boolean;
  onSelectToggle?: () => void;
  className?: string;
  isRecentChange?: boolean;
}

export const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  stats,
  onClick,
  selected = false,
  selectable = false,
  onSelectToggle,
  className = '',
  isRecentChange = false,
}) => {
  const { formatPrice, getStatsForGarment } = useApp();
  const [imgError, setImgError] = useState(false);

  const garmentStats = stats || getStatsForGarment(garment.id);
  const isNeverWorn = garmentStats.wear_count === 0;

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onSelectToggle) {
      e.stopPropagation();
      onSelectToggle();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group card-base overflow-hidden flex flex-col text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.99] hover:border-ink/20 ${
        selected ? 'ring-2 ring-primary border-primary' : ''
      } ${
        garment.status !== 'active' ? 'opacity-85' : ''
      } ${className}`}
    >
      {/* 4:5 Aspect Ratio Photo Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2 rounded-t-[19px]">
        {garment.photo_path && !imgError ? (
          <img
            src={garment.photo_path}
            alt={garment.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface-2 text-ink-muted">
            <Shirt className="w-10 h-10 mb-2 stroke-[1.5] text-primary/70" />
            <span className="text-xs font-medium text-center line-clamp-2">
              {garment.name}
            </span>
          </div>
        )}

        {/* Small accent dot if worn in last 7 days */}
        {garmentStats.worn_in_last_7_days && garment.status === 'active' && (
          <div
            title="Worn this week"
            className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-accent ring-2 ring-surface shadow-xs"
          />
        )}

        {/* Status banner for passed on items */}
        {garment.status !== 'active' && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-ink/80 text-surface backdrop-blur-xs">
            {garment.status === 'donated' ? 'Donated' : 'For Sale'}
          </div>
        )}

        {/* Selectable Checkbox Indicator */}
        {selectable && (
          <div
            className={`absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              selected
                ? 'bg-primary text-primary-ink shadow-md'
                : 'bg-surface/85 text-transparent border border-border backdrop-blur-xs'
            }`}
          >
            ✓
          </div>
        )}
      </div>

      {/* Details Box */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-semibold text-ink line-clamp-1 leading-snug">
            {garment.name}
          </h3>

          <div className="mt-1.5 flex items-baseline justify-between gap-1">
            {isNeverWorn ? (
              <span className="text-xs font-medium text-ink-muted">
                Not worn yet
              </span>
            ) : (
              <span
                className={`text-sm font-semibold tracking-tight transition-colors duration-500 tabular-nums ${
                  isRecentChange ? 'text-accent scale-105' : 'text-primary'
                }`}
              >
                {formatPrice(garmentStats.cost_per_wear)}
                <span className="text-xs font-normal text-ink-muted ml-0.5">/wear</span>
              </span>
            )}

            <span className="text-xs text-ink-muted tabular-nums">
              {isNeverWorn
                ? formatPrice(garment.price)
                : `Worn ${garmentStats.wear_count}x`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
