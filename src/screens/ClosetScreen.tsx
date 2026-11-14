import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GarmentCard } from '../components/shared/GarmentCard';
import { Chip } from '../components/shared/Chip';
import { EmptyState } from '../components/shared/EmptyState';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { GarmentCategory } from '../types';

export interface ClosetScreenProps {
  onNavigate: (route: string, garmentId?: string) => void;
}

type FilterOption = 'all' | GarmentCategory | 'active' | 'passed_on';
type SortOption = 'most_worn' | 'best_value' | 'newest';

export const ClosetScreen: React.FC<ClosetScreenProps> = ({ onNavigate }) => {
  const { garments, getStatsForGarment, recentCostPerWearChangeGarmentId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('most_worn');

  const filteredAndSorted = useMemo(() => {
    let result = [...garments];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.colour && g.colour.toLowerCase().includes(q))
      );
    }

    // Filter chip
    if (activeFilter === 'active') {
      result = result.filter((g) => g.status === 'active');
    } else if (activeFilter === 'passed_on') {
      result = result.filter((g) => g.status !== 'active');
    } else if (activeFilter !== 'all') {
      result = result.filter((g) => g.category === activeFilter);
    }

    // Sort menu
    result.sort((a, b) => {
      const statsA = getStatsForGarment(a.id);
      const statsB = getStatsForGarment(b.id);

      if (activeSort === 'most_worn') {
        return statsB.wear_count - statsA.wear_count;
      }
      if (activeSort === 'best_value') {
        // Lower cost per wear is better value; never worn items at the end
        if (statsA.wear_count === 0 && statsB.wear_count === 0) return 0;
        if (statsA.wear_count === 0) return 1;
        if (statsB.wear_count === 0) return -1;
        return statsA.cost_per_wear - statsB.cost_per_wear;
      }
      if (activeSort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [garments, searchQuery, activeFilter, activeSort, getStatsForGarment]);

  return (
    <div className="flex flex-col gap-4 pb-12 text-left">
      {/* Top search & sort row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Search closet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3.5 rounded-full bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortOption)}
            aria-label="Sort garments by"
            className="h-10 pl-3 pr-8 rounded-full bg-surface border border-border text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
          >
            <option value="most_worn">Most Worn</option>
            <option value="best_value">Best Value</option>
            <option value="newest">Newest Added</option>
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar">
        <Chip
          label="All"
          count={garments.length}
          selected={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        <Chip
          label="Active"
          count={garments.filter((g) => g.status === 'active').length}
          selected={activeFilter === 'active'}
          onClick={() => setActiveFilter('active')}
        />
        <Chip
          label="Passed on"
          count={garments.filter((g) => g.status !== 'active').length}
          selected={activeFilter === 'passed_on'}
          onClick={() => setActiveFilter('passed_on')}
        />
        <Chip
          label="Tops"
          selected={activeFilter === 'top'}
          onClick={() => setActiveFilter('top')}
        />
        <Chip
          label="Bottoms"
          selected={activeFilter === 'bottom'}
          onClick={() => setActiveFilter('bottom')}
        />
        <Chip
          label="Outerwear"
          selected={activeFilter === 'outerwear'}
          onClick={() => setActiveFilter('outerwear')}
        />
        <Chip
          label="Shoes"
          selected={activeFilter === 'shoes'}
          onClick={() => setActiveFilter('shoes')}
        />
        <Chip
          label="Accessories"
          selected={activeFilter === 'accessory'}
          onClick={() => setActiveFilter('accessory')}
        />
      </div>

      {/* 2-column on mobile, 3 at 640px, 4 at 1024px */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
          {filteredAndSorted.map((garment) => (
            <GarmentCard
              key={garment.id}
              garment={garment}
              onClick={() => onNavigate('detail', garment.id)}
              isRecentChange={recentCostPerWearChangeGarmentId === garment.id}
            />
          ))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            title="No garments found"
            description={
              searchQuery
                ? 'Try a different keyword or clear your filter.'
                : 'No pieces in this category yet. Add one to your slow collection!'
            }
            actionLabel="Add Garment"
            onAction={() => onNavigate('add')}
          />
        </div>
      )}
    </div>
  );
};
