"use client";

import { useState } from 'react';
import EntityTypeFilter from './EntityTypeFilter';
import TimeRangeFilter from './TimeRangeFilter';
import GeographicFilter from './GeographicFilter';
import ActiveFilters from './ActiveFilters';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import FilterComparisonView from './FilterComparisonView';
import { useFilters } from '@/app/contexts/FilterContext';

export default function FilterPanel() {
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [showComparison, setShowComparison] = useState(false);
  
  return (
    <div className="filter-panel p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-secondary font-semibold text-neutral-light">
          Filters
          {filters.length > 0 && activeTab === 'basic' && (
            <span className="ml-2 bg-accent text-white text-xs rounded-full px-2 py-0.5">
              {filters.length}
            </span>
          )}
        </h2>
        
        <div className="flex items-center">
          <div className="filter-tabs flex border rounded overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === 'basic' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              Basic
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                activeTab === 'advanced' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced
            </button>
          </div>
          
          {activeTab === 'advanced' && (
            <button
              className="ml-2 px-2 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={() => setShowComparison(true)}
            >
              Compare
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'basic' ? (
        <>
          <ActiveFilters />
          <EntityTypeFilter />
          <TimeRangeFilter />
          <GeographicFilter />
        </>
      ) : (
        <AdvancedFilterPanel />
      )}
      
      {showComparison && (
        <FilterComparisonView onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
}
