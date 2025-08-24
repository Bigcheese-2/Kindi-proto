'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { useFilters } from '@/app/contexts/FilterContext';
import { applyFiltersToDataset } from '@/app/lib/filter/filterApplicationService';
import ExportButton from '../core/export/ExportButton';
import dynamic from 'next/dynamic';
import '@/app/styles/leaflet-custom.css';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('./map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
        <p className="text-neutral-light text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPanel() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<'satellite' | 'streets'>('satellite');
  const { currentDataset, isLoading } = useData();
  const { selectedLocationIds, selectLocation, clearSelection } = useSelection();
  const { filters } = useFilters();

  // Apply filters to get filtered dataset
  const filteredDataset = useMemo(() => {
    return applyFiltersToDataset(currentDataset, filters);
  }, [currentDataset, filters]);

  const isLocationSelected = (locationId: string) => selectedLocationIds.includes(locationId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-secondary">
        <div className="flex items-center space-x-2">
          <h2 className="text-neutral-light text-sm font-medium">Geographic View</h2>
          {filters.length > 0 && (
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
              {filteredDataset.locations.length} / {currentDataset?.locations?.length || 0}{' '}
              locations
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 rounded text-xs ${mapType === 'satellite' ? 'bg-accent text-white' : 'bg-secondary text-neutral-light border border-secondary hover:border-accent transition-colors'} flex items-center`}
            onClick={() => setMapType('satellite')}
            aria-label="Satellite View"
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Satellite
          </button>
          <button
            className={`px-2 py-1 rounded text-xs ${mapType === 'streets' ? 'bg-accent text-white' : 'bg-secondary text-neutral-light border border-secondary hover:border-accent transition-colors'} flex items-center`}
            onClick={() => setMapType('streets')}
            aria-label="Streets View"
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Streets
          </button>
        </div>
      </div>

      <div ref={mapRef} className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
              <p className="text-neutral-light text-sm">Interactive Map Loading...</p>
            </div>
          </div>
        ) : !currentDataset?.locations?.length ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-accent opacity-20 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-neutral-light text-sm">No location data available</p>
            </div>
          </div>
        ) : !filteredDataset.locations.length && filters.length > 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-neutral-medium mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <p className="text-neutral-medium text-sm">No locations match the current filters</p>
              <p className="text-neutral-medium text-xs mt-1">Try adjusting your filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Use the MapComponent */}
            <div className="absolute inset-0">
              <style jsx global>{`
                /* Custom styles for Leaflet in dark mode */
                .leaflet-container {
                  background: #1a1e23;
                }
                .leaflet-control-zoom {
                  border: none !important;
                  background: #2a2f36 !important;
                }
                .leaflet-control-zoom a {
                  background: #2a2f36 !important;
                  color: #e1e5eb !important;
                  border-color: #3a4049 !important;
                }
                .leaflet-control-zoom a:hover {
                  background: #3a4049 !important;
                }
                .leaflet-popup-content-wrapper,
                .leaflet-popup-tip {
                  background: #1a1e23 !important;
                  color: #e1e5eb !important;
                  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4) !important;
                }
              `}</style>

              <MapComponent
                locations={filteredDataset.locations}
                entities={filteredDataset.entities}
                selectedLocationIds={selectedLocationIds}
                onLocationClick={selectLocation}
                mapType={mapType}
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
