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
      <div className="filter-panel-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold text-text-primary">Advanced Filters</h2>
        <div className="filter-actions flex flex-wrap gap-2">
          <FilterHistoryControls 
            canGoBack={historyPosition > 0}
            canGoForward={historyPosition < filterHistory.length - 1}
            onGoBack={goBack}
            onGoForward={goForward}
          />
          
          <button
            className="save-filter-button px-3 py-1 bg-success text-white rounded hover:opacity-90 text-sm"
            onClick={() => setIsDialogOpen(true)}
            disabled={!advancedFilter}
            aria-label="Save current filter"
            aria-disabled={!advancedFilter}
          >
            Save Filter
          </button>
          
          <button
            className="export-filter-button px-3 py-1 bg-accent text-white rounded hover:opacity-90 text-sm"
            onClick={handleExport}
            disabled={!advancedFilter}
            aria-label="Export current filter"
            aria-disabled={!advancedFilter}
          >
            Export
          </button>
          
          <button
            className="import-filter-button px-3 py-1 bg-purple-500 text-white rounded hover:opacity-90 text-sm"
            onClick={() => setImportDialogOpen(true)}
            aria-label="Import filter"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
          <div className="bg-background-secondary p-4 sm:p-6 rounded-lg w-full max-w-md border border-border-color shadow-md">
            <h3 id="import-dialog-title" className="text-lg font-medium mb-4 text-text-primary">Import Filter</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-text-primary">
                Paste filter JSON
              </label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                className="w-full border border-border-color rounded p-2 h-40 bg-background-tertiary text-text-primary"
                placeholder="Paste JSON here..."
              />
              {importError && (
                <p className="text-error text-sm mt-1">{importError}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-border-color rounded bg-background-tertiary text-text-primary hover:bg-opacity-80"
                onClick={() => {
                  setImportDialogOpen(false);
                  setImportError(null);
                  setImportText('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
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
