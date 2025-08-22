"use client";

import { useState, useEffect } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelectionSync } from '@/app/hooks/useSelectionSync';

export default function NetworkGraphPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentDataset, isLoading } = useData();
  const { 
    selectedEntityIds, 
    selectEntity, 
    isEntitySelected,
    clearSelection 
  } = useSelectionSync('graph');
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Expand"
          >
            <svg className="h-5 w-5 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Export"
          >
            <svg className="h-5 w-5 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-primary flex items-center justify-center p-4">
        {isLoading ? (
          <div className="text-neutral-light">Loading network data...</div>
        ) : !currentDataset?.entities?.length ? (
          <div className="text-neutral-light">No entity data available</div>
        ) : (
          <div className="w-full h-full relative">
            {/* Placeholder for an actual graph visualization library */}
            <div className="text-center">
              <div className="flex flex-col items-center justify-center">
                {currentDataset.entities.slice(0, 3).map((entity, index) => (
                  <div key={entity.id} className="flex flex-col items-center my-2">
                    <button 
                      className={`w-12 h-12 rounded-full ${isEntitySelected(entity.id) ? 'bg-highlight' : 'bg-accent'} mb-2 flex items-center justify-center`}
                      onClick={() => selectEntity(entity.id)}
                    >
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </button>
                    <span className="text-xs text-neutral-light">{entity.name}</span>
                    {index < 2 && (
                      <div className="w-0.5 h-8 bg-accent my-2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <button 
                className="px-3 py-1 bg-gray-700 text-neutral-light rounded hover:bg-gray-600"
                onClick={clearSelection}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
