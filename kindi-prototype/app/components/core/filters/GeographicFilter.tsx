"use client";

import { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';

export default function GeographicFilter() {
  const { filters, addFilter } = useFilters();
  const [filterType, setFilterType] = useState<'bounds' | 'radius'>('bounds');
  const [bounds, setBounds] = useState({
    north: 0,
    south: 0,
    east: 0,
    west: 0
  });
  const [center, setCenter] = useState({
    latitude: 0,
    longitude: 0
  });
  const [radius, setRadius] = useState(10); // Default 10km radius
  
  // Find existing geographic filter
  const existingFilter = filters.find(
    filter => filter.type === 'geographic'
  ) as any;
  
  // Initialize from existing filter
  useEffect(() => {
    if (existingFilter) {
      setFilterType(existingFilter.region.type);
      
      if (existingFilter.region.type === 'bounds' && existingFilter.region.bounds) {
        setBounds(existingFilter.region.bounds);
      } else if (existingFilter.region.type === 'radius' && existingFilter.region.center) {
        setCenter(existingFilter.region.center);
        if (existingFilter.region.radiusKm) {
          setRadius(existingFilter.region.radiusKm);
        }
      }
    }
  }, [existingFilter]);
  
  // Apply filter when values change
  const applyFilter = () => {
    if (filterType === 'bounds') {
      addFilter({
        type: 'geographic',
        region: {
          type: 'bounds',
          bounds
        }
      });
    } else {
      addFilter({
        type: 'geographic',
        region: {
          type: 'radius',
          center,
          radiusKm: radius
        }
      });
    }
  };
  
  return (
    <div className="geographic-filter mb-4">
      <h3 className="text-sm font-medium text-neutral-light mb-3">Geographic Filter</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 text-xs rounded ${
              filterType === 'bounds' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium'
            }`}
            onClick={() => setFilterType('bounds')}
          >
            Bounding Box
          </button>
          
          <button
            className={`px-3 py-1.5 text-xs rounded ${
              filterType === 'radius' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium'
            }`}
            onClick={() => setFilterType('radius')}
          >
            Radius
          </button>
        </div>
        
        {filterType === 'bounds' ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-medium">North</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={bounds.north}
                  onChange={e => {
                    setBounds({...bounds, north: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-medium">South</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={bounds.south}
                  onChange={e => {
                    setBounds({...bounds, south: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-medium">East</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={bounds.east}
                  onChange={e => {
                    setBounds({...bounds, east: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-medium">West</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={bounds.west}
                  onChange={e => {
                    setBounds({...bounds, west: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-medium">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={center.latitude}
                  onChange={e => {
                    setCenter({...center, latitude: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
              <div>
                <label className="text-xs text-neutral-medium">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full mt-1 p-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-neutral-light"
                  value={center.longitude}
                  onChange={e => {
                    setCenter({...center, longitude: parseFloat(e.target.value) || 0});
                  }}
                  onBlur={applyFilter}
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-neutral-medium">Radius (km)</label>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                className="w-full mt-1"
                value={radius}
                onChange={e => {
                  setRadius(parseInt(e.target.value));
                  applyFilter();
                }}
              />
              <div className="text-xs text-neutral-light text-right mt-1">
                {radius} km
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
