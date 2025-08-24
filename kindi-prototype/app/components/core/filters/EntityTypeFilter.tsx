'use client';

import { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { useData } from '@/app/contexts/DataContext';
import { EntityType } from '@/app/models/data-types';

export default function EntityTypeFilter() {
  const { filters, addFilter, removeFilter } = useFilters();
  const { selectEntity, clearSelection } = useSelection();
  const { currentDataset } = useData();
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);

  // Find existing entity type filter
  const existingFilter = filters.find(filter => filter.type === 'entityType') as
    | { type: 'entityType'; id: string; entityTypes: EntityType[] }
    | undefined;

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

    // Apply filter if there are selected types, otherwise remove the filter
    if (newSelectedTypes.length > 0) {
      addFilter({
        type: 'entityType',
        entityTypes: newSelectedTypes,
      });
    } else {
      // Remove entity type filter if no types are selected
      if (existingFilter) {
        removeFilter(existingFilter.id);
      }
    }
  };

  // Handle clicking on entity type for automatic search and selection
  const handleEntityTypeClick = (type: EntityType) => {
    if (!currentDataset) return;

    // Find all entities of this type
    const entitiesOfType = currentDataset.entities.filter(entity => entity.type === type);

    if (entitiesOfType.length === 0) return;

    // Clear existing selections first
    clearSelection();

    // Apply entity type filter to show only entities of this type
    addFilter({
      type: 'entityType',
      entityTypes: [type],
    });

    // Update checkbox state to reflect the filter
    setSelectedTypes([type]);

    // Select the first entity of this type (or a prominent one)
    // This will automatically trigger updates to all visualization panels
    const entityToSelect = entitiesOfType[0]; // You could add logic to pick the most important one
    setTimeout(() => {
      selectEntity(entityToSelect.id, true, 'graph'); // Using 'graph' as source
    }, 100); // Small delay to let filter propagate first
  };

  // Get count of entities for each type
  const getEntityCount = (type: EntityType): number => {
    if (!currentDataset) return 0;
    return currentDataset.entities.filter(entity => entity.type === type).length;
  };

  // Get entity type label
  const getEntityTypeLabel = (type: EntityType): string => {
    switch (type) {
      case EntityType.PERSON:
        return 'Person';
      case EntityType.ORGANIZATION:
        return 'Organization';
      case EntityType.OBJECT:
        return 'Object';
      case EntityType.LOCATION:
        return 'Location';
      case EntityType.DIGITAL:
        return 'Digital';
      case EntityType.CUSTOM:
        return 'Custom';
      default:
        return type;
    }
  };

  return (
    <div className="entity-type-filter mb-4">
      <h3 className="text-sm font-medium text-neutral-light mb-3">Entity Types</h3>

      <div className="space-y-3">
        {Object.values(EntityType).map(type => {
          const entityCount = getEntityCount(type);
          const isSelected = selectedTypes.includes(type);

          return (
            <div key={type} className="space-y-2">
              {/* Clickable entity type button for automatic search */}
              <button
                onClick={() => handleEntityTypeClick(type)}
                disabled={entityCount === 0}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 border ${
                  entityCount === 0
                    ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                    : isSelected
                      ? 'bg-accent bg-opacity-20 border-accent text-accent hover:bg-opacity-30'
                      : 'bg-secondary border-secondary hover:border-accent hover:bg-opacity-80 text-neutral-light'
                }`}
                title={
                  entityCount === 0
                    ? 'No entities of this type'
                    : `Click to search and filter ${entityCount} ${getEntityTypeLabel(type).toLowerCase()}${entityCount !== 1 ? 's' : ''}`
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      entityCount === 0
                        ? 'bg-gray-600'
                        : isSelected
                          ? 'bg-accent'
                          : 'bg-neutral-medium'
                    }`}
                  />
                  <span className="text-sm font-medium">{getEntityTypeLabel(type)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      entityCount === 0
                        ? 'bg-gray-700 text-gray-500'
                        : isSelected
                          ? 'bg-accent bg-opacity-30 text-accent'
                          : 'bg-primary text-neutral-medium'
                    }`}
                  >
                    {entityCount}
                  </span>
                  {entityCount > 0 && (
                    <svg
                      className={`w-4 h-4 ${isSelected ? 'text-accent' : 'text-neutral-medium'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {/* Traditional checkbox for manual filtering */}
              <div className="flex items-center pl-3">
                <input
                  type="checkbox"
                  id={`entity-type-checkbox-${type}`}
                  className="mr-2 rounded bg-gray-700 border-gray-600 text-accent focus:ring-accent"
                  checked={isSelected}
                  onChange={e => handleTypeChange(type, e.target.checked)}
                  disabled={entityCount === 0}
                />
                <label
                  htmlFor={`entity-type-checkbox-${type}`}
                  className={`text-xs ${entityCount === 0 ? 'text-gray-500' : 'text-neutral-medium'}`}
                >
                  Manual filter mode
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear all button */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-secondary">
          <button
            onClick={() => {
              setSelectedTypes([]);
              clearSelection();
              if (existingFilter) {
                removeFilter(existingFilter.id);
              }
            }}
            className="w-full text-xs text-neutral-medium hover:text-accent transition-colors flex items-center justify-center space-x-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Clear Entity Type Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
