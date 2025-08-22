"use client";

import { useState } from 'react';
import { AdvancedFilter, FilterDifference, compareFilters } from '@/app/models/filter-types';
import { useAdvancedFilter } from '@/app/contexts/AdvancedFilterContext';

interface FilterComparisonViewProps {
  filter1?: AdvancedFilter;
  filter2?: AdvancedFilter;
}

export default function FilterComparisonView({
  filter1: propFilter1,
  filter2: propFilter2
}: FilterComparisonViewProps) {
  const { savedFilters, advancedFilter } = useAdvancedFilter();
  
  const [selectedFilter1, setSelectedFilter1] = useState<string>(
    propFilter1 ? 'custom1' : advancedFilter ? 'current' : savedFilters.length > 0 ? savedFilters[0].id : ''
  );
  const [selectedFilter2, setSelectedFilter2] = useState<string>(
    propFilter2 ? 'custom2' : savedFilters.length > 0 ? savedFilters[0].id : ''
  );
  
  // Get the actual filter objects based on selection
  const getFilterObject = (filterId: string): AdvancedFilter | undefined => {
    if (filterId === 'current') {
      return advancedFilter || undefined;
    } else if (filterId === 'custom1') {
      return propFilter1;
    } else if (filterId === 'custom2') {
      return propFilter2;
    } else {
      const savedFilter = savedFilters.find(f => f.id === filterId);
      return savedFilter?.filter;
    }
  };
  
  const filter1 = getFilterObject(selectedFilter1);
  const filter2 = getFilterObject(selectedFilter2);
  
  // Compare filters
  const differences: FilterDifference[] = filter1 && filter2 
    ? compareFilters(filter1, filter2) 
    : [];
  
  // Get filter name for display
  const getFilterName = (filterId: string): string => {
    if (filterId === 'current') {
      return 'Current Filter';
    } else if (filterId === 'custom1' || filterId === 'custom2') {
      return 'Custom Filter';
    } else {
      const savedFilter = savedFilters.find(f => f.id === filterId);
      return savedFilter?.name || 'Unknown Filter';
    }
  };
  
  // Render difference item
  const renderDifferenceItem = (diff: FilterDifference) => {
    const getValueDisplay = (value: any) => {
      if (value === undefined || value === null) {
        return <span className="text-neutral-medium italic">null</span>;
      }
      if (typeof value === 'object') {
        return <span className="text-neutral-light">{JSON.stringify(value)}</span>;
      }
      return <span className="text-neutral-light">{String(value)}</span>;
    };
    
    return (
      <div key={diff.path} className="p-2 border-b border-gray-700 last:border-b-0">
        <div className="text-sm font-medium text-neutral-light mb-1">
          {diff.path}
        </div>
        
        {diff.type === 'added' && (
          <div className="flex">
            <div className="w-1/2 pr-2">
              <div className="text-xs text-neutral-medium">Not present</div>
            </div>
            <div className="w-1/2 pl-2 bg-success bg-opacity-10 p-1 rounded">
              <div className="text-xs text-success">Added: {getValueDisplay(diff.newValue)}</div>
            </div>
          </div>
        )}
        
        {diff.type === 'removed' && (
          <div className="flex">
            <div className="w-1/2 pr-2 bg-error bg-opacity-10 p-1 rounded">
              <div className="text-xs text-error">Removed: {getValueDisplay(diff.oldValue)}</div>
            </div>
            <div className="w-1/2 pl-2">
              <div className="text-xs text-neutral-medium">Not present</div>
            </div>
          </div>
        )}
        
        {diff.type === 'changed' && (
          <div className="flex">
            <div className="w-1/2 pr-2 bg-warning bg-opacity-10 p-1 rounded">
              <div className="text-xs text-warning">From: {getValueDisplay(diff.oldValue)}</div>
            </div>
            <div className="w-1/2 pl-2 bg-warning bg-opacity-10 p-1 rounded">
              <div className="text-xs text-warning">To: {getValueDisplay(diff.newValue)}</div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="filter-comparison">
      <h2 className="text-lg font-medium text-neutral-light mb-4">Filter Comparison</h2>
      
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-neutral-light mb-1">
            First Filter
          </label>
          <select
            value={selectedFilter1}
            onChange={e => setSelectedFilter1(e.target.value)}
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
          >
            {advancedFilter && (
              <option value="current">Current Filter</option>
            )}
            {propFilter1 && (
              <option value="custom1">Custom Filter 1</option>
            )}
            {savedFilters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-1/2">
          <label className="block text-sm font-medium text-neutral-light mb-1">
            Second Filter
          </label>
          <select
            value={selectedFilter2}
            onChange={e => setSelectedFilter2(e.target.value)}
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
          >
            {advancedFilter && (
              <option value="current">Current Filter</option>
            )}
            {propFilter2 && (
              <option value="custom2">Custom Filter 2</option>
            )}
            {savedFilters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!filter1 || !filter2 ? (
        <div className="text-neutral-medium p-4 bg-secondary rounded-md">
          Please select two filters to compare
        </div>
      ) : differences.length === 0 ? (
        <div className="text-success p-4 bg-secondary rounded-md">
          Filters are identical
        </div>
      ) : (
        <div className="bg-secondary rounded-md overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex justify-between">
            <div className="w-1/2 text-sm font-medium text-neutral-light">
              {getFilterName(selectedFilter1)}
            </div>
            <div className="w-1/2 text-sm font-medium text-neutral-light">
              {getFilterName(selectedFilter2)}
            </div>
          </div>
          
          <div className="differences-list max-h-80 overflow-y-auto">
            {differences.map(renderDifferenceItem)}
          </div>
          
          <div className="p-3 border-t border-gray-700 text-sm text-neutral-medium">
            {differences.length} difference{differences.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}
    </div>
  );
}
