'use client';

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
    <div className="filter-panel h-full p-4 text-neutral-light space-y-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-neutral-light flex items-center">
          Filters
          {filters.length > 0 && activeTab === 'basic' && (
            <span className="ml-2 bg-accent text-white text-xs rounded-full px-2 py-0.5 font-medium">
              {filters.length}
            </span>
          )}
        </h2>

        <div className="flex items-center space-x-2">
          <div className="filter-tabs flex border border-secondary rounded-lg overflow-hidden bg-primary">
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-accent text-white'
                  : 'text-neutral-medium hover:text-neutral-light hover:bg-secondary'
              }`}
              onClick={() => setActiveTab('basic')}
              aria-pressed={activeTab === 'basic'}
              aria-label="Show basic filters"
            >
              Basic
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'advanced'
                  ? 'bg-accent text-white'
                  : 'text-neutral-medium hover:text-neutral-light hover:bg-secondary'
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
              className="px-3 py-1.5 text-xs bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setShowComparison(true)}
              aria-label="Compare filters"
            >
              Compare
            </button>
          )}
        </div>
      </div>

      <div className="filter-content bg-secondary border border-secondary rounded-lg p-4 space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary min-h-0">
        {activeTab === 'basic' ? (
          <>
            {/* Global Search Section */}
            <div>
              <h3 className="text-xs font-medium text-neutral-light mb-3 uppercase tracking-wide flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Global Search
              </h3>
              <GlobalSearch />
            </div>

            <div className="space-y-4">
              <ActiveFilters />
              <EntityTypeFilter />
              <TimeRangeFilter />
              <GeographicFilter />
            </div>
          </>
        ) : (
          <AdvancedFilterPanel />
        )}
      </div>

      {showComparison && <FilterComparisonView onClose={() => setShowComparison(false)} />}
    </div>
  );
}
