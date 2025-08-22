'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useSelection } from '../../contexts/SelectionContext';
import TimelineComponent from './timeline/TimelineComponent';
import TimelineControls from './timeline/TimelineControls';

export default function TimelinePanel() {
  const { currentDataset, isLoading, error } = useData();
  const { selectedEventIds, selectEvent } = useSelection();
  const timelineRef = useRef<any>();
  const [viewMode, setViewMode] = useState('all');

  const handleEventClick = useCallback(
    (eventId: string) => {
      selectEvent(eventId);
    },
    [selectEvent]
  );

  const handleZoomIn = useCallback(() => {
    if (timelineRef.current) {
      const range = timelineRef.current.getWindow();
      const interval = range.end - range.start;
      const newInterval = interval * 0.8;
      const center = range.start + interval / 2;
      timelineRef.current.setWindow(center - newInterval / 2, center + newInterval / 2);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (timelineRef.current) {
      const range = timelineRef.current.getWindow();
      const interval = range.end - range.start;
      const newInterval = interval * 1.2;
      const center = range.start + interval / 2;
      timelineRef.current.setWindow(center - newInterval / 2, center + newInterval / 2);
    }
  }, []);

  const handleFitToData = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.fit();
    }
  }, []);

  const handleToday = useCallback(() => {
    if (timelineRef.current) {
      const now = new Date();
      const start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      const end = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours ahead
      timelineRef.current.setWindow(start, end);
    }
  }, []);

  const handleTimePeriod = useCallback((period: 'day' | 'week' | 'month' | 'year') => {
    if (timelineRef.current) {
      const now = new Date();
      let start: Date;

      switch (period) {
        case 'day':
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      timelineRef.current.setWindow(start, now);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
        </div>
        <div className="flex-1 bg-primary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-neutral-medium">Loading timeline data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
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
            <p className="text-neutral-medium">Error loading timeline: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDataset || !currentDataset.events || currentDataset.events.length === 0) {
    return (
      <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-neutral-medium">No events to display in timeline</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
        <div className="text-sm text-neutral-medium">{currentDataset.events.length} events</div>
      </div>

      <div className="flex-1 relative bg-primary">
        {/* Timeline Controls */}
        <TimelineControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToData={handleFitToData}
          onToday={handleToday}
          onTimePeriod={handleTimePeriod}
          className="absolute top-4 left-4 z-10"
        />

        {/* Timeline Component */}
        <TimelineComponent
          ref={timelineRef}
          events={currentDataset.events}
          selectedEventIds={selectedEventIds}
          onEventClick={handleEventClick}
          className="h-full"
        />
      </div>
    </div>
  );
}
