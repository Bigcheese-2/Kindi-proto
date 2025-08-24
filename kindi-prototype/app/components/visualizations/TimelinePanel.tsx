'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { useFilters } from '@/app/contexts/FilterContext';
import { applyFiltersToDataset } from '@/app/lib/filter/filterApplicationService';
import ExportButton from '../core/export/ExportButton';
import dynamic from 'next/dynamic';

// Dynamically import TimelineComponent to avoid SSR issues
const TimelineComponent = dynamic(() => import('./timeline/TimelineComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
        <p className="text-neutral-light text-sm">Loading timeline...</p>
      </div>
    </div>
  ),
});

export default function TimelinePanel() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState('real-time');
  const { currentDataset, isLoading } = useData();
  const { selectedEventIds, selectEvent, clearSelection } = useSelection();
  const { filters } = useFilters();

  // Apply filters to get filtered dataset
  const filteredDataset = useMemo(() => {
    return applyFiltersToDataset(currentDataset, filters);
  }, [currentDataset, filters]);

  const isEventSelected = (eventId: string) => selectedEventIds.includes(eventId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-secondary">
        <div className="flex items-center space-x-2">
          <h2 className="text-neutral-light text-sm font-medium">Timeline Analysis</h2>
          {filters.length > 0 && (
            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
              {filteredDataset.events.length} / {currentDataset?.events?.length || 0} events
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 rounded text-xs ${viewMode === 'real-time' ? 'bg-accent text-white' : 'bg-secondary text-neutral-light border border-secondary hover:border-accent transition-colors'} flex items-center`}
            onClick={() => setViewMode('real-time')}
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Real-time
          </button>
          <button
            className={`px-2 py-1 rounded text-xs ${viewMode === 'layers' ? 'bg-accent text-white' : 'bg-secondary text-neutral-light border border-secondary hover:border-accent transition-colors'} flex items-center`}
            onClick={() => setViewMode('layers')}
          >
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Layers
          </button>
        </div>
      </div>

      <div ref={timelineRef} className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
              <p className="text-neutral-light text-sm">Loading timeline data...</p>
            </div>
          </div>
        ) : !currentDataset?.events?.length ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-neutral-light text-sm">No event data available</div>
          </div>
        ) : !filteredDataset.events.length && filters.length > 0 ? (
          <div className="flex-1 flex items-center justify-center">
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
              <p className="text-neutral-medium text-sm">No events match the current filters</p>
              <p className="text-neutral-medium text-xs mt-1">Try adjusting your filter criteria</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <TimelineComponent
              events={filteredDataset.events}
              selectedEventIds={selectedEventIds}
              onEventClick={selectEvent}
              className="h-full w-full"
            />
            <div className="absolute top-3 right-3 z-10">
              <ExportButton
                exportType="timeline"
                elementRef={timelineRef}
                className="px-2 py-1 rounded text-xs bg-accent text-white hover:bg-blue-700 transition-colors flex items-center"
                buttonText={
                  <>
                    <svg
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Export
                  </>
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
