"use client";

import { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import { EntityType } from '@/app/models/data-types';

export default function EntityTypeFilter() {
  const { filters, addFilter } = useFilters();
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  
  // Find existing entity type filter
  const existingFilter = filters.find(
    filter => filter.type === 'entityType'
  ) as any;
  
  // Initialize selected types from existing filter
  useEffect(() => {
    if (existingFilter) {
      setSelectedTypes(existingFilter.entityTypes);
    }
  }, [existingFilter]);
  
  // Handle type selection changes
  const handleTypeChange = (type: EntityType, selected: boolean) => {
    const newSelectedTypes = selected
      ? [...selectedTypes, type]
      : selectedTypes.filter(t => t !== type);
    
    setSelectedTypes(newSelectedTypes);
    
    // Apply filter if there are selected types, otherwise don't add a filter
    if (newSelectedTypes.length > 0) {
      addFilter({
        type: 'entityType',
        entityTypes: newSelectedTypes
      });
    }
  };

  // Get entity type label
  const getEntityTypeLabel = (type: EntityType): string => {
    switch(type) {
      case EntityType.PERSON: return 'Person';
      case EntityType.ORGANIZATION: return 'Organization';
      case EntityType.OBJECT: return 'Object';
      case EntityType.LOCATION: return 'Location';
      case EntityType.DIGITAL: return 'Digital';
      case EntityType.CUSTOM: return 'Custom';
      default: return type;
    }
  };
  
  return (
    <div className="entity-type-filter mb-4">
      <h3 className="text-sm font-medium text-neutral-light mb-3">Entity Types</h3>
      
      <div className="space-y-2">
        {Object.values(EntityType).map(type => (
          <div key={type} className="flex items-center">
            <input
              type="checkbox"
              id={`entity-type-${type}`}
              className="mr-2 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent"
              checked={selectedTypes.includes(type)}
              onChange={e => handleTypeChange(type, e.target.checked)}
            />
            <label 
              htmlFor={`entity-type-${type}`}
              className="text-sm text-neutral-light"
            >
              {getEntityTypeLabel(type)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
