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
        <div key={category} className="filter-category mb-4">
          <h4 className="text-md font-medium text-gray-700 mb-2">{category}</h4>
          
          <div className="filters-list space-y-2">
            {filters.map(filter => (
              <div 
                key={filter.id} 
                className="filter-item border border-gray-200 rounded-md overflow-hidden"
              >
                <div 
                  className="filter-header flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedFilter(
                    expandedFilter === filter.id ? null : filter.id
                  )}
                >
                  <div className="filter-info">
                    <h5 className="font-medium">{filter.name}</h5>
                    {filter.description && (
                      <p className="text-sm text-gray-600">{filter.description}</p>
                    )}
                  </div>
                  
                  <div className="filter-actions flex items-center space-x-2">
                    <button
                      className="apply-filter-button p-1 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        applySavedAdvancedFilter(filter.id);
                      }}
                      title="Apply filter"
                    >
                      Apply
                    </button>
                    
                    <button
                      className="export-filter-button p-1 text-green-600 hover:text-green-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(filter.id);
                      }}
                      title="Export filter"
                    >
                      Export
                    </button>
                    
                    <button
                      className="delete-filter-button p-1 text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(filter.id);
                      }}
                      title="Delete filter"
                    >
                      Delete
                    </button>
                    
                    <button
                      className="expand-filter-button p-1 text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedFilter(
                          expandedFilter === filter.id ? null : filter.id
                        );
                      }}
                      title={expandedFilter === filter.id ? "Collapse" : "Expand"}
                    >
                      {expandedFilter === filter.id ? '▲' : '▼'}
                    </button>
                  </div>
                </div>
                
                {expandedFilter === filter.id && (
                  <div className="filter-details p-3 border-t border-gray-200">
                    <div className="filter-metadata text-sm mb-2">
                      <p>Created: {new Date(filter.createdAt).toLocaleString()}</p>
                      <p>Updated: {new Date(filter.updatedAt).toLocaleString()}</p>
                    </div>
                    
                    <div className="filter-json bg-gray-100 p-2 rounded overflow-auto max-h-60">
                      <pre className="text-xs">
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
