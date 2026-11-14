import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageUpload } from '../components/shared/ImageUpload';
import { Input } from '../components/shared/Input';
import { Chip } from '../components/shared/Chip';
import { Button } from '../components/shared/Button';
import { COLOR_SWATCHES } from '../lib/seed';
import { GarmentCategory } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

export interface AddGarmentScreenProps {
  onBack: () => void;
  onSaved: (garmentId: string) => void;
}

const CATEGORIES: { key: GarmentCategory; label: string }[] = [
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'dress', label: 'Dress' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'accessory', label: 'Accessory' },
];

const PRESETS = [
  {
    name: 'Vintage T-Shirt',
    category: 'top' as GarmentCategory,
    color: 'sand',
    photo: '/src/assets/images/linen_shirt_1792929903640.jpg',
  },
  {
    name: 'Selvedge Jeans',
    category: 'bottom' as GarmentCategory,
    color: 'indigo',
    photo: '/src/assets/images/denim_jacket_1792929903155.jpg',
  },
  {
    name: 'Wool Knit Hoodie',
    category: 'top' as GarmentCategory,
    color: 'olive',
    photo: '/src/assets/images/wool_sweater_1792929904587.jpg',
  },
  {
    name: 'Artisan Chelsea Sneakers',
    category: 'shoes' as GarmentCategory,
    color: 'chestnut',
    photo: '/src/assets/images/chelsea_boots_1792929905119.jpg',
  },
];

export const AddGarmentScreen: React.FC<AddGarmentScreenProps> = ({
  onBack,
  onSaved,
}) => {
  const { addNewGarment, formatCurrencySymbol, user } = useApp();

  const [photo, setPhoto] = useState<string>('/src/assets/images/denim_jacket_1792929903155.jpg');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<GarmentCategory>('top');
  const [colour, setColour] = useState<string>('indigo');
  const [price, setPrice] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; price?: string; photo?: string }>({});
  const [saving, setSaving] = useState(false);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setColour(preset.color);
    if (!photo) setPhoto(preset.photo);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Please provide a name for this piece';
    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errs.price = 'Please enter a valid price greater than zero';
    }
    if (!photo) errs.photo = 'Please provide or select a photo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const created = addNewGarment({
        user_id: user.id,
        name: name.trim(),
        category,
        colour,
        price: parseFloat(price),
        photo_path: photo,
        status: 'active',
      });
      onSaved(created.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 text-left">
      {/* Back button row */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Quick-add presets */}
      <div className="mb-6">
        <span className="text-xs font-medium text-ink-muted block mb-2">
          Quick-Add Presets
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-2 text-ink border border-border/80 hover:bg-surface-2/80 active:scale-95 transition shrink-0"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 1. Photo Dropzone */}
        <ImageUpload value={photo} onChange={setPhoto} />
        {errors.photo && (
          <span className="text-xs text-danger -mt-4 font-medium">
            {errors.photo}
          </span>
        )}

        {/* 2. Name */}
        <Input
          label="Garment Name"
          placeholder="e.g. Selvedge Chore Coat"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          maxLength={60}
        />

        {/* 3. Category Chips */}
        <div>
          <span className="text-xs font-medium text-ink-muted block mb-2">
            Category
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.key}
                label={cat.label}
                selected={category === cat.key}
                onClick={() => setCategory(cat.key)}
              />
            ))}
          </div>
        </div>

        {/* 4. Colour Swatches */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-ink-muted">Colour</span>
            <span className="text-xs text-ink capitalize font-semibold">
              {COLOR_SWATCHES.find((s) => s.key === colour)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = colour === swatch.key;
              return (
                <button
                  key={swatch.key}
                  type="button"
                  onClick={() => setColour(swatch.key)}
                  title={swatch.label}
                  aria-label={swatch.label}
                  style={{ backgroundColor: swatch.hex }}
                  className={`relative w-8 h-8 rounded-full shrink-0 transition-transform flex items-center justify-center border border-black/10 shadow-xs active:scale-90 ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 stroke-[3] ${
                        swatch.key === 'white' || swatch.key === 'sand'
                          ? 'text-ink'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Original Price */}
        <Input
          label={`Purchase Price (${formatCurrencySymbol()})`}
          placeholder="0.00"
          type="number"
          inputMode="decimal"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
          hint="What you paid for it. We divide this by your wears to calculate cost per wear."
          leftAddon={
            <span className="text-xs font-bold text-ink-muted">
              {formatCurrencySymbol()}
            </span>
          }
        />

        {/* Sticky bottom CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/95 backdrop-blur-md border-t border-border z-30 lg:static lg:bg-transparent lg:border-none lg:p-0">
          <div className="max-w-md mx-auto">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              className="w-full h-12 shadow-md"
            >
              Save Garment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
