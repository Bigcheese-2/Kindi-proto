"use client";

import EntityTypeFilter from './EntityTypeFilter';
import TimeRangeFilter from './TimeRangeFilter';
import GeographicFilter from './GeographicFilter';
import ActiveFilters from './ActiveFilters';
import { useFilters } from '@/app/contexts/FilterContext';

export default function FilterPanel() {
  const { filters } = useFilters();
  
  return (
    <div className="filter-panel p-4">
      <h2 className="text-lg font-secondary font-semibold text-neutral-light mb-4">
        Filters
        {filters.length > 0 && (
          <span className="ml-2 bg-accent text-white text-xs rounded-full px-2 py-0.5">
            {filters.length}
          </span>
        )}
      </h2>
      
      <ActiveFilters />
      <EntityTypeFilter />
      <TimeRangeFilter />
      <GeographicFilter />
    </div>
  );
}
