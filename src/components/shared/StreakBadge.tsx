import React from 'react';
import { Flame } from 'lucide-react';
import { StreakInfo } from '../../types';

export interface StreakBadgeProps {
  streak: StreakInfo;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, className = '' }) => {
  return (
    <div className={`card-base p-6 flex flex-col items-center text-center ${className}`}>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 text-accent mb-2">
        <Flame className="w-8 h-8 fill-accent stroke-accent" />
      </div>

      <div className="flex items-baseline justify-center gap-2">
        <span className="font-display text-5xl md:text-6xl font-bold tracking-tight text-ink tabular-nums">
          {streak.current_streak}
        </span>
        <span className="text-sm font-medium text-ink-muted">day streak</span>
      </div>

      <p className="text-xs text-ink-muted mt-1">
        Personal best: <span className="font-medium text-ink tabular-nums">{streak.longest_streak} days</span>
      </p>

      {/* 7-day dot trail */}
      <div className="mt-5 pt-4 border-t border-border/70 w-full flex items-center justify-between px-2">
        {streak.last7Days.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <div
              title={`${day.date}: ${day.logged ? 'Logged' : 'Missed'}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-200 ${
                day.logged
                  ? 'bg-accent text-white shadow-xs scale-105'
                  : 'bg-surface-2 text-ink-muted border border-border/50'
              }`}
            >
              {day.logged ? '✓' : ''}
            </div>
            <span className="text-[11px] text-ink-muted font-medium">
              {day.dayLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
