'use client';

import React, { useCallback, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useSelection } from '../../contexts/SelectionContext';
import MapComponent from './map/MapComponent';
import MapControls from './map/MapControls';
import MapLegend from './map/MapLegend';

export default function MapPanel() {
  const { currentDataset, isLoading, error } = useData();
  const { selectedLocationIds, selectLocation } = useSelection();
  const [currentLayer, setCurrentLayer] = useState('street');

  const handleLocationClick = useCallback(
    (locationId: string) => {
      selectLocation(locationId);
    },
    [selectLocation]
  );

  const handleLayerChange = useCallback((layer: 'street' | 'satellite' | 'terrain') => {
    setCurrentLayer(layer);
    // TODO: Implement actual layer switching in MapComponent
  }, []);

  if (isLoading) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-neutral-medium">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <div className="text-error mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-neutral-medium">Error loading map: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset || !currentDataset.locations || currentDataset.locations.length === 0) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-accent mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-neutral-medium">No locations to display on map</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        <div className="text-sm text-neutral-medium">
          {currentDataset.locations.length} locations
        </div>
      </div>

      <div className="flex-1 relative bg-primary">
        {/* Map Component */}
        <MapComponent
          locations={currentDataset.locations}
          entities={currentDataset.entities}
          selectedLocationIds={selectedLocationIds}
          onLocationClick={handleLocationClick}
          className="h-full"
        />

        {/* Map Controls */}
        <MapControls
          onLayerChange={handleLayerChange}
          currentLayer={currentLayer}
          className="absolute top-4 left-4 z-10"
        />

        {/* Map Legend */}
        <MapLegend className="absolute bottom-4 left-4 z-10 max-w-xs" />
      </div>
    </div>
  );
}
