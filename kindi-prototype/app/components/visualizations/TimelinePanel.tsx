'use client';

import React, { useState } from 'react';
import { useData } from '@/app/contexts/DataContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { Event } from '@/app/models/data-types';

/**
 * Simple TimelinePanel component that displays events as a flat list
 */
function TimelinePanel() {
  const { currentDataset, isLoading } = useData();
  const { selectEvent } = useSelection();
  const [isRealTime, setIsRealTime] = useState(true);

  // Mock data for the timeline to demonstrate various event types and timeline features
  const mockEvents = [
    // January Events
    {
      id: 'meeting-1',
      type: 'meeting',
      title: 'Initial Contact Meeting',
      description: 'First contact between Viktor Petrov and Alexei Kuznetsov at Hotel Metropol',
      time: '2023-01-15',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    {
      id: 'communication-1',
      type: 'communication',
      title: 'Encrypted Email Exchange',
      description: 'Encrypted communication about potential business opportunities',
      time: '2023-01-22',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    // February Events
    {
      id: 'travel-1',
      type: 'travel',
      title: 'Berlin Trip',
      description: 'Viktor Petrov traveled to Berlin for undisclosed reasons',
      time: '2023-02-05',
      entities: ['viktor-petrov']
    },
    {
      id: 'meeting-2',
      type: 'travel',
      title: 'Berlin Meeting',
      description: 'Meeting with unknown contact at Brandenburg Gate area',
      time: '2023-02-07',
      entities: ['viktor-petrov']
    },
    {
      id: 'transaction-1',
      type: 'transaction',
      title: 'Small Fund Transfer',
      description: 'Transfer of €50,000 to Berlin account',
      time: '2023-02-08',
      entities: ['viktor-petrov']
    },
    // March Events
    {
      id: 'communication-2',
      type: 'communication',
      title: 'Secure Phone Call',
      description: 'Encrypted call between Kuznetsov and unknown contact',
      time: '2023-03-10',
      entities: ['alexei-kuznetsov']
    },
    {
      id: 'incident-1',
      type: 'incident',
      title: 'Surveillance Detection',
      description: 'Petrov spotted potential surveillance team in Moscow',
      time: '2023-03-25',
      entities: ['viktor-petrov']
    },
    // April Events
    {
      id: 'travel-2',
      type: 'travel',
      title: 'London Trip',
      description: 'Kuznetsov traveled to London via private jet',
      time: '2023-04-12',
      entities: ['alexei-kuznetsov']
    },
    {
      id: 'transaction-2',
      type: 'transaction',
      title: 'Real Estate Purchase',
      description: 'Purchase of London property through shell company',
      time: '2023-04-15',
      entities: ['alexei-kuznetsov']
    },
    // May Events
    {
      id: 'meeting-3',
      type: 'meeting',
      title: 'Strategic Planning Meeting',
      description: 'Meeting between Viktor Petrov and Alexei Kuznetsov to discuss investment strategy',
      time: '2023-05-10',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    {
      id: 'communication-3',
      type: 'communication',
      title: 'Document Exchange',
      description: 'Secure document handover at Moscow cafe',
      time: '2023-05-22',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    // June Events
    {
      id: 'transaction-3',
      type: 'transaction',
      title: 'Large Fund Transfer',
      description: 'Transfer of $1.2M to offshore account in Cayman Islands',
      time: '2023-06-15',
      entities: ['viktor-petrov']
    },
    {
      id: 'meeting-4',
      type: 'meeting',
      title: 'Emergency Meeting',
      description: 'Urgent meeting after suspicious bank activity report',
      time: '2023-06-16',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    {
      id: 'incident-2',
      type: 'incident',
      title: 'Document Destruction',
      description: 'Mass shredding of documents at Moscow office',
      time: '2023-06-17',
      entities: ['viktor-petrov', 'alexei-kuznetsov']
    },
    // July Events
    {
      id: 'travel-3',
      type: 'travel',
      title: 'Kyiv Business Trip',
      description: 'Viktor Petrov travels to Kyiv for week-long business trip',
      time: '2023-07-10',
      entities: ['viktor-petrov']
    }
  ];

  // Use real data if available, otherwise use mock data
  const events = currentDataset?.events?.length ? currentDataset.events : mockEvents;

  // Sort events by date for chronological order
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });

  const handleEventClick = (eventId: string) => {
    // Log the event that was clicked to help with debugging
    console.log("Event clicked:", eventId);
    
    // Use the selectEvent function if it exists
    if (selectEvent) {
      selectEvent(eventId);
    }
  };

  // Format the date to display next to events (DD/MM/YYYY)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Get a CSS class based on the event type
  const getEventClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'meeting': return 'bg-red-500';
      case 'communication': return 'bg-blue-500';
      case 'transaction': return 'bg-yellow-500';
      case 'travel': return 'bg-green-500';
      case 'incident': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-primary">
      {/* Header with Timeline Analysis title and controls */}
      <div className="flex justify-between items-center p-3 border-b border-secondary">
        <h2 className="text-neutral-light font-medium">Timeline Analysis</h2>
        <div className="flex space-x-2">
          {/* Real-time toggle button */}
          <button 
            className="flex items-center text-neutral-medium hover:text-neutral-light px-2 py-1 rounded transition-colors text-xs"
            onClick={() => setIsRealTime(!isRealTime)}
            title={isRealTime ? "Real-time mode on" : "Real-time mode off"}
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Real-time
          </button>
          
          {/* Layers button */}
          <button 
            className="flex items-center bg-secondary text-neutral-light px-2 py-1 rounded transition-colors text-xs"
            title="Show layers"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Layers
          </button>
        </div>
      </div>
      
      {/* Timeline content area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
              <p className="text-neutral-light text-sm">Loading timeline data...</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              {sortedEvents.map(event => (
                <div 
                  key={event.id}
                  className="flex items-start p-4 bg-secondary rounded-md hover:bg-secondary/70 cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="mr-4 relative pl-4">
                    <span 
                      className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${getEventClass(event.type)}`} 
                      aria-hidden="true"
                    ></span>
                    <div className="text-neutral-light font-medium">{event.title}</div>
                    <div className="text-sm text-neutral-medium mt-1">{event.description}</div>
                  </div>
                  <div className="ml-auto text-right text-xs text-neutral-medium self-center">
                    {formatDate(event.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelinePanel;