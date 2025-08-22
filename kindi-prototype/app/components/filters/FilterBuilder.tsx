"use client";

import { useEffect, useState } from 'react';
import { AdvancedFilter, FilterGroup, generateId } from '@/app/models/filter-types';
import FilterGroupComponent from './FilterGroupComponent';
import { useAdvancedFilter } from '@/app/contexts/AdvancedFilterContext';

interface FilterBuilderProps {
  initialFilter?: AdvancedFilter;
  onChange?: (filter: AdvancedFilter) => void;
}

export default function FilterBuilder({
  initialFilter,
  onChange
}: FilterBuilderProps) {
  const {
    advancedFilter,
    createEmptyFilter,
    addCondition,
    addGroup,
    updateCondition,
    updateGroupOperator,
    removeItem,
    setAdvancedFilter,
    savedFilters,
    saveFilter,
    applySavedFilter,
    deleteSavedFilter,
    goBack,
    goForward,
    historyPosition,
    filterHistory
  } = useAdvancedFilter();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterDescription, setFilterDescription] = useState('');
  
  // Initialize filter if not already set
  useEffect(() => {
    if (!advancedFilter) {
      if (initialFilter) {
        setAdvancedFilter(initialFilter);
      } else {
        createEmptyFilter();
      }
    }
  }, [advancedFilter, initialFilter, createEmptyFilter, setAdvancedFilter]);
  
  // Call onChange when filter changes
  useEffect(() => {
    if (advancedFilter && onChange) {
      onChange(advancedFilter);
    }
  }, [advancedFilter, onChange]);
  
  // Handle save filter
  const handleSaveFilter = () => {
    if (filterName.trim()) {
      saveFilter(filterName, filterDescription);
      setShowSaveDialog(false);
      setFilterName('');
      setFilterDescription('');
    }
  };
  
  if (!advancedFilter) {
    return <div className="text-neutral-medium">Loading filter builder...</div>;
  }
  
  return (
    <div className="filter-builder">
      <div className="filter-builder-header flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-neutral-light">Advanced Filter</h2>
        
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-neutral-light border border-gray-700 rounded-md text-sm flex items-center"
            onClick={() => goBack()}
            disabled={historyPosition <= 0}
            title="Undo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <button
            className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-neutral-light border border-gray-700 rounded-md text-sm flex items-center"
            onClick={() => goForward()}
            disabled={historyPosition >= filterHistory.length - 1}
            title="Redo"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <button
            className="px-3 py-1 bg-accent hover:bg-accent/80 text-white rounded-md text-sm flex items-center"
            onClick={() => setShowSaveDialog(true)}
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Filter
          </button>
        </div>
      </div>
      
      {/* Main filter builder */}
      <FilterGroupComponent
        group={advancedFilter as FilterGroup}
        onAddCondition={addCondition}
        onAddGroup={addGroup}
        onUpdateCondition={updateCondition}
        onUpdateGroupOperator={updateGroupOperator}
        onRemoveItem={removeItem}
      />
      
      {/* Saved filters section */}
      {savedFilters.length > 0 && (
        <div className="saved-filters mt-6">
          <h3 className="text-md font-medium text-neutral-light mb-2">Saved Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {savedFilters.map(filter => (
              <div key={filter.id} className="bg-secondary p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-neutral-light font-medium">{filter.name}</h4>
                  <div className="flex space-x-1">
                    <button
                      className="p-1 rounded hover:bg-primary text-neutral-light"
                      onClick={() => applySavedFilter(filter.id)}
                      title="Apply filter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      className="p-1 rounded hover:bg-error text-neutral-light"
                      onClick={() => deleteSavedFilter(filter.id)}
                      title="Delete filter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {filter.description && (
                  <p className="text-xs text-neutral-medium mt-1">{filter.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Save filter dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-secondary p-4 rounded-md shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium text-neutral-light mb-4">Save Filter</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-light mb-1">
                Filter Name
              </label>
              <input
                type="text"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                className="w-full p-2 bg-primary border border-gray-700 rounded text-neutral-light"
                placeholder="Enter filter name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-light mb-1">
                Description (optional)
              </label>
              <textarea
                value={filterDescription}
                onChange={e => setFilterDescription(e.target.value)}
                className="w-full p-2 bg-primary border border-gray-700 rounded text-neutral-light"
                placeholder="Enter filter description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-neutral-light border border-gray-700 rounded-md"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-accent hover:bg-accent/80 text-white rounded-md"
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
