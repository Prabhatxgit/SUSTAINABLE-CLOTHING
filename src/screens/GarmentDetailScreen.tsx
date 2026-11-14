import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatTile } from '../components/shared/StatTile';
import { WearButton } from '../components/shared/WearButton';
import { Button } from '../components/shared/Button';
import { CostPerWearChart, WearPoint } from '../components/shared/CostPerWearChart';
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  Share2,
  Calendar,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import { getDateOffset, getTodayDateString } from '../lib/seed';

export interface GarmentDetailScreenProps {
  garmentId: string;
  onBack: () => void;
  onNavigate: (route: string, garmentId?: string) => void;
}

export const GarmentDetailScreen: React.FC<GarmentDetailScreenProps> = ({
  garmentId,
  onBack,
  onNavigate,
}) => {
  const {
    getGarmentById,
    getStatsForGarment,
    formatPrice,
    removeGarment,
    wears,
    todayLoggedGarmentIds,
    undoOutfitWear,
    recentCostPerWearChangeGarmentId,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const garment = getGarmentById(garmentId);

  if (!garment) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-ink-muted mb-4">Garment not found.</p>
        <Button variant="secondary" onClick={onBack}>
          Return to Closet
        </Button>
      </div>
    );
  }

  const stats = getStatsForGarment(garment.id);
  const isLoggedToday = todayLoggedGarmentIds.includes(garment.id);

  // Collect wear logs for this garment
  const garmentWears = wears
    .filter((w) => w.garment_id === garment.id)
    .sort((a, b) => (a.worn_on > b.worn_on ? 1 : -1));

  // Build progression points for CostPerWearChart
  const wearPoints: WearPoint[] = garmentWears.map((w, index) => {
    const wearCount = index + 1;
    const cpw = Math.round((garment.price / wearCount) * 100) / 100;
    return {
      date: w.worn_on,
      wearNumber: wearCount,
      costPerWear: cpw,
    };
  });

  // Milestone callout determination
  let milestoneText = '';
  const coffeePrice = 150; // INR coffee or equivalent
  if (stats.wear_count === 0) {
    milestoneText = 'Wear it once to cut your initial cost in half!';
  } else if (stats.cost_per_wear < coffeePrice) {
    milestoneText = 'Now cheaper than a daily cup of artisanal coffee per wear.';
  } else if (stats.wear_count >= 10) {
    milestoneText = 'A true staple: you’ve worn this over 10 times!';
  } else {
    const wearsToHalf = Math.max(1, 2 - stats.wear_count);
    milestoneText = `${wearsToHalf} more wear${wearsToHalf > 1 ? 's' : ''} to reach next value milestone.`;
  }

  // Mini calendar (last 8 weeks = 56 days)
  const calendarDays: { date: string; worn: boolean }[] = [];
  const wearDateSet = new Set(garmentWears.map((w) => w.worn_on));

  for (let i = 55; i >= 0; i--) {
    const dateStr = getDateOffset(i);
    calendarDays.push({
      date: dateStr,
      worn: wearDateSet.has(dateStr),
    });
  }

  const handleDelete = () => {
    removeGarment(garment.id);
    onBack();
  };

  return (
    <div className="flex flex-col gap-5 pb-20 text-left">
      {/* Top Header bar with Back & Overflow Menu */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to wardrobe"
          className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Closet</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Garment options"
            className="p-2 rounded-full hover:bg-surface-2 text-ink-muted transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-48 rounded-[16px] bg-surface border border-border shadow-lg p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete garment</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-xl border border-border text-center">
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              Delete this piece?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed mb-6">
              This will remove <strong>{garment.name}</strong> and all its wear logs from your records.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full-width / 4:5 Hero Photo */}
      <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[24px] overflow-hidden bg-surface-2 border border-border shadow-sm">
        <img
          src={garment.photo_path}
          alt={garment.name}
          className="w-full h-full object-cover"
        />

        {garment.status !== 'active' && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-ink/80 text-surface backdrop-blur-xs">
            {garment.status === 'donated' ? 'Donated' : 'For Sale (20%)'}
          </div>
        )}
      </div>

      {/* Title & Metadata */}
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">
          {garment.name}
        </h2>
        <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
          <span className="capitalize">{garment.category}</span>
          <span aria-hidden="true">·</span>
          <span>Original {formatPrice(garment.price)}</span>
          {garment.colour && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{garment.colour}</span>
            </>
          )}
        </div>
      </div>

      {/* Milestone Callout */}
      <div className="p-3.5 rounded-[16px] bg-surface-2 border border-border/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 stroke-[2]" />
        </div>
        <p className="text-xs font-medium text-ink leading-tight">
          {milestoneText}
        </p>
      </div>

      {/* Three Stat Tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile
          label="Cost / wear"
          value={
            stats.wear_count === 0
              ? formatPrice(garment.price)
              : formatPrice(stats.cost_per_wear)
          }
          isAccent={recentCostPerWearChangeGarmentId === garment.id}
          hint={stats.wear_count === 0 ? 'Not worn yet' : 'Calculated'}
        />
        <StatTile
          label="Times worn"
          value={`${stats.wear_count}x`}
          hint="Total logs"
        />
        <StatTile
          label="Last worn"
          value={stats.last_worn ? stats.last_worn.slice(5) : 'Never'}
          hint={stats.last_worn || 'No wears'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        {isLoggedToday ? (
          <div className="p-3 rounded-[14px] bg-success/15 border border-success/30 flex items-center justify-between text-success">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>You wore this today!</span>
            </div>
            <button
              type="button"
              onClick={() => undoOutfitWear(garment.id)}
              className="text-xs font-medium text-ink hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
          </div>
        ) : (
          <WearButton garmentIds={[garment.id]} />
        )}

        {garment.status === 'active' && (
          <Button
            variant="secondary"
            onClick={() => onNavigate('pass-it-on', garment.id)}
            className="w-full"
          >
            Pass it on (Donate or Resell)
          </Button>
        )}
      </div>

      {/* Cost Per Wear Line Chart */}
      <CostPerWearChart price={garment.price} points={wearPoints} />

      {/* Mini Wear Calendar (Last 8 Weeks) */}
      <div className="card-base p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-ink">
              Wear History (Last 8 Weeks)
            </span>
          </div>
          <span className="text-[11px] text-ink-muted">
            {garmentWears.length} recorded days
          </span>
        </div>

        {/* 8 columns of 7 days */}
        <div className="grid grid-cols-8 gap-1.5 pt-1">
          {calendarDays.map((cd) => (
            <div
              key={cd.date}
              title={`${cd.date}: ${cd.worn ? 'Worn' : 'Not worn'}`}
              className={`aspect-square rounded-sm transition-colors ${
                cd.worn
                  ? 'bg-primary shadow-xs'
                  : 'bg-surface-2 border border-border/40'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[10px] text-ink-muted">
          <span>8 weeks ago</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-surface-2 border border-border/40 rounded-xs" />
              Idle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-primary rounded-xs" />
              Worn
            </span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};
