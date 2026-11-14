import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatTile } from '../components/shared/StatTile';
import { WeeklyWearsChart, WeekData } from '../components/shared/WeeklyWearsChart';
import { BadgeTile } from '../components/shared/BadgeTile';
import { BADGE_DEFINITIONS } from '../lib/badges';
import { ArrowRight, Award, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { getDateOffset } from '../lib/seed';

export interface StatsScreenProps {
  onNavigate: (route: string, garmentId?: string) => void;
}

type RangeOption = '30d' | '90d' | 'all';

export const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const {
    garments,
    wears,
    streak,
    badges,
    formatPrice,
    getStatsForGarment,
  } = useApp();

  const [range, setRange] = useState<RangeOption>('all');

  // Filter wears by selected range
  const filteredWears = useMemo(() => {
    if (range === 'all') return wears;
    const days = range === '30d' ? 30 : 90;
    const cutoffDate = getDateOffset(days);
    return wears.filter((w) => w.worn_on >= cutoffDate);
  }, [wears, range]);

  // Derived metrics
  const totalWears = filteredWears.length;
  const activeGarments = garments.filter((g) => g.status === 'active');

  // Average cost per wear across wardrobe
  const totalInvested = activeGarments.reduce((sum, g) => sum + g.price, 0);
  const totalWardrobeWears = activeGarments.reduce(
    (sum, g) => sum + getStatsForGarment(g.id).wear_count,
    0
  );
  const avgCostPerWear =
    totalWardrobeWears > 0
      ? Math.round((totalInvested / totalWardrobeWears) * 100) / 100
      : totalInvested > 0
      ? totalInvested
      : 0;

  // Chart 2: Wears per week for past 6 weeks
  const weeklyData: WeekData[] = useMemo(() => {
    const weeks: WeekData[] = [];
    for (let w = 5; w >= 0; w--) {
      const startDaysAgo = (w + 1) * 7;
      const endDaysAgo = w * 7;
      const startDate = getDateOffset(startDaysAgo);
      const endDate = getDateOffset(endDaysAgo);

      const count = wears.filter(
        (log) => log.worn_on > startDate && log.worn_on <= endDate
      ).length;

      const label = w === 0 ? 'This wk' : `W-${w}`;
      weeks.push({
        weekLabel: label,
        wearsCount: count,
      });
    }
    return weeks;
  }, [wears]);

  // Chart 3: "Worth their price" top 5 by lowest cost per wear (must have at least 1 wear)
  const wornPieces = activeGarments
    .map((g) => ({
      garment: g,
      stats: getStatsForGarment(g.id),
    }))
    .filter((item) => item.stats.wear_count > 0)
    .sort((a, b) => a.stats.cost_per_wear - b.stats.cost_per_wear);

  const top5Valued = wornPieces.slice(0, 5);

  // "Needs more love" 3 least-worn garments
  const leastWorn3 = [...activeGarments]
    .map((g) => ({
      garment: g,
      stats: getStatsForGarment(g.id),
    }))
    .sort((a, b) => a.stats.wear_count - b.stats.wear_count)
    .slice(0, 3);

  // User badge map
  const badgeMap = useMemo(() => {
    const map = new Map<string, typeof badges[0]>();
    badges.forEach((b) => map.set(b.badge_key, b));
    return map;
  }, [badges]);

  return (
    <div className="flex flex-col gap-5 pb-20 text-left">
      {/* Range toggle bar */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">
          Wardrobe Analytics
        </h2>
        <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-border">
          <button
            type="button"
            onClick={() => setRange('30d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              range === '30d'
                ? 'bg-surface text-ink font-semibold shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setRange('90d')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              range === '90d'
                ? 'bg-surface text-ink font-semibold shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            90 Days
          </button>
          <button
            type="button"
            onClick={() => setRange('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              range === 'all'
                ? 'bg-surface text-ink font-semibold shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Total wears logged"
          value={totalWears}
          hint={range === 'all' ? 'Lifetime wear count' : `In last ${range}`}
        />
        <StatTile
          label="Current streak"
          value={`${streak.current_streak} days`}
          hint={`Best: ${streak.longest_streak} days`}
          isAccent
        />
        <StatTile
          label="Longest streak"
          value={`${streak.longest_streak} days`}
          hint="Consistent habit"
        />
        <StatTile
          label="Average cost / wear"
          value={formatPrice(avgCostPerWear)}
          hint="Across active closet"
        />
      </div>

      {/* Chart 2: Wears per week */}
      <WeeklyWearsChart data={weeklyData} />

      {/* Chart 3: "Worth their price" ranking (Top 5) */}
      <div className="card-base p-5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-display text-base font-semibold text-ink">
              Worth Their Price
            </h3>
          </div>
          <span className="text-xs text-ink-muted">Lowest Cost Per Wear</span>
        </div>

        {top5Valued.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {top5Valued.map(({ garment, stats }, idx) => (
              <div
                key={garment.id}
                onClick={() => onNavigate('detail', garment.id)}
                className="flex items-center justify-between p-2 rounded-[14px] hover:bg-surface-2 cursor-pointer transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-ink-muted w-4">
                    #{idx + 1}
                  </span>
                  <div className="w-9 h-11 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                    <img
                      src={garment.photo_path}
                      alt={garment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-ink truncate max-w-[160px] sm:max-w-xs">
                      {garment.name}
                    </h4>
                    <span className="text-[11px] text-ink-muted">
                      Worn {stats.wear_count} times
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display text-sm font-bold text-primary tabular-nums">
                    {formatPrice(stats.cost_per_wear)}
                  </span>
                  <span className="text-[10px] text-ink-muted block">/wear</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-muted py-2">
            No items worn yet in this timeframe.
          </p>
        )}
      </div>

      {/* "Needs more love" (3 least-worn) */}
      <div className="card-base p-5 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-ink">
              Needs More Love
            </h3>
          </div>
          <span className="text-xs text-ink-muted">Least Worn Pieces</span>
        </div>

        <div className="flex flex-col gap-2">
          {leastWorn3.map(({ garment, stats }) => (
            <div
              key={garment.id}
              onClick={() => onNavigate('detail', garment.id)}
              className="flex items-center justify-between p-2 rounded-[14px] hover:bg-surface-2 cursor-pointer transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-11 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                  <img
                    src={garment.photo_path}
                    alt={garment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-ink truncate">
                    {garment.name}
                  </h4>
                  <span className="text-[11px] text-ink-muted">
                    {stats.wear_count === 0 ? 'Not worn yet' : `Worn only ${stats.wear_count}x`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary text-xs font-medium shrink-0">
                <span>Wear this next</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid (3 columns) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            <h3 className="font-display text-base font-semibold text-ink">
              Wardrobe Badges
            </h3>
          </div>
          <span className="text-xs font-medium text-ink-muted tabular-nums">
            {badges.length} of {BADGE_DEFINITIONS.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {BADGE_DEFINITIONS.map((badgeDef) => (
            <BadgeTile
              key={badgeDef.key}
              definition={badgeDef}
              userBadge={badgeMap.get(badgeDef.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
