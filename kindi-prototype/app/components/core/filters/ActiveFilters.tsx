"use client";

import { useFilters, Filter } from '@/app/contexts/FilterContext';

interface FilterBadgeProps {
  filter: Filter;
  onRemove: () => void;
}

function FilterBadge({ filter, onRemove }: FilterBadgeProps) {
  // Get filter description based on type
  const getFilterDescription = () => {
    switch (filter.type) {
      case 'entityType':
        return `Entity Types: ${filter.entityTypes.length} selected`;
      case 'timeRange':
        const start = filter.startTime ? new Date(filter.startTime).toLocaleDateString() : 'Any';
        const end = filter.endTime ? new Date(filter.endTime).toLocaleDateString() : 'Any';
        return `Time: ${start} to ${end}`;
      case 'geographic':
        return `Geographic: ${filter.region.type === 'bounds' ? 'Area' : 'Radius'}`;
      default:
        return 'Unknown Filter';
    }
  };
  
  return (
    <div className="filter-badge inline-flex items-center bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2">
      <span className="text-xs text-neutral-light mr-2">{getFilterDescription()}</span>
      <button 
        className="text-neutral-medium hover:text-neutral-light" 
        onClick={onRemove}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ActiveFilters() {
  const { filters, removeFilter, clearFilters } = useFilters();
  
  if (filters.length === 0) {
    return null;
  }
  
  return (
    <div className="active-filters mb-4">
      <div className="filters-header flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-neutral-light">Active Filters</h3>
        <button 
          className="text-xs text-neutral-medium hover:text-neutral-light"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>
      
      <div className="filter-badges flex flex-wrap">
        {filters.map(filter => (
          <FilterBadge
            key={filter.id}
            filter={filter}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}
      </div>
    </div>
  );
}
