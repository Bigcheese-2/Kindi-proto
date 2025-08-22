"use client";

import React, { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import { SavedFilter } from '@/app/models/filter-types';
import { FilterDifference } from '@/app/contexts/FilterContext';

interface FilterComparisonViewProps {
  onClose: () => void;
}

const FilterComparisonView: React.FC<FilterComparisonViewProps> = ({ onClose }) => {
  const { advancedSavedFilters, compareFilters } = useFilters();
  const [filter1Id, setFilter1Id] = useState<string>('');
  const [filter2Id, setFilter2Id] = useState<string>('');
  const [differences, setDifferences] = useState<FilterDifference[]>([]);
  
  // Find filters by ID
  const getFilterById = (id: string): SavedFilter | undefined => {
    return advancedSavedFilters.find(filter => filter.id === id);
  };
  
  // Compare filters when both are selected
  useEffect(() => {
    if (filter1Id && filter2Id) {
      const filter1 = getFilterById(filter1Id);
      const filter2 = getFilterById(filter2Id);
      
      if (filter1 && filter2) {
        const diffs = compareFilters(filter1.filter, filter2.filter);
        setDifferences(diffs);
      }
    } else {
      setDifferences([]);
    }
  }, [filter1Id, filter2Id, compareFilters, advancedSavedFilters]);
  
  // Get color for difference type
  const getDifferenceColor = (type: string): string => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      case 'changed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return '';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Compare Filters</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="filter-selectors flex space-x-4 mb-6">
          <div className="filter-selector flex-1">
            <label className="block text-sm font-medium mb-1">
              First Filter
            </label>
            <select
              value={filter1Id}
              onChange={e => setFilter1Id(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select a filter...</option>
              {advancedSavedFilters.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-selector flex-1">
            <label className="block text-sm font-medium mb-1">
              Second Filter
            </label>
            <select
              value={filter2Id}
              onChange={e => setFilter2Id(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select a filter...</option>
              {advancedSavedFilters.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="comparison-results">
          {filter1Id && filter2Id ? (
            differences.length > 0 ? (
              <div className="differences-list">
                <h4 className="text-lg font-medium mb-2">Differences</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Path</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">First Filter</th>
                      <th className="p-2 text-left">Second Filter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {differences.map((diff, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-mono text-sm">{diff.path}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getDifferenceColor(diff.type)}`}>
                            {diff.type}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-sm">
                          {diff.oldValue !== undefined ? 
                            typeof diff.oldValue === 'object' 
                              ? JSON.stringify(diff.oldValue) 
                              : String(diff.oldValue)
                            : '-'}
                        </td>
                        <td className="p-2 font-mono text-sm">
                          {diff.newValue !== undefined ? 
                            typeof diff.newValue === 'object' 
                              ? JSON.stringify(diff.newValue) 
                              : String(diff.newValue)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-differences bg-green-50 p-4 rounded text-center">
                <p className="text-green-700">No differences found. The filters are identical.</p>
              </div>
            )
          ) : (
            <div className="select-filters-prompt bg-blue-50 p-4 rounded text-center">
              <p className="text-blue-700">Select two filters to compare.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComparisonView;
