'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GeoLocation, Entity } from '../../../models/data-types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbXNfN1+3Ue1FMV3G5eIiCgRULdkGGWs6wjgjIJlSAYgGCWqhkVGZUGUZUWUeWUZ5fmw==',
  iconUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbXNfN1+3Ue1FMV3G5eIiCgRULdkGGWs6wjgjIJlSAYgGCWqhkVGZUGUZUWUeWUZ5fm',
  shadowUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAI9SURBVFiFtZY9aBNRFIafSkQsgrAoFgpCKxtbG1tbG0tbWxsLwcJCsLCwsLCwECzCwkKwsFCsLCxsLCxsKxsLCwsLCwsLCwsKCwsLCwsKCwsKC7CwsLCwE=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
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

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), {
  ssr: false,
});

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
  mapType?: 'satellite' | 'streets';
}

export const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  entities,
  selectedLocationIds = [],
  onLocationClick,
  className = '',
  mapType = 'streets',
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Default map settings
  const defaultCenter: [number, number] = [40.7128, -74.006]; // New York City
  const defaultZoom = 10;

  // Map tile URLs based on mapType
  const mapTiles = {
    streets: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
  };

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
      <div className={`flex items-center justify-center h-full bg-primary ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-accent animate-spin mb-2"></div>
          <p className="text-neutral-light text-sm">Interactive Map Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%', background: '#1A1E23' }}
        className="z-0"
        zoomControl={false}
        attributionControl={false}
      >
        {/* Selected tile layer based on mapType */}
        <TileLayer url={mapTiles[mapType].url} attribution={mapTiles[mapType].attribution} />

        {/* Render markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(marker.id),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 bg-primary text-neutral-light">
                <h3 className="font-medium text-sm">{marker.name}</h3>
                <p className="text-xs text-neutral-medium mt-1">Type: {marker.type}</p>
                {marker.address && <p className="text-xs text-neutral-medium">{marker.address}</p>}
                {marker.entities.length > 0 && (
                  <p className="text-xs text-accent mt-1">
                    {marker.entities.length} associated entities
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Custom zoom control position */}
        <ZoomControl position="topleft" />
      </MapContainer>

      {/* Map attribution with custom styling */}
      <div className="absolute bottom-1 right-1 text-xs text-neutral-medium z-10 bg-primary bg-opacity-50 px-1 rounded">
        {mapType === 'satellite' ? 'Satellite imagery © Esri' : 'Map data © OpenStreetMap, CARTO'}
      </div>
    </div>
  );
};

export default MapComponent;
