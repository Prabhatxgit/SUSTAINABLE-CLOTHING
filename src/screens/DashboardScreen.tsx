import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StreakBadge } from '../components/shared/StreakBadge';
import { WearButton } from '../components/shared/WearButton';
import { EmptyState } from '../components/shared/EmptyState';
import { BADGE_DEFINITIONS } from '../lib/badges';
import { Check, Sparkles, TrendingDown, ArrowRight, RotateCcw } from 'lucide-react';
import { Garment } from '../types';

export interface DashboardScreenProps {
  onNavigate: (route: string, garmentId?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const {
    user,
    garments,
    streak,
    todayLoggedGarmentIds,
    getStatsForGarment,
    formatPrice,
    undoOutfitWear,
    badges,
  } = useApp();

  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);

  // Greeting helper
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const activeGarments = garments.filter((g) => g.status === 'active');

  // If no garments added
  if (activeGarments.length === 0) {
    return (
      <div className="py-8">
        <EmptyState
          title="Your wardrobe is empty"
          description="Wear More starts with cataloguing what you already own. Add your first piece to begin dropping cost per wear."
          actionLabel="Add your first garment"
          onAction={() => onNavigate('add')}
        />
      </div>
    );
  }

  // Sort garments for "What did you wear today?" (recent & most-worn first)
  const sortedGarments = [...activeGarments].sort((a, b) => {
    const statsA = getStatsForGarment(a.id);
    const statsB = getStatsForGarment(b.id);
    return statsB.wear_count - statsA.wear_count;
  });

  // Toggle selection for logging
  const toggleSelectGarment = (id: string) => {
    if (todayLoggedGarmentIds.includes(id)) {
      // already logged today - offers undo
      return;
    }
    setSelectedGarmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Best value garment
  const garmentsWithStats = activeGarments.map((g) => ({
    garment: g,
    stats: getStatsForGarment(g.id),
  }));
  const wornGarments = garmentsWithStats.filter((item) => item.stats.wear_count > 0);
  const bestValueItem =
    wornGarments.length > 0
      ? wornGarments.reduce((prev, curr) =>
          curr.stats.cost_per_wear < prev.stats.cost_per_wear ? curr : prev
        )
      : garmentsWithStats[0];

  // Next badge progress calculation
  const earnedKeys = new Set(badges.map((b) => b.badge_key));
  let nextBadgeText = '';
  let nextBadgeProgress = 100;
  let nextBadgeTarget = '';

  if (!earnedKeys.has('first_wear')) {
    nextBadgeText = 'Log 1 wear to unlock First Wear';
    nextBadgeProgress = 0;
    nextBadgeTarget = 'First Wear';
  } else if (!earnedKeys.has('streak_7')) {
    const remaining = Math.max(0, 7 - streak.current_streak);
    nextBadgeText = `${remaining} more day${remaining > 1 ? 's' : ''} to Seven-Day Streak`;
    nextBadgeProgress = Math.min(100, Math.round((streak.current_streak / 7) * 100));
    nextBadgeTarget = 'Seven-Day Streak';
  } else if (!earnedKeys.has('wears_10')) {
    const maxWearOnAny = Math.max(
      ...activeGarments.map((g) => getStatsForGarment(g.id).wear_count),
      0
    );
    const remaining = Math.max(0, 10 - maxWearOnAny);
    nextBadgeText = `${remaining} more wear${remaining > 1 ? 's' : ''} on your top piece to Ten Times Over`;
    nextBadgeProgress = Math.min(100, Math.round((maxWearOnAny / 10) * 100));
    nextBadgeTarget = 'Ten Times Over';
  } else if (!earnedKeys.has('streak_30')) {
    const remaining = Math.max(0, 30 - streak.current_streak);
    nextBadgeText = `${remaining} more days to Thirty-Day Streak`;
    nextBadgeProgress = Math.min(100, Math.round((streak.current_streak / 30) * 100));
    nextBadgeTarget = 'Thirty-Day Streak';
  } else {
    nextBadgeText = 'All pilot badges unlocked! Great conscious wardrobe!';
    nextBadgeProgress = 100;
    nextBadgeTarget = 'Wardrobe Master';
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* 1. Greeting row */}
      <div className="flex flex-col text-left">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink">
          {greeting}, {user.display_name}
        </h2>
        <span className="text-xs text-ink-muted mt-0.5">{todayFormatted}</span>
      </div>

      {/* 2. Streak card */}
      <StreakBadge streak={streak} />

      {/* 3. "What did you wear today?" card */}
      <div className="card-base p-5 flex flex-col text-left">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              What did you wear today?
            </h3>
            <p className="text-xs text-ink-muted">
              Tap to pick garments, then confirm below.
            </p>
          </div>
          {todayLoggedGarmentIds.length > 0 && (
            <span className="text-xs font-medium text-primary bg-surface-2 px-2.5 py-1 rounded-full">
              {todayLoggedGarmentIds.length} logged today
            </span>
          )}
        </div>

        {/* Horizontal scroller of 80px thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {sortedGarments.map((g) => {
            const isLoggedToday = todayLoggedGarmentIds.includes(g.id);
            const isSelected = selectedGarmentIds.includes(g.id);

            return (
              <div
                key={g.id}
                onClick={() => toggleSelectGarment(g.id)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                <div
                  className={`relative w-20 h-20 rounded-[16px] overflow-hidden bg-surface-2 transition-all duration-200 ${
                    isLoggedToday
                      ? 'ring-2 ring-success border-success opacity-90'
                      : isSelected
                      ? 'ring-2 ring-primary border-primary scale-103'
                      : 'border border-border group-hover:border-ink/20'
                  }`}
                >
                  <img
                    src={g.photo_path}
                    alt={g.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Logged today indicator */}
                  {isLoggedToday && (
                    <div className="absolute inset-0 bg-success/25 backdrop-blur-[0.5px] flex items-center justify-center text-white">
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}

                  {/* Selected indicator */}
                  {isSelected && !isLoggedToday && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary text-primary-ink flex items-center justify-center text-xs shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-medium text-ink mt-1.5 max-w-[80px] truncate text-center">
                  {g.name}
                </span>

                {isLoggedToday && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      undoOutfitWear(g.id);
                    }}
                    className="text-[10px] text-accent hover:underline flex items-center gap-0.5 mt-0.5"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Undo
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <WearButton
            garmentIds={selectedGarmentIds}
            onLogged={() => setSelectedGarmentIds([])}
          />
        </div>
      </div>

      {/* 4. Cost-per-wear highlight: "Your best value" card */}
      {bestValueItem && (
        <div
          onClick={() => onNavigate('detail', bestValueItem.garment.id)}
          className="card-base p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-ink/20 transition active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-20 rounded-[14px] overflow-hidden bg-surface-2 shrink-0">
              <img
                src={bestValueItem.garment.photo_path}
                alt={bestValueItem.garment.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold tracking-wider text-accent uppercase flex items-center gap-1 mb-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                Your Best Value
              </span>
              <h4 className="text-sm font-semibold text-ink truncate">
                {bestValueItem.garment.name}
              </h4>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display text-lg font-bold text-primary tabular-nums">
                  {formatPrice(bestValueItem.stats.cost_per_wear)}
                </span>
                <span className="text-xs text-ink-muted">per wear</span>
                <span className="text-xs text-ink-muted">·</span>
                <span className="text-xs text-ink-muted tabular-nums">
                  {bestValueItem.stats.wear_count} wears
                </span>
              </div>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-ink-muted group-hover:text-ink shrink-0 transition">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* 5. Next badge progress */}
      <div
        onClick={() => onNavigate('stats')}
        className="card-base p-4 flex flex-col text-left cursor-pointer hover:border-ink/20 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-ink">
              Next Milestone: {nextBadgeTarget}
            </span>
          </div>
          <span className="text-xs font-medium text-ink-muted tabular-nums">
            {nextBadgeProgress}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            style={{ width: `${nextBadgeProgress}%` }}
            className="h-full bg-accent rounded-full transition-all duration-500"
          />
        </div>

        <p className="text-[11px] text-ink-muted mt-2">
          {nextBadgeText}
        </p>
      </div>
    </div>
  );
};
