"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EntityType, EventType, LocationType } from '@/app/models/data-types';

// Filter types
export interface EntityTypeFilter {
  type: 'entityType';
  id: string;
  entityTypes: EntityType[];
}

export interface TimeRangeFilter {
  type: 'timeRange';
  id: string;
  startTime: string | null;
  endTime: string | null;
}

export interface GeographicFilter {
  type: 'geographic';
  id: string;
  region: {
    type: 'bounds' | 'radius';
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    center?: {
      latitude: number;
      longitude: number;
    };
    radiusKm?: number;
  };
}

export type Filter = EntityTypeFilter | TimeRangeFilter | GeographicFilter;

export interface SavedFilter {
  id: string;
  name: string;
  filters: Filter[];
}

// Filter context type
export interface FilterContextType {
  filters: Filter[];
  addFilter: (filter: Omit<Filter, 'id'>) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  savedFilters: SavedFilter[];
  saveFilter: (name: string, filters: Filter[]) => void;
  applySavedFilter: (id: string) => void;
  deleteSavedFilter: (id: string) => void;
}

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  
  // Generate a unique ID for each filter
  const generateId = () => {
    return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  const addFilter = useCallback((filter: Omit<Filter, 'id'>) => {
    const newFilter = {
      ...filter,
      id: generateId()
    } as Filter;
    
    setFilters(prev => {
      // Remove any existing filter of the same type
      const filteredPrev = prev.filter(f => f.type !== filter.type);
      return [...filteredPrev, newFilter];
    });
  }, []);
  
  const removeFilter = useCallback((id: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== id));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);
  
  const saveFilter = useCallback((name: string, filtersToSave: Filter[]) => {
    const newSavedFilter = {
      id: generateId(),
      name,
      filters: filtersToSave
    };
    
    setSavedFilters(prev => [...prev, newSavedFilter]);
  }, []);
  
  const applySavedFilter = useCallback((id: string) => {
    const savedFilter = savedFilters.find(sf => sf.id === id);
    if (savedFilter) {
      setFilters(savedFilter.filters);
    }
  }, [savedFilters]);
  
  const deleteSavedFilter = useCallback((id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  }, []);
  
  const value = {
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    savedFilters,
    saveFilter,
    applySavedFilter,
    deleteSavedFilter
  };
  
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
