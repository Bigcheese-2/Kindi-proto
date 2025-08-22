'use client';

import { useState, useEffect, useRef } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import ExportButton from '../core/export/ExportButton';

export default function TimelinePanel() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState('real-time');
  const { currentDataset, isLoading } = useData();
  const { 
    selectedEventIds, 
    selectEvent, 
    clearSelection 
  } = useSelection();
  
  const isEventSelected = (eventId: string) => selectedEventIds.includes(eventId);
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
        <div className="flex space-x-2">
          <ExportButton
            exportType="timeline"
            elementRef={timelineRef}
            className="px-3 py-1 rounded text-sm bg-gray-700 text-neutral-medium hover:bg-gray-600"
            buttonText="Export"
          />
          <button 
            className={`px-3 py-1 rounded text-sm ${viewMode === 'real-time' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setViewMode('real-time')}
          >
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Real-time
            </div>
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${viewMode === 'layers' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setViewMode('layers')}
          >
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Layers
            </div>
          </button>
        </div>
      </div>
      
      <div ref={timelineRef} className="flex-1 bg-primary p-4 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-neutral-light">Loading timeline data...</div>
          </div>
        ) : !currentDataset?.events?.length ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-neutral-light">No event data available</div>
          </div>
        ) : (
          <>
            <div className="text-neutral-medium mb-2">Events</div>
            <div className="flex-1 flex flex-col">
              <div className="w-full h-12 bg-gray-800 rounded-lg relative mb-4">
                {/* Timeline scale */}
                <div className="absolute inset-x-0 top-0 flex justify-between px-4 text-xs text-neutral-medium">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
                
                {/* Event markers */}
                {currentDataset.events.slice(0, 5).map((event, index) => {
                  const position = (index / 4) * 100; // Simple positioning for demo
                  return (
                    <button
                      key={event.id}
                      className={`absolute h-4 w-4 rounded-full ${
                        isEventSelected(event.id) ? 'bg-highlight' : 'bg-accent'
                      } transform -translate-y-1/2`}
                      style={{ left: `${position}%`, top: '50%' }}
                      onClick={() => selectEvent(event.id)}
                      title={event.title}
                    ></button>
                  );
                })}
              </div>
              
              {/* Event details */}
              <div className="flex-1 overflow-y-auto">
                {currentDataset.events.slice(0, 5).map(event => (
                  <div 
                    key={event.id}
                    className={`p-3 mb-2 rounded-md ${
                      isEventSelected(event.id) ? 'bg-gray-700 border border-highlight' : 'bg-gray-800'
                    }`}
                    onClick={() => selectEvent(event.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-neutral-light">{event.title}</h4>
                      <span className="text-xs text-neutral-medium">
                        {new Date(event.time).toLocaleDateString()}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-neutral-medium mt-1">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-right">
                <button 
                  className="px-3 py-1 bg-gray-700 text-neutral-light rounded hover:bg-gray-600 text-sm"
                  onClick={clearSelection}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
