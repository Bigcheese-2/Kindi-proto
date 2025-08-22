"use client";

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelectionSync } from '@/app/hooks/useSelectionSync';
import ExportButton from '../core/export/ExportButton';

export default function MapPanel() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState('satellite');
  const { currentDataset, isLoading } = useData();
  const { 
    selectedLocationIds, 
    selectLocation, 
    isLocationSelected, 
    clearSelection 
  } = useSelectionSync('map');
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        <div className="flex space-x-2">
          <ExportButton
            exportType="map"
            elementRef={mapRef}
            className="px-3 py-1 rounded text-sm bg-gray-700 text-neutral-medium hover:bg-gray-600"
            buttonText="Export"
          />
          <button 
            className={`px-3 py-1 rounded text-sm ${mapType === 'satellite' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setMapType('satellite')}
          >
            Satellite
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${mapType === 'streets' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setMapType('streets')}
          >
            Streets
          </button>
        </div>
      </div>
      
      <div ref={mapRef} className="flex-1 bg-primary flex items-center justify-center p-4 relative">
        {isLoading ? (
          <div className="text-neutral-light">Loading map data...</div>
        ) : !currentDataset?.locations?.length ? (
          <div className="text-neutral-light">No location data available</div>
        ) : (
          <div className="relative w-full h-full">
            {/* Placeholder map display - This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full text-gray-700" viewBox="0 0 500 300">
                <rect x="0" y="0" width="500" height="300" fill="#2d3748" />
                <path d="M100,50 L200,80 L300,60 L400,100 L400,250 L300,230 L200,250 L100,200 Z" 
                  fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Location markers */}
            <div className="absolute inset-0">
              {currentDataset.locations.map(location => {
                // In a real implementation, these would be positioned based on lat/long
                // For demo, use random positioning
                const left = Math.floor(Math.random() * 80) + 10;
                const top = Math.floor(Math.random() * 80) + 10;
                
                return (
                  <div 
                    key={location.id}
                    className="absolute"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <button
                      className={`w-6 h-6 rounded-full ${isLocationSelected(location.id) ? 'bg-highlight' : 'bg-accent'} flex items-center justify-center`}
                      onClick={() => selectLocation(location.id)}
                    >
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-xs text-neutral-light block mt-1">
                      {location.name || `Loc ${location.id.substring(0, 4)}`}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-4 right-4">
              <button 
                className="px-3 py-1 bg-gray-700 text-neutral-light rounded hover:bg-gray-600 text-sm"
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