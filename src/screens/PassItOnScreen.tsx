import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PILOT_NGOS } from '../lib/badges';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { EmptyState } from '../components/shared/EmptyState';
import {
  HeartHandshake,
  Tag,
  CheckCircle2,
  Search,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Garment } from '../types';

export interface PassItOnScreenProps {
  initialGarmentId?: string;
  onBack: () => void;
  onNavigateToCloset: () => void;
}

export const PassItOnScreen: React.FC<PassItOnScreenProps> = ({
  initialGarmentId,
  onBack,
  onNavigateToCloset,
}) => {
  const {
    garments,
    getStatsForGarment,
    passOnGarment,
    formatPrice,
    formatCurrencySymbol,
  } = useApp();

  const activeGarments = garments.filter((g) => g.status === 'active');

  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialGarmentId ? 2 : 1);
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>(
    initialGarmentId || (activeGarments[0]?.id ?? '')
  );
  const [passType, setPassType] = useState<'donate' | 'sell'>('donate');
  const [selectedNgoId, setSelectedNgoId] = useState<string>(PILOT_NGOS[0].id);
  const [pickupNote, setPickupNote] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const selectedGarment = garments.find((g) => g.id === selectedGarmentId);
  const stats = selectedGarment ? getStatsForGarment(selectedGarment.id) : null;

  if (activeGarments.length === 0 && step !== 4) {
    return (
      <div className="py-12">
        <EmptyState
          title="No active garments to pass on"
          description="All pieces in your wardrobe are currently in circulation or already passed on."
          actionLabel="View Wardrobe"
          onAction={onNavigateToCloset}
        />
      </div>
    );
  }

  const handleConfirmPassOn = () => {
    if (!selectedGarmentId) return;
    setSubmitting(true);
    try {
      passOnGarment(selectedGarmentId, passType, selectedNgoId, pickupNote);
      setStep(4); // Thank you screen
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Thank-you Screen with lifetime stats
  if (step === 4 && selectedGarment && stats) {
    return (
      <div className="card-base p-8 max-w-md mx-auto text-center my-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9 stroke-[2]" />
        </div>

        <h2 className="font-display text-2xl font-bold text-ink mb-1">
          Thank you for closing the loop!
        </h2>
        <p className="text-xs text-ink-muted mb-6">
          Your garment is ready for its second life.
        </p>

        {/* Lifetime Stats Card */}
        <div className="w-full p-4 rounded-[18px] bg-surface-2 border border-border text-left mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-surface shrink-0">
              <img
                src={selectedGarment.photo_path}
                alt={selectedGarment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ink">
                {selectedGarment.name}
              </h4>
              <p className="text-xs text-ink-muted">
                {passType === 'donate'
                  ? `Donated to ${PILOT_NGOS.find((n) => n.id === selectedNgoId)?.name}`
                  : 'Listed for 20% resale'}
              </p>
            </div>
          </div>

          <div className="border-t border-border/80 pt-3 flex items-center justify-around text-center">
            <div>
              <span className="font-display text-xl font-bold text-ink tabular-nums block">
                {stats.wear_count}
              </span>
              <span className="text-[11px] text-ink-muted">Times worn</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="font-display text-xl font-bold text-primary tabular-nums block">
                {formatPrice(stats.cost_per_wear)}
              </span>
              <span className="text-[11px] text-ink-muted">Final cost / wear</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={onNavigateToCloset}
          className="w-full"
        >
          View in Passed On Closet
        </Button>
      </div>
    );
  }

  // Filtered garments for Step 1 picker
  const filteredGarments = activeGarments.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 pb-24 text-left">
      {/* Header with step counter */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (step > 1 && !initialGarmentId) setStep((prev) => (prev - 1) as any);
            else onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-medium text-ink-muted">
          Step {step} of 3
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-display text-2xl font-bold text-ink">
          {step === 1 && 'Pick a piece to pass on'}
          {step === 2 && 'How would you like to pass it on?'}
          {step === 3 && 'Review circulation summary'}
        </h2>
        <p className="text-xs text-ink-muted mt-1">
          {step === 1 && 'Choose an active garment that has finished its journey with you.'}
          {step === 2 && 'Donate for social impact or circulate via 20% student resale.'}
          {step === 3 && 'Finalize pickup details and confirm transfer.'}
        </p>
      </div>

      {/* STEP 1: Pick a garment */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 pr-4 rounded-[14px] bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredGarments.map((g) => {
              const gStats = getStatsForGarment(g.id);
              const isSelected = selectedGarmentId === g.id;

              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGarmentId(g.id)}
                  className={`card-base p-3 flex items-center gap-3 cursor-pointer transition select-none ${
                    isSelected
                      ? 'ring-2 ring-primary border-primary bg-surface-2/40'
                      : 'hover:border-ink/20'
                  }`}
                >
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-surface-2 shrink-0">
                    <img
                      src={g.photo_path}
                      alt={g.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-ink truncate">
                      {g.name}
                    </h4>
                    <p className="text-[11px] text-ink-muted">
                      Worn {gStats.wear_count}x · {formatPrice(gStats.cost_per_wear)}/wear
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isSelected
                        ? 'bg-primary text-primary-ink'
                        : 'border border-border'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            variant="primary"
            disabled={!selectedGarmentId}
            onClick={() => setStep(2)}
            className="w-full mt-3"
          >
            <span>Continue to Options</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* STEP 2: Choose Donate vs Sell at 20% */}
      {step === 2 && selectedGarment && (
        <div className="flex flex-col gap-4">
          {/* Garment summary banner */}
          <div className="p-3 rounded-[16px] bg-surface-2 border border-border flex items-center gap-3">
            <div className="w-10 h-12 rounded-lg overflow-hidden bg-surface shrink-0">
              <img
                src={selectedGarment.photo_path}
                alt={selectedGarment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-ink">
                {selectedGarment.name}
              </h4>
              <p className="text-[11px] text-ink-muted">
                Original price: {formatPrice(selectedGarment.price)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Option A: Donate to NGO */}
            <div
              onClick={() => setPassType('donate')}
              className={`card-base p-5 flex items-start gap-4 cursor-pointer transition select-none ${
                passType === 'donate'
                  ? 'ring-2 ring-primary border-primary bg-surface-2/30'
                  : 'hover:border-ink/20'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">
                    Donate to an NGO
                  </h4>
                  <span className="text-[10px] font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                    Social Impact
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Pass your piece directly to verified partner NGOs (Goonj, Clothes Box, Red Cross) for rural development and emergency relief.
                </p>
              </div>
            </div>

            {/* Option B: Sell at 20% */}
            <div
              onClick={() => setPassType('sell')}
              className={`card-base p-5 flex items-start gap-4 cursor-pointer transition select-none ${
                passType === 'sell'
                  ? 'ring-2 ring-primary border-primary bg-surface-2/30'
                  : 'hover:border-ink/20'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">
                    Sell at 20% Resale
                  </h4>
                  <span className="text-[10px] font-semibold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded-full">
                    Circular Economy
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  List for campus peer circulation at 20% of original price (
                  <strong className="text-ink">
                    {formatPrice(Math.round(selectedGarment.price * 0.2))}
                  </strong>
                  ). Earn store credit while funding partner logistics.
                </p>
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={() => setStep(3)} className="w-full mt-2">
            <span>Continue to Details</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* STEP 3: Summary & Confirmation */}
      {step === 3 && selectedGarment && (
        <div className="flex flex-col gap-4">
          {passType === 'donate' ? (
            /* Donate Flow */
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-ink-muted block mb-2">
                  Select Partner NGO
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {PILOT_NGOS.map((ngo) => (
                    <div
                      key={ngo.id}
                      onClick={() => setSelectedNgoId(ngo.id)}
                      className={`card-base p-3.5 flex items-start gap-3 cursor-pointer transition ${
                        selectedNgoId === ngo.id
                          ? 'ring-2 ring-primary border-primary bg-surface-2/30'
                          : 'hover:border-ink/20'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-ink">
                            {ngo.name}
                          </h4>
                          <span className="text-[10px] text-ink-muted">
                            {ngo.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          {ngo.tagline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Input
                label="Pickup / Drop Box Note"
                placeholder="e.g. Cleanly folded, leave at North Campus student center"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                hint="Your local student ambassador will collect from your chosen drop point."
              />
            </div>
          ) : (
            /* Sell at 20% Flow */
            <div className="flex flex-col gap-4">
              <div className="card-base p-5">
                <span className="text-xs font-semibold text-ink block mb-3">
                  Campus Resale Price Breakdown
                </span>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-ink-muted">Original Purchase:</span>
                  <span className="text-xs line-through text-ink-muted">
                    {formatPrice(selectedGarment.price)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between py-2 border-y border-border/80">
                  <span className="text-sm font-semibold text-ink">
                    Fixed 20% Resale Price:
                  </span>
                  <span className="font-display text-xl font-bold text-accent tabular-nums">
                    {formatPrice(Math.round(selectedGarment.price * 0.2))}
                  </span>
                </div>

                {/* Illustrative pitch split */}
                <div className="mt-4 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1.5">
                    <span className="font-medium text-ink">Illustrative Revenue Split:</span>
                    <span className="text-[10px] text-ink-muted/80">(Pilot model)</span>
                  </div>
                  <div className="p-3 rounded-[12px] bg-surface-2/60 text-xs flex flex-col gap-1.5 text-ink-muted">
                    <div className="flex justify-between">
                      <span>• NGO Community Fund (40%)</span>
                      <span className="font-medium text-ink">
                        {formatPrice(Math.round(selectedGarment.price * 0.2 * 0.4))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Campus Logistics & App (35%)</span>
                      <span className="font-medium text-ink">
                        {formatPrice(Math.round(selectedGarment.price * 0.2 * 0.35))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Your Seller Wardrobe Credit (25%)</span>
                      <span className="font-medium text-primary">
                        {formatPrice(Math.round(selectedGarment.price * 0.2 * 0.25))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Input
                label="Garment Condition & Sizing Note"
                placeholder="e.g. Gently worn, size Medium, zero tears, freshly laundered"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
              />
            </div>
          )}

          <Button
            variant="primary"
            loading={submitting}
            onClick={handleConfirmPassOn}
            className="w-full mt-2"
          >
            {passType === 'donate' ? 'Confirm NGO Donation' : 'List for Campus Resale'}
          </Button>
        </div>
      )}
    </div>
  );
};
