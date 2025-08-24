"use client";

import { useState } from 'react';
import FilterPanel from '../core/filters/FilterPanel';
import { useUI } from '@/app/contexts/UIContext';
import { useData } from '@/app/contexts/DataContext';
import ExportDataButton from '../core/export/ExportDataButton';
import ReportManagerButton from '../core/export/ReportManagerButton';
import ExportSettingsButton from '../core/export/ExportSettingsButton';

export default function ControlPanel() {
  const { controlPanelVisible, setControlPanelVisible } = useUI();
  const { currentDataset, availableDatasets, loadDataset, isLoading, error } = useData();
  const [activeTab, setActiveTab] = useState<'filters' | 'datasets' | 'settings'>('filters');
  
  // Debug: Force panel to be visible for testing
  // if (!controlPanelVisible) {
  //   return (
  //     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
  //       <button 
  //         className="bg-secondary p-2 rounded-r-md shadow-md text-neutral-light"
  //         onClick={() => setControlPanelVisible(true)}
  //         title="Show Control Panel"
  //       >
  //         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  //         </svg>
  //       </button>
  //     </div>
  //   );
  // }
  
  // Debug logging
  console.log('ControlPanel render:', { 
    controlPanelVisible, 
    currentDataset: currentDataset?.name, 
    isLoading, 
    error: error?.message,
    availableDatasets: availableDatasets.length 
  });

  return (
    <div className="control-panel h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-secondary">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'filters' ? 'bg-accent text-white' : 'bg-secondary text-neutral-medium hover:text-neutral-light'
            }`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'datasets' ? 'bg-accent text-white' : 'bg-secondary text-neutral-medium hover:text-neutral-light'
            }`}
            onClick={() => setActiveTab('datasets')}
          >
            Datasets
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'settings' ? 'bg-accent text-white' : 'bg-secondary text-neutral-medium hover:text-neutral-light'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        <button
          className="p-1.5 text-neutral-medium hover:text-neutral-light"
          onClick={() => setControlPanelVisible(false)}
          title="Hide Control Panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Data Source Indicator */}
      <div className="px-4 py-3 border-b border-secondary bg-[#1A1E23] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-[#2A2F36] flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-medium uppercase tracking-wide block mb-1">Data Source</span>
              {currentDataset ? (
                <span className="text-sm font-medium text-neutral-light">
                  {currentDataset.name}
                </span>
              ) : (
                <span className="text-sm text-neutral-medium">
                  {isLoading ? 'Loading dataset...' : 'No dataset loaded'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {isLoading && (
              <div className="mr-2">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {error && (
              <div className="mr-2 p-1 bg-red-500 bg-opacity-10 rounded-full" title={error.message}>
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {currentDataset && (
          <div className="flex items-center mt-2 p-2 rounded-lg bg-[#2A2F36] bg-opacity-50">
            <div className="flex items-center space-x-3 text-xs text-neutral-medium w-full justify-around">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-neutral-light">{currentDataset.entities?.length || 0}</span>
                <span>entities</span>
              </div>
              <div className="h-8 border-r border-secondary"></div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-neutral-light">{currentDataset.events?.length || 0}</span>
                <span>events</span>
              </div>
              <div className="h-8 border-r border-secondary"></div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-neutral-light">{currentDataset.locations?.length || 0}</span>
                <span>locations</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 rounded bg-red-500 bg-opacity-10 text-xs text-red-400">
            {error.message}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'filters' && <FilterPanel />}
        {activeTab === 'datasets' && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-light">Datasets</h2>
              <ExportDataButton 
                className="px-3 py-1 bg-accent text-white rounded text-xs hover:bg-blue-700"
              />
            </div>
            <div className="mt-4 space-y-2">
              {availableDatasets.map((dataset) => (
                <div key={dataset.id} className="bg-secondary p-3 rounded border border-border-color">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-neutral-light font-medium">{dataset.name}</span>
                      {dataset.description && (
                        <p className="text-xs text-neutral-medium mt-1">{dataset.description}</p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-neutral-medium mt-1">
                        <span>{dataset.entitiesCount} entities</span>
                        <span>•</span>
                        <span>{dataset.relationshipsCount} relationships</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      {currentDataset?.id === dataset.id ? (
                        <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">Active</span>
                      ) : (
                        <button 
                          className="text-xs bg-secondary text-neutral-light px-2 py-0.5 rounded border border-border-color hover:border-accent disabled:opacity-50"
                          onClick={async () => {
                            // Don't reload if already current
                            if (currentDataset?.id !== dataset.id) {
                              try {
                                await loadDataset(dataset.id);
                              } catch (error) {
                                console.error('Failed to load dataset:', error);
                              }
                            }
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Load'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {availableDatasets.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-neutral-medium mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                  </svg>
                  <p className="text-neutral-medium text-sm">No datasets available</p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-light">Settings</h2>
              <div className="flex space-x-2">
                <ReportManagerButton 
                  className="px-3 py-1 bg-accent text-white rounded text-xs hover:bg-blue-700"
                />
                <ExportSettingsButton 
                  className="px-3 py-1 bg-secondary text-neutral-light rounded text-xs hover:border-accent border border-border-color"
                  buttonText="Export"
                />
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="bg-secondary p-3 rounded border border-border-color">
                <h3 className="text-sm font-medium text-neutral-light mb-2">Display Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="showLabels" className="mr-2" />
                    <label htmlFor="showLabels" className="text-neutral-medium text-sm">Show node labels</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="showEdges" className="mr-2" checked />
                    <label htmlFor="showEdges" className="text-neutral-medium text-sm">Show relationship edges</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}