"use client";

import React, { useState } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import { SavedFilter } from '@/app/models/filter-types';

const SavedFiltersList: React.FC = () => {
  const { 
    advancedSavedFilters, 
    applySavedAdvancedFilter, 
    deleteSavedAdvancedFilter,
    exportFilter
  } = useFilters();
  
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  
  // Group filters by category
  const filtersByCategory = advancedSavedFilters.reduce<Record<string, SavedFilter[]>>(
    (acc, filter) => {
      const category = filter.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(filter);
      return acc;
    },
    {}
  );
  
  const handleExport = (id: string) => {
    try {
      const json = exportFilter(id);
      // Create a blob and download it
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filter-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting filter:', error);
      alert('Error exporting filter.');
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this filter?')) {
      deleteSavedAdvancedFilter(id);
    }
  };
  
  if (advancedSavedFilters.length === 0) {
    return null;
  }
  
  return (
    <div className="saved-filters-list">
      {Object.entries(filtersByCategory).map(([category, filters]) => (
        <div key={category} className="filter-category mb-3">
          <h4 className="text-xs font-medium text-neutral-light mb-2">{category}</h4>
          
          <div className="filters-list space-y-2">
            {filters.map(filter => (
              <div 
                key={filter.id} 
                className="filter-item border border-secondary rounded overflow-hidden"
              >
                <div 
                  className="filter-header flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-secondary cursor-pointer space-y-2 sm:space-y-0"
                  onClick={() => setExpandedFilter(
                    expandedFilter === filter.id ? null : filter.id
                  )}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedFilter === filter.id}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedFilter(expandedFilter === filter.id ? null : filter.id);
                    }
                  }}
                >
                  <div className="filter-info">
                    <h5 className="font-medium text-neutral-light text-xs">{filter.name}</h5>
                    {filter.description && (
                      <p className="text-xs text-neutral-medium">{filter.description}</p>
                    )}
                  </div>
                  
                  <div className="filter-actions flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      className="apply-filter-button px-2 py-0.5 text-xs bg-accent text-white rounded hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        applySavedAdvancedFilter(filter.id);
                      }}
                      title="Apply filter"
                      aria-label={`Apply filter: ${filter.name}`}
                    >
                      Apply
                    </button>
                    
                    <button
                      className="export-filter-button px-2 py-0.5 text-xs border border-secondary text-neutral-light rounded hover:border-accent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(filter.id);
                      }}
                      title="Export filter"
                      aria-label={`Export filter: ${filter.name}`}
                    >
                      Export
                    </button>
                    
                    <button
                      className="delete-filter-button px-2 py-0.5 text-xs border border-secondary text-error rounded hover:border-error transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(filter.id);
                      }}
                      title="Delete filter"
                      aria-label={`Delete filter: ${filter.name}`}
                    >
                      Delete
                    </button>
                    
                    <button
                      className="expand-filter-button p-1 text-neutral-medium hover:text-neutral-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedFilter(
                          expandedFilter === filter.id ? null : filter.id
                        );
                      }}
                      title={expandedFilter === filter.id ? "Collapse" : "Expand"}
                      aria-label={expandedFilter === filter.id ? 
                        `Collapse details for filter: ${filter.name}` : 
                        `Expand details for filter: ${filter.name}`}
                      aria-expanded={expandedFilter === filter.id}
                    >
                      {expandedFilter === filter.id ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
                
                {expandedFilter === filter.id && (
                  <div className="filter-details p-2 border-t border-secondary">
                    <div className="filter-metadata text-xs mb-2 text-neutral-medium">
                      <p>Created: {new Date(filter.createdAt).toLocaleString()}</p>
                      <p>Updated: {new Date(filter.updatedAt).toLocaleString()}</p>
                    </div>
                    
                    <div className="filter-json bg-primary p-2 rounded overflow-auto max-h-60 border border-secondary">
                      <pre className="text-xs text-neutral-light">
                        {JSON.stringify(filter.filter, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedFiltersList;
