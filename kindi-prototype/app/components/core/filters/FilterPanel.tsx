"use client";

import { useState } from 'react';
import EntityTypeFilter from './EntityTypeFilter';
import TimeRangeFilter from './TimeRangeFilter';
import GeographicFilter from './GeographicFilter';
import ActiveFilters from './ActiveFilters';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import FilterComparisonView from './FilterComparisonView';
import GlobalSearch from '../search/GlobalSearch';
import { useFilters } from '@/app/contexts/FilterContext';

export default function FilterPanel() {
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [showComparison, setShowComparison] = useState(false);
  
  return (
    <div className="filter-panel p-3 text-neutral-light">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-neutral-light">
          Filters
          {filters.length > 0 && activeTab === 'basic' && (
            <span className="ml-2 bg-accent text-white text-xs rounded-full px-2 py-0.5">
              {filters.length}
            </span>
          )}
        </h2>
        
        <div className="flex items-center">
          <div className="filter-tabs flex border border-secondary rounded overflow-hidden">
            <button
              className={`px-3 py-1 text-xs ${
                activeTab === 'basic' 
                  ? 'bg-accent text-white' 
                  : 'bg-secondary text-neutral-medium hover:text-neutral-light'
              }`}
              onClick={() => setActiveTab('basic')}
              aria-pressed={activeTab === 'basic'}
              aria-label="Show basic filters"
            >
              Basic
            </button>
            <button
              className={`px-3 py-1 text-xs ${
                activeTab === 'advanced' 
                  ? 'bg-accent text-white' 
                  : 'bg-secondary text-neutral-medium hover:text-neutral-light'
              }`}
              onClick={() => setActiveTab('advanced')}
              aria-pressed={activeTab === 'advanced'}
              aria-label="Show advanced filters"
            >
              Advanced
            </button>
          </div>
          
          {activeTab === 'advanced' && (
            <button
              className="ml-2 px-2 py-1 text-xs bg-accent text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setShowComparison(true)}
              aria-label="Compare filters"
            >
              Compare
            </button>
          )}
        </div>
      </div>
      
      <div className="filter-content border border-secondary rounded p-3 bg-secondary">
        {activeTab === 'basic' ? (
          <>
            {/* Global Search Section */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-neutral-light mb-2 uppercase tracking-wide">Global Search</h3>
              <GlobalSearch />
            </div>
            
            <ActiveFilters />
            <EntityTypeFilter />
            <TimeRangeFilter />
            <GeographicFilter />
          </>
        ) : (
          <AdvancedFilterPanel />
        )}
      </div>
      
      {showComparison && (
        <FilterComparisonView onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
}
