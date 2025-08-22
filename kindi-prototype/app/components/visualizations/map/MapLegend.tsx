'use client';

import React from 'react';
import { EntityType } from '../../../models/data-types';

interface MapLegendProps {
  className?: string;
}

// Get color for entity type (for map markers)
const getColorForEntityType = (entityType: EntityType): string => {
  const colorMap: Record<EntityType, string> = {
    [EntityType.PERSON]: '#3b82f6',
    [EntityType.ORGANIZATION]: '#10b981',
    [EntityType.LOCATION]: '#f59e0b',
    [EntityType.OBJECT]: '#ef4444',
    [EntityType.DIGITAL]: '#8b5cf6',
    [EntityType.CUSTOM]: '#6b7280',
  };
  return colorMap[entityType] || colorMap[EntityType.CUSTOM];
};

// Human-readable labels for entity types
const getEntityTypeLabel = (entityType: EntityType): string => {
  const labelMap: Record<EntityType, string> = {
    [EntityType.PERSON]: 'Person',
    [EntityType.ORGANIZATION]: 'Organization',
    [EntityType.LOCATION]: 'Location',
    [EntityType.OBJECT]: 'Object',
    [EntityType.DIGITAL]: 'Digital',
    [EntityType.CUSTOM]: 'Custom',
  };
  return labelMap[entityType] || 'Unknown';
};

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  const entityTypes = Object.values(EntityType);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Location Types</h3>

      <div className="space-y-2">
        {entityTypes.map(entityType => (
          <div key={entityType} className="flex items-center space-x-2">
            <div className="relative">
              {/* Map marker icon */}
              <svg width="16" height="20" viewBox="0 0 24 30" className="drop-shadow-sm">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill={getColorForEntityType(entityType)}
                  stroke="#fff"
                  strokeWidth="1"
                />
                <circle cx="12" cy="9" r="3" fill="#fff" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">{getEntityTypeLabel(entityType)}</span>
          </div>
        ))}
      </div>

      {/* Marker States */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-6">Marker States</h3>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <svg width="16" height="20" viewBox="0 0 24 30" className="drop-shadow-sm">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#ef4444"
              stroke="#dc2626"
              strokeWidth="2"
            />
            <circle cx="12" cy="9" r="3" fill="#fff" />
          </svg>
          <span className="text-sm text-gray-600">Selected</span>
        </div>

        <div className="flex items-center space-x-2">
          <svg width="16" height="20" viewBox="0 0 24 30" className="drop-shadow-sm">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="#6b7280"
              stroke="#4b5563"
              strokeWidth="1"
            />
            <circle cx="12" cy="9" r="3" fill="#fff" />
          </svg>
          <span className="text-sm text-gray-600">Default</span>
        </div>
      </div>

      {/* Map Information */}
      <h3 className="text-sm font-semibold text-gray-700 mb-2 mt-6">Controls</h3>
      <div className="text-xs text-gray-500 space-y-1">
        <div>• Click markers for details</div>
        <div>• Use controls to zoom and navigate</div>
        <div>• Switch between map layers</div>
      </div>
    </div>
  );
};

export default MapLegend;
