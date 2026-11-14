import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export interface WearPoint {
  date: string;
  wearNumber: number;
  costPerWear: number;
}

export interface CostPerWearChartProps {
  price: number;
  points: WearPoint[];
  className?: string;
}

export const CostPerWearChart: React.FC<CostPerWearChartProps> = ({
  price,
  points,
  className = '',
}) => {
  const { formatPrice } = useApp();
  const [activePoint, setActivePoint] = useState<WearPoint | null>(null);

  if (!points || points.length === 0) {
    return (
      <div className={`card-base p-6 text-center text-ink-muted text-xs ${className}`}>
        No wear history yet. Log your first wear to see cost drop!
      </div>
    );
  }

  // Prepend wear 0 at original price for reference if needed
  const chartData: WearPoint[] = [
    { date: 'Initial purchase', wearNumber: 0, costPerWear: price },
    ...points,
  ];

  const maxVal = price;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const width = 360;
  const height = 160;
  const paddingX = 24;
  const paddingTop = 20;
  const paddingBottom = 28;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (chartData.length <= 1) return paddingX + usableWidth / 2;
    return paddingX + (index / (chartData.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const norm = (val - minVal) / range;
    return paddingTop + (1 - norm) * usableHeight;
  };

  // Build SVG path
  const pathD = chartData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.costPerWear).toFixed(1)}`)
    .join(' ');

  // Gradient area path
  const areaD = `${pathD} L ${getX(chartData.length - 1).toFixed(1)} ${getY(0).toFixed(
    1
  )} L ${getX(0).toFixed(1)} ${getY(0).toFixed(1)} Z`;

  const originalPriceY = getY(price);

  return (
    <div className={`card-base p-4 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-ink">
          Cost Per Wear Over Time
        </span>
        <span className="text-xs text-ink-muted font-medium tabular-nums">
          Target drop: {formatPrice(points[points.length - 1].costPerWear)}
        </span>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="cpwGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Baseline grid */}
          <line
            x1={paddingX}
            y1={getY(0)}
            x2={width - paddingX}
            y2={getY(0)}
            stroke="var(--border)"
            strokeWidth="1"
          />

          {/* Dashed original price reference line at the top */}
          <line
            x1={paddingX}
            y1={originalPriceY}
            x2={width - paddingX}
            y2={originalPriceY}
            stroke="var(--ink-muted)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x={paddingX + 4}
            y={originalPriceY - 4}
            fill="var(--ink-muted)"
            fontSize="9"
            fontWeight="500"
          >
            Original {formatPrice(price)}
          </text>

          {/* Area fill */}
          <path d={areaD} fill="url(#cpwGradient)" />

          {/* Smooth line */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {chartData.map((p, i) => {
            if (i === 0) return null; // skip origin point circle for cleaner look
            const cx = getX(i);
            const cy = getY(p.costPerWear);
            const isHovered = activePoint?.wearNumber === p.wearNumber;

            return (
              <g
                key={i}
                onMouseEnter={() => setActivePoint(p)}
                onClick={() => setActivePoint(p)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5.5 : 3.5}
                  fill="var(--surface)"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activePoint && (
          <div className="absolute top-2 right-2 bg-surface/95 border border-border shadow-sm rounded-lg px-2.5 py-1 text-xs text-ink tabular-nums pointer-events-none">
            <span className="font-semibold text-primary">
              {formatPrice(activePoint.costPerWear)}
            </span>{' '}
            after {activePoint.wearNumber} wear{activePoint.wearNumber > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Accessible Table alternative for screen readers */}
      <div className="sr-only">
        <table>
          <caption>Cost per wear progression</caption>
          <thead>
            <tr>
              <th>Wear Number</th>
              <th>Date</th>
              <th>Cost per Wear</th>
            </tr>
          </thead>
          <tbody>
            {points.map((pt) => (
              <tr key={pt.wearNumber}>
                <td>{pt.wearNumber}</td>
                <td>{pt.date}</td>
                <td>{formatPrice(pt.costPerWear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
