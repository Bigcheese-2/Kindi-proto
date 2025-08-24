'use client';

import React from 'react';
import { useData } from '@/app/contexts/DataContext';
import { Event, EventType, Entity } from '@/app/models/data-types';
import { useSelection } from '@/app/contexts/SelectionContext';

interface EventDetailViewProps {
  eventId: string;
}

export default function EventDetailView({ eventId }: EventDetailViewProps) {
  const { currentDataset } = useData();
  const { selectEntity, selectLocation } = useSelection();

  // Find the event in the current dataset
  const event = currentDataset?.events.find(e => e.id === eventId);

  if (!event) {
    return <div className="text-neutral-medium p-4">Event not found</div>;
  }

  // Get entities involved in this event
  const involvedEntities =
    currentDataset?.entities.filter(entity => event.entities.includes(entity.id)) || [];

  // Helper function to get event type label
  const getEventTypeLabel = (type: EventType): string => {
    switch (type) {
      case EventType.MEETING:
        return 'Meeting';
      case EventType.COMMUNICATION:
        return 'Communication';
      case EventType.TRANSACTION:
        return 'Transaction';
      case EventType.TRAVEL:
        return 'Travel';
      case EventType.INCIDENT:
        return 'Incident';
      case EventType.CUSTOM:
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4">
      <h3 className="text-neutral-light font-medium text-lg mb-2">{event.title}</h3>

      <div className="flex items-center mb-4">
        <span className="bg-accent text-white text-xs px-2 py-1 rounded mr-2">
          {getEventTypeLabel(event.type)}
        </span>
        <span className="text-xs text-neutral-medium">
          {formatDate(event.time)}
          {event.endTime && ` - ${formatDate(event.endTime)}`}
        </span>
      </div>

      {event.description && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">DESCRIPTION</h4>
          <div className="bg-primary rounded-md p-3 text-sm text-neutral-medium">
            {event.description}
          </div>
        </div>
      )}

      {event.location && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">LOCATION</h4>
          <div
            className="bg-primary rounded-md p-3 flex justify-between items-center cursor-pointer hover:bg-gray-700"
            onClick={() => selectLocation(event.location!.id)}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-neutral-light">
                  {event.location.name || 'Unnamed location'}
                </div>
                {event.location.address && (
                  <div className="text-xs text-neutral-medium">{event.location.address}</div>
                )}
              </div>
            </div>
            <div className="flex text-xs text-neutral-medium">
              {event.location.latitude.toFixed(2)}, {event.location.longitude.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {involvedEntities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">INVOLVED ENTITIES</h4>
          <div className="space-y-2">
            {involvedEntities.map(entity => (
              <div
                key={entity.id}
                className="bg-primary rounded-md p-2 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                onClick={() => selectEntity(entity.id)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-light">{entity.name}</span>
                </div>
                <span className="text-xs bg-gray-700 text-neutral-medium px-2 py-1 rounded">
                  {entity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {event.attributes && Object.keys(event.attributes).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">ATTRIBUTES</h4>
          <div className="bg-primary rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(event.attributes).map(([key, value]) => (
                <React.Fragment key={key}>
                  <div className="text-neutral-medium">{key}:</div>
                  <div className="text-neutral-light">{value.toString()}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
