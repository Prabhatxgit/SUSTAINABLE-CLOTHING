import React, { useState } from 'react';
import { Button } from '../components/shared/Button';
import { Input, Select } from '../components/shared/Input';
import { Chip } from '../components/shared/Chip';
import { StatTile } from '../components/shared/StatTile';
import { StreakBadge } from '../components/shared/StreakBadge';
import { BadgeTile } from '../components/shared/BadgeTile';
import { GarmentCard } from '../components/shared/GarmentCard';
import { EmptyState } from '../components/shared/EmptyState';
import { BADGE_DEFINITIONS } from '../lib/badges';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const StyleguideScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { garments, streak, addToast } = useApp();
  const [selectedChip, setSelectedChip] = useState('active');

  const demoGarment = garments[0] || {
    id: 'demo_1',
    user_id: 'u1',
    name: 'Selvedge Chore Jacket',
    category: 'outerwear',
    colour: 'indigo',
    price: 3600,
    photo_path: '/src/assets/images/denim_jacket_1792929903155.jpg',
    status: 'active',
    created_at: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col gap-8 pb-24 text-left">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </button>
          <h2 className="font-display text-2xl font-bold text-ink">
            Component Styleguide & Review
          </h2>
          <p className="text-xs text-ink-muted">
            All states: default, hover, active, disabled, loading, and error.
          </p>
        </div>
      </div>

      {/* 1. Buttons */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          1. Buttons & Variants
        </h3>
        <div className="flex flex-wrap gap-2.5 items-center">
          <Button variant="primary">Primary Default</Button>
          <Button variant="primary" loading>Loading State</Button>
          <Button variant="primary" disabled>Disabled State</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button
            variant="secondary"
            onClick={() =>
              addToast({
                type: 'success',
                message: 'Interactive Toast Notification!',
                undoAction: () => console.log('Undone'),
              })
            }
          >
            Trigger Sample Toast
          </Button>
        </div>
      </section>

      {/* 2. Chips & Filter States */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          2. Category & Filter Chips
        </h3>
        <div className="flex flex-wrap gap-2">
          <Chip
            label="Active Filter"
            selected={selectedChip === 'active'}
            onClick={() => setSelectedChip('active')}
            count={12}
          />
          <Chip
            label="Unselected Filter"
            selected={selectedChip === 'unselected'}
            onClick={() => setSelectedChip('unselected')}
            count={4}
          />
          <Chip label="Disabled Chip" disabled />
        </div>
      </section>

      {/* 3. Inputs & Form Fields */}
      <section className="flex flex-col gap-3 max-w-md">
        <h3 className="font-display text-base font-semibold text-ink">
          3. Input & Select Fields
        </h3>
        <Input
          label="Default Text Input"
          placeholder="e.g. Linen Work Shirt"
          hint="Helper hint text rendered under the input"
        />
        <Input
          label="Error State Input"
          defaultValue="invalid-price"
          error="Price must be a valid positive number"
        />
        <Select
          label="Select Dropdown"
          options={[
            { value: 'top', label: 'Tops & Shirts' },
            { value: 'bottom', label: 'Bottoms & Chinos' },
          ]}
        />
      </section>

      {/* 4. Stat Tiles */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          4. Stat Tiles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatTile label="Cost / wear" value="₹72" delta="-₹12 this week" />
          <StatTile label="Times worn" value="18x" hint="Regular rotation" />
          <StatTile label="Active streak" value="9 days" isAccent hint="Personal best" />
        </div>
      </section>

      {/* 5. Streak & Badges */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          5. Streak Card & Badge Tiles
        </h3>
        <StreakBadge streak={streak} />
        <div className="grid grid-cols-3 gap-2.5 mt-2">
          <BadgeTile
            definition={BADGE_DEFINITIONS[0]}
            userBadge={{
              id: 'b1',
              user_id: 'u1',
              badge_key: 'first_wear',
              earned_at: new Date().toISOString(),
            }}
          />
          <BadgeTile definition={BADGE_DEFINITIONS[1]} />
          <BadgeTile definition={BADGE_DEFINITIONS[2]} />
        </div>
      </section>

      {/* 6. Garment Card */}
      <section className="flex flex-col gap-3 max-w-xs">
        <h3 className="font-display text-base font-semibold text-ink">
          6. Garment Card
        </h3>
        <GarmentCard garment={demoGarment} />
      </section>

      {/* 7. Empty State */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold text-ink">
          7. Empty State Component
        </h3>
        <EmptyState
          title="No items found"
          description="A calm, quiet empty state with a single primary action."
          actionLabel="Add Item"
          onAction={() => console.log('Action')}
        />
      </section>
    </div>
  );
};
