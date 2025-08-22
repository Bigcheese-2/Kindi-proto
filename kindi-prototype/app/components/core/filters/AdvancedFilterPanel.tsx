"use client";

import React, { useState } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import FilterBuilder from './FilterBuilder';
import SaveFilterDialog from './SaveFilterDialog';
import FilterHistoryControls from './FilterHistoryControls';
import SavedFiltersList from './SavedFiltersList';

const AdvancedFilterPanel: React.FC = () => {
  const { 
    advancedFilter, 
    advancedSavedFilters,
    filterHistory,
    historyPosition,
    goBack,
    goForward,
    exportFilter,
    importFilter
  } = useFilters();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  
  const handleExport = () => {
    try {
      const json = exportFilter();
      // Create a blob and download it
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'filter-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting filter:', error);
      alert('Error exporting filter. Please ensure you have an active filter.');
    }
  };
  
  const handleImport = () => {
    try {
      setImportError(null);
      importFilter(importText);
      setImportDialogOpen(false);
      setImportText('');
    } catch (error) {
      console.error('Error importing filter:', error);
      setImportError('Invalid filter format. Please check your JSON and try again.');
    }
  };
  
  return (
    <div className="advanced-filter-panel">
      <div className="filter-panel-header flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Advanced Filters</h2>
        <div className="filter-actions flex space-x-2">
          <FilterHistoryControls 
            canGoBack={historyPosition > 0}
            canGoForward={historyPosition < filterHistory.length - 1}
            onGoBack={goBack}
            onGoForward={goForward}
          />
          
          <button
            className="save-filter-button px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            onClick={() => setIsDialogOpen(true)}
            disabled={!advancedFilter}
          >
            Save Filter
          </button>
          
          <button
            className="export-filter-button px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            onClick={handleExport}
            disabled={!advancedFilter}
          >
            Export
          </button>
          
          <button
            className="import-filter-button px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            onClick={() => setImportDialogOpen(true)}
          >
            Import
          </button>
        </div>
      </div>
      
      <div className="filter-builder-container mb-6">
        <FilterBuilder />
      </div>
      
      {advancedSavedFilters.length > 0 && (
        <div className="saved-filters-container">
          <h3 className="text-lg font-medium mb-2">Saved Filters</h3>
          <SavedFiltersList />
        </div>
      )}
      
      {/* Save Filter Dialog */}
      {isDialogOpen && (
        <SaveFilterDialog
          onClose={() => setIsDialogOpen(false)}
        />
      )}
      
      {/* Import Dialog */}
      {importDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Import Filter</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Paste filter JSON
              </label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                className="w-full border rounded p-2 h-40"
                placeholder="Paste JSON here..."
              />
              {importError && (
                <p className="text-red-500 text-sm mt-1">{importError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => {
                  setImportDialogOpen(false);
                  setImportError(null);
                  setImportText('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleImport}
                disabled={!importText.trim()}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterPanel;
