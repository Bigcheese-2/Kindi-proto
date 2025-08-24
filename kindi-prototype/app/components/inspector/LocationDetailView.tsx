'use client';

import React from 'react';
import { useData } from '@/app/contexts/DataContext';
import { GeoLocation, LocationType, Event } from '@/app/models/data-types';
import { useSelection } from '@/app/contexts/SelectionContext';

interface LocationDetailViewProps {
  locationId: string;
}

export default function LocationDetailView({ locationId }: LocationDetailViewProps) {
  const { currentDataset } = useData();
  const { selectEvent, selectEntity } = useSelection();

  // Find the location in the current dataset
  const location = currentDataset?.locations.find(l => l.id === locationId);

  if (!location) {
    return <div className="text-neutral-medium p-4">Location not found</div>;
  }

  // Get events that occurred at this location
  const eventsAtLocation =
    currentDataset?.events.filter(event => event.location?.id === locationId) || [];

  // Get entities involved in events at this location
  const getEntitiesAtLocation = () => {
    if (!currentDataset) return [];

    const entityIds = new Set<string>();

    eventsAtLocation.forEach(event => {
      event.entities.forEach(entityId => {
        entityIds.add(entityId);
      });
    });

    return currentDataset.entities.filter(entity => entityIds.has(entity.id));
  };

  const entitiesAtLocation = getEntitiesAtLocation();

  // Helper function to get location type label
  const getLocationTypeLabel = (type?: LocationType): string => {
    if (!type) return 'Unknown';

    switch (type) {
      case LocationType.CITY:
        return 'City';
      case LocationType.BUILDING:
        return 'Building';
      case LocationType.LANDMARK:
        return 'Landmark';
      case LocationType.REGION:
        return 'Region';
      case LocationType.CUSTOM:
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-neutral-light font-medium text-lg mb-2">
        {location.name || 'Unnamed Location'}
      </h3>

      {location.type && (
        <div className="flex items-center mb-4">
          <span className="bg-accent text-white text-xs px-2 py-1 rounded">
            {getLocationTypeLabel(location.type)}
          </span>
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium text-neutral-light mb-2">COORDINATES</h4>
        <div className="bg-primary rounded-md p-3 flex justify-between">
          <div className="text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-neutral-medium">Latitude:</div>
              <div className="text-neutral-light">{location.latitude.toFixed(6)}</div>
              <div className="text-neutral-medium">Longitude:</div>
              <div className="text-neutral-light">{location.longitude.toFixed(6)}</div>
            </div>
          </div>
        </div>
      </div>

      {location.address && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">ADDRESS</h4>
          <div className="bg-primary rounded-md p-3 text-sm text-neutral-light">
            {location.address}
          </div>
        </div>
      )}

      {/* Placeholder for map visualization */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-neutral-light mb-2">MAP</h4>
        <div className="bg-primary rounded-md p-3 h-24 flex items-center justify-center">
          <div className="text-neutral-medium text-sm">Map visualization would appear here</div>
        </div>
      </div>

      {eventsAtLocation.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">EVENTS AT THIS LOCATION</h4>
          <div className="space-y-2">
            {eventsAtLocation.map(event => (
              <div
                key={event.id}
                className="bg-primary rounded-md p-2 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                onClick={() => selectEvent(event.id)}
              >
                <div className="flex-1">
                  <div className="text-sm text-neutral-light">{event.title}</div>
                  <div className="text-xs text-neutral-medium">
                    {new Date(event.time).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-xs bg-gray-700 text-neutral-medium px-2 py-1 rounded ml-2">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entitiesAtLocation.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">ENTITIES PRESENT</h4>
          <div className="space-y-2">
            {entitiesAtLocation.map(entity => (
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

      {location.attributes && Object.keys(location.attributes).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-neutral-light mb-2">ATTRIBUTES</h4>
          <div className="bg-primary rounded-md p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(location.attributes).map(([key, value]) => (
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
