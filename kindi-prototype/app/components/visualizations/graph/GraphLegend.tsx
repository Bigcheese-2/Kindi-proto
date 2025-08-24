'use client';

import React from 'react';
import { EntityType } from '../../../models/data-types';

interface GraphLegendProps {
  className?: string;
}

// Color mapping for entity types (matching GraphComponent)
const getColorForEntityType = (entityType: EntityType): string => {
  const colorMap: Record<EntityType, string> = {
    [EntityType.PERSON]: '#4285f4',
    [EntityType.ORGANIZATION]: '#34a853',
    [EntityType.LOCATION]: '#fbbc05',
    [EntityType.OBJECT]: '#ea4335',
    [EntityType.DIGITAL]: '#9c27b0',
    [EntityType.CUSTOM]: '#607d8b',
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

export const GraphLegend: React.FC<GraphLegendProps> = ({ className = '' }) => {
  const entityTypes = Object.values(EntityType);

  return (
    <div className={`bg-secondary rounded-md p-2.5 shadow-lg opacity-90 ${className}`}>
      <h3 className="text-xs font-semibold text-neutral-light mb-1.5">Entity Types</h3>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {entityTypes.map(entityType => (
          <div key={entityType} className="flex items-center space-x-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getColorForEntityType(entityType) }}
            />
            <span className="text-xs text-neutral-light">{getEntityTypeLabel(entityType)}</span>
          </div>
        ))}
      </div>

      {/* Relationship Legend */}
      <h3 className="text-xs font-semibold text-neutral-light mb-1.5 mt-3">Relationships</h3>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-0.5 bg-neutral-light"></div>
          <span className="text-xs text-neutral-light">Directed</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div
            className="w-5 h-0.5"
            style={{
              borderTop: '1px dashed #A0AEC0',
              backgroundColor: 'transparent',
            }}
          ></div>
          <span className="text-xs text-neutral-light">Undirected</span>
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
