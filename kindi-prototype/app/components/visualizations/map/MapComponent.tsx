'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GeoLocation, Entity } from '../../../models/data-types';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MarkerData {
  id: string;
  position: [number, number];
  name: string;
  type: string;
  address?: string;
  entities: string[];
  primaryEntityType: string;
  attributes?: any;
}

interface MapComponentProps {
  locations: GeoLocation[];
  entities: Entity[];
  selectedLocationIds?: string[];
  onLocationClick?: (locationId: string) => void;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  entities,
  selectedLocationIds = [],
  onLocationClick,
  className = '',
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Default map settings
  const defaultCenter: [number, number] = [40.7128, -74.006]; // New York City
  const defaultZoom = 10;

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform location data to markers
  useEffect(() => {
    const newMarkers: MarkerData[] = locations.map(location => {
      // Find entities associated with this location
      const relatedEntities = entities.filter(
        entity => entity.attributes?.locationId === location.id
      );

      return {
        id: location.id,
        position: [location.latitude, location.longitude],
        name: location.name || 'Unnamed Location',
        type: location.type || 'CUSTOM',
        address: location.address,
        entities: relatedEntities.map(e => e.id),
        primaryEntityType: relatedEntities[0]?.type || 'LOCATION',
        attributes: location.attributes,
      };
    });

    setMarkers(newMarkers);
  }, [locations, entities]);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (locationId: string) => {
      if (onLocationClick) {
        onLocationClick(locationId);
      }
    },
    [onLocationClick]
  );

  // Show loading/placeholder for SSR
  if (!isClient) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* Default tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{marker.name}</h3>
                <p className="text-xs text-gray-600 mt-1">Type: {marker.type}</p>
                {marker.address && <p className="text-xs text-gray-600">{marker.address}</p>}
                {marker.entities.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {marker.entities.length} associated entities
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Add map controls here later */}
    </div>
  );
};

export default MapComponent;
