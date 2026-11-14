import React from 'react';

export interface WeekData {
  weekLabel: string;
  wearsCount: number;
}

export interface WeeklyWearsChartProps {
  data: WeekData[];
  className?: string;
}

export const WeeklyWearsChart: React.FC<WeeklyWearsChartProps> = ({
  data,
  className = '',
}) => {
  const maxWears = Math.max(...data.map((d) => d.wearsCount), 1);

  return (
    <div className={`card-base p-4 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ink">
          Wears Per Week
        </span>
        <span className="text-xs text-ink-muted">Past 6 Weeks</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-32 pt-4 px-2">
        {data.map((item, idx) => {
          const heightPercent = Math.max((item.wearsCount / maxWears) * 100, 6);
          const isCurrentWeek = idx === data.length - 1;

          return (
            <div
              key={item.weekLabel}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
            >
              {/* Value label on hover or if high */}
              <span className="text-[10px] font-semibold text-ink-muted group-hover:text-primary tabular-nums">
                {item.wearsCount}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-surface-2 rounded-t-md overflow-hidden flex items-end h-full">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isCurrentWeek ? 'bg-primary' : 'bg-primary/75 group-hover:bg-primary'
                  }`}
                />
              </div>

              {/* Week Label */}
              <span className="text-[10px] text-ink-muted font-medium truncate max-w-[48px]">
                {item.weekLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
