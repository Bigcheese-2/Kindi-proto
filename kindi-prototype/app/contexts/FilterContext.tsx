"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { EntityType, EventType, LocationType } from '@/app/models/data-types';
import { 
  AdvancedFilter, 
  FilterGroup, 
  FilterCondition, 
  SavedFilter as AdvancedSavedFilter,
  generateFilterId,
  createFilterGroup,
  updateFilterGroup,
  updateFilterCondition,
  removeFilterItem
} from '@/app/models/filter-types';

// Basic Filter types
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

// Filter difference for comparison
export interface FilterDifference {
  type: 'added' | 'removed' | 'changed';
  path: string;
  oldValue?: any;
  newValue?: any;
}

// Extended filter context type
export interface FilterContextType {
  // Basic filtering
  filters: Filter[];
  addFilter: (filter: Omit<Filter, 'id'>) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  savedFilters: SavedFilter[];
  saveFilter: (name: string, filters: Filter[]) => void;
  applySavedFilter: (id: string) => void;
  deleteSavedFilter: (id: string) => void;
  
  // Advanced filtering
  advancedFilter: AdvancedFilter | null;
  setAdvancedFilter: (filter: AdvancedFilter | null) => void;
  advancedSavedFilters: AdvancedSavedFilter[];
  saveAdvancedFilter: (name: string, description?: string, category?: string) => string;
  updateSavedAdvancedFilter: (id: string, updates: Partial<AdvancedSavedFilter>) => void;
  deleteSavedAdvancedFilter: (id: string) => void;
  applySavedAdvancedFilter: (id: string) => void;
  filterHistory: AdvancedFilter[];
  historyPosition: number;
  goBack: () => void;
  goForward: () => void;
  exportFilter: (id?: string) => string;
  importFilter: (filterJson: string) => void;
  compareFilters: (filter1: AdvancedFilter, filter2: AdvancedFilter) => FilterDifference[];
}

// Import filter utilities
import { compareFilters as compareFiltersUtil } from '@/app/lib/filter/filterCompare';
import { 
  saveFilterToStorage,
  updateSavedFilter,
  deleteSavedFilter as deleteAdvancedFilter,
  getSavedFilters,
  getSavedFilterById,
  addFilterToHistory,
  exportFilterToJson,
  importFilterFromJson
} from '@/app/lib/filter/filterStorage';

// Create the context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Use client-side only features
  const isClient = typeof window !== 'undefined';
  // Basic filtering state
  const [filters, setFilters] = useState<Filter[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  
  // Advanced filtering state
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter | null>(null);
  const [advancedSavedFilters, setAdvancedSavedFilters] = useState<AdvancedSavedFilter[]>([]);
  const [filterHistory, setFilterHistory] = useState<AdvancedFilter[]>([]);
  const [historyPosition, setHistoryPosition] = useState<number>(-1);
  
  // Load saved advanced filters on mount
  useEffect(() => {
    if (isClient) {
      const loadedFilters = getSavedFilters();
      setAdvancedSavedFilters(loadedFilters);
    }
  }, [isClient]);
  
  // Update history when advanced filter changes
  useEffect(() => {
    if (advancedFilter) {
      const { newHistory, newPosition } = addFilterToHistory(
        advancedFilter,
        historyPosition,
        filterHistory
      );
      
      setFilterHistory(newHistory);
      setHistoryPosition(newPosition);
    }
  }, [advancedFilter, historyPosition, filterHistory]);
  
  // Generate a unique ID for each filter
  const generateId = () => {
    return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Basic filtering methods
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
  
  // Advanced filtering methods
  const saveAdvancedFilter = useCallback((name: string, description?: string, category?: string): string => {
    if (!advancedFilter) {
      throw new Error('No advanced filter to save');
    }
    
    const id = saveFilterToStorage(name, advancedFilter, description, category);
    
    // Update local state
    const newSavedFilter = {
      id,
      name,
      description,
      category,
      filter: advancedFilter,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setAdvancedSavedFilters(prev => [...prev, newSavedFilter]);
    
    return id;
  }, [advancedFilter]);
  
  const updateSavedAdvancedFilter = useCallback((id: string, updates: Partial<AdvancedSavedFilter>) => {
    const updatedFilter = updateSavedFilter(id, updates);
    
    if (updatedFilter) {
      setAdvancedSavedFilters(prev => 
        prev.map(filter => filter.id === id ? updatedFilter : filter)
      );
    }
  }, []);
  
  const deleteSavedAdvancedFilter = useCallback((id: string) => {
    const result = deleteAdvancedFilter(id);
    
    if (result) {
      setAdvancedSavedFilters(prev => prev.filter(filter => filter.id !== id));
    }
    
    return result;
  }, []);
  
  const applySavedAdvancedFilter = useCallback((id: string) => {
    const savedFilter = getSavedFilterById(id);
    
    if (savedFilter) {
      setAdvancedFilter(savedFilter.filter);
    }
  }, []);
  
  const goBack = useCallback(() => {
    if (historyPosition > 0) {
      const newPosition = historyPosition - 1;
      setHistoryPosition(newPosition);
      setAdvancedFilter(filterHistory[newPosition]);
    }
  }, [historyPosition, filterHistory]);
  
  const goForward = useCallback(() => {
    if (historyPosition < filterHistory.length - 1) {
      const newPosition = historyPosition + 1;
      setHistoryPosition(newPosition);
      setAdvancedFilter(filterHistory[newPosition]);
    }
  }, [historyPosition, filterHistory]);
  
  const exportFilter = useCallback((id?: string): string => {
    if (id) {
      const savedFilter = getSavedFilterById(id);
      
      if (!savedFilter) {
        throw new Error(`Filter with ID ${id} not found`);
      }
      
      return exportFilterToJson(savedFilter.filter);
    }
    
    if (!advancedFilter) {
      throw new Error('No active filter to export');
    }
    
    return exportFilterToJson(advancedFilter);
  }, [advancedFilter]);
  
  const importFilter = useCallback((filterJson: string) => {
    try {
      const importedFilter = importFilterFromJson(filterJson);
      setAdvancedFilter(importedFilter);
    } catch (error) {
      console.error('Error importing filter:', error);
      throw error;
    }
  }, []);
  
  const compareFilters = useCallback((filter1: AdvancedFilter, filter2: AdvancedFilter): FilterDifference[] => {
    return compareFiltersUtil(filter1, filter2);
  }, []);
  
  const value = {
    // Basic filtering
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    savedFilters,
    saveFilter,
    applySavedFilter,
    deleteSavedFilter,
    
    // Advanced filtering
    advancedFilter,
    setAdvancedFilter,
    advancedSavedFilters,
    saveAdvancedFilter,
    updateSavedAdvancedFilter,
    deleteSavedAdvancedFilter,
    applySavedAdvancedFilter,
    filterHistory,
    historyPosition,
    goBack,
    goForward,
    exportFilter,
    importFilter,
    compareFilters
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
