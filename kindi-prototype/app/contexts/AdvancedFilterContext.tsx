"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AdvancedFilter, 
  FilterCondition, 
  FilterGroup, 
  SavedFilter, 
  generateId 
} from '@/app/models/filter-types';
import { 
  saveFilterToStorage, 
  getSavedFilters, 
  updateSavedFilter, 
  deleteSavedFilter,
  getSavedFilterById,
  exportFilterToJson,
  importFilterFromJson,
  addFilterToHistory
} from '@/app/lib/filter/filterStorage';

interface AdvancedFilterContextType {
  // Current filter state
  advancedFilter: AdvancedFilter | null;
  setAdvancedFilter: (filter: AdvancedFilter | null) => void;
  
  // Saved filters
  savedFilters: SavedFilter[];
  saveFilter: (name: string, description?: string, category?: string) => string;
  updateSavedFilter: (id: string, updates: Partial<SavedFilter>) => void;
  deleteSavedFilter: (id: string) => void;
  applySavedFilter: (id: string) => void;
  
  // Filter history
  filterHistory: AdvancedFilter[];
  historyPosition: number;
  goBack: () => void;
  goForward: () => void;
  
  // Export/Import
  exportFilter: (id?: string) => string;
  importFilter: (filterJson: string) => void;
  
  // Filter creation
  createEmptyFilter: () => AdvancedFilter;
  addCondition: (groupId: string, condition?: Partial<FilterCondition>) => void;
  addGroup: (parentGroupId: string) => void;
  updateCondition: (conditionId: string, updates: Partial<FilterCondition>) => void;
  updateGroupOperator: (groupId: string, operator: 'and' | 'or') => void;
  removeItem: (itemId: string) => void;
}

const AdvancedFilterContext = createContext<AdvancedFilterContextType | undefined>(undefined);

export const AdvancedFilterProvider = ({ children }: { children: ReactNode }) => {
  // Current filter state
  const [advancedFilter, setAdvancedFilterState] = useState<AdvancedFilter | null>(null);
  
  // Saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  
  // Filter history
  const [filterHistory, setFilterHistory] = useState<AdvancedFilter[]>([]);
  const [historyPosition, setHistoryPosition] = useState<number>(-1);
  
  // Load saved filters on mount
  useEffect(() => {
    setSavedFilters(getSavedFilters());
  }, []);
  
  // Set filter with history tracking
  const setAdvancedFilter = (filter: AdvancedFilter | null) => {
    if (filter) {
      setAdvancedFilterState(filter);
      
      // Add to history if different from current
      if (
        !advancedFilter || 
        JSON.stringify(filter) !== JSON.stringify(advancedFilter)
      ) {
        const { newHistory, newPosition } = addFilterToHistory(
          filter,
          historyPosition,
          filterHistory
        );
        
        setFilterHistory(newHistory);
        setHistoryPosition(newPosition);
      }
    } else {
      setAdvancedFilterState(null);
    }
  };
  
  // Save current filter
  const saveFilter = (name: string, description?: string, category?: string): string => {
    if (!advancedFilter) {
      throw new Error('No filter to save');
    }
    
    const id = saveFilterToStorage(name, advancedFilter, description, category);
    setSavedFilters(getSavedFilters());
    return id;
  };
  
  // Update saved filter
  const handleUpdateSavedFilter = (id: string, updates: Partial<SavedFilter>) => {
    updateSavedFilter(id, updates);
    setSavedFilters(getSavedFilters());
  };
  
  // Delete saved filter
  const handleDeleteSavedFilter = (id: string) => {
    deleteSavedFilter(id);
    setSavedFilters(getSavedFilters());
  };
  
  // Apply saved filter
  const applySavedFilter = (id: string) => {
    const filter = getSavedFilterById(id);
    if (filter) {
      setAdvancedFilter(filter.filter);
    }
  };
  
  // Go back in history
  const goBack = () => {
    if (historyPosition > 0) {
      setHistoryPosition(historyPosition - 1);
      setAdvancedFilterState(filterHistory[historyPosition - 1]);
    }
  };
  
  // Go forward in history
  const goForward = () => {
    if (historyPosition < filterHistory.length - 1) {
      setHistoryPosition(historyPosition + 1);
      setAdvancedFilterState(filterHistory[historyPosition + 1]);
    }
  };
  
  // Export filter
  const exportFilter = (id?: string): string => {
    if (id) {
      const filter = getSavedFilterById(id);
      if (filter) {
        return exportFilterToJson(filter.filter);
      }
      throw new Error(`Filter not found: ${id}`);
    }
    
    if (!advancedFilter) {
      throw new Error('No filter to export');
    }
    
    return exportFilterToJson(advancedFilter);
  };
  
  // Import filter
  const importFilter = (filterJson: string) => {
    try {
      const filter = importFilterFromJson(filterJson);
      setAdvancedFilter(filter);
    } catch (error) {
      console.error('Error importing filter:', error);
      throw error;
    }
  };
  
  // Create empty filter
  const createEmptyFilter = (): AdvancedFilter => {
    const emptyFilter: FilterGroup = {
      id: generateId(),
      type: 'group',
      operator: 'and',
      conditions: []
    };
    
    setAdvancedFilter(emptyFilter);
    return emptyFilter;
  };
  
  // Add condition to group
  const addCondition = (groupId: string, condition?: Partial<FilterCondition>) => {
    if (!advancedFilter) {
      return;
    }
    
    const newCondition: FilterCondition = {
      id: generateId(),
      type: 'entityType',
      operator: 'equals',
      field: 'type',
      value: null,
      ...condition
    };
    
    const updatedFilter = updateFilterGroup(
      advancedFilter, 
      groupId, 
      group => ({
        ...group,
        conditions: [...group.conditions, newCondition]
      })
    );
    
    setAdvancedFilter(updatedFilter);
  };
  
  // Add group to parent group
  const addGroup = (parentGroupId: string) => {
    if (!advancedFilter) {
      return;
    }
    
    const newGroup: FilterGroup = {
      id: generateId(),
      type: 'group',
      operator: 'and',
      conditions: []
    };
    
    const updatedFilter = updateFilterGroup(
      advancedFilter,
      parentGroupId,
      group => ({
        ...group,
        conditions: [...group.conditions, newGroup]
      })
    );
    
    setAdvancedFilter(updatedFilter);
  };
  
  // Update condition
  const updateCondition = (
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => {
    if (!advancedFilter) {
      return;
    }
    
    const updatedFilter = updateFilterCondition(
      advancedFilter,
      conditionId,
      condition => ({
        ...condition,
        ...updates
      })
    );
    
    setAdvancedFilter(updatedFilter);
  };
  
  // Update group operator
  const updateGroupOperator = (groupId: string, operator: 'and' | 'or') => {
    if (!advancedFilter) {
      return;
    }
    
    const updatedFilter = updateFilterGroup(
      advancedFilter,
      groupId,
      group => ({
        ...group,
        operator
      })
    );
    
    setAdvancedFilter(updatedFilter);
  };
  
  // Remove item (condition or group)
  const removeItem = (itemId: string) => {
    if (!advancedFilter) {
      return;
    }
    
    const updatedFilter = removeFilterItem(advancedFilter, itemId);
    setAdvancedFilter(updatedFilter);
  };
  
  // Helper functions for updating filters
  const updateFilterGroup = (
    filter: AdvancedFilter,
    groupId: string,
    updateFn: (group: FilterGroup) => FilterGroup
  ): AdvancedFilter => {
    if (filter.id === groupId && filter.type === 'group') {
      return updateFn(filter as FilterGroup);
    }
    
    if (filter.type === 'group') {
      return {
        ...filter,
        conditions: filter.conditions.map(condition => 
          updateFilterGroup(condition, groupId, updateFn)
        )
      };
    }
    
    return filter;
  };
  
  const updateFilterCondition = (
    filter: AdvancedFilter,
    conditionId: string,
    updateFn: (condition: FilterCondition) => FilterCondition
  ): AdvancedFilter => {
    if (filter.id === conditionId && filter.type !== 'group') {
      return updateFn(filter as FilterCondition);
    }
    
    if (filter.type === 'group') {
      return {
        ...filter,
        conditions: filter.conditions.map(condition => 
          updateFilterCondition(condition, conditionId, updateFn)
        )
      };
    }
    
    return filter;
  };
  
  const removeFilterItem = (
    filter: AdvancedFilter,
    itemId: string
  ): AdvancedFilter => {
    if (filter.type === 'group') {
      return {
        ...filter,
        conditions: filter.conditions
          .filter(condition => condition.id !== itemId)
          .map(condition => removeFilterItem(condition, itemId))
      };
    }
    
    return filter;
  };
  
  return (
    <AdvancedFilterContext.Provider
      value={{
        advancedFilter,
        setAdvancedFilter,
        savedFilters,
        saveFilter,
        updateSavedFilter: handleUpdateSavedFilter,
        deleteSavedFilter: handleDeleteSavedFilter,
        applySavedFilter,
        filterHistory,
        historyPosition,
        goBack,
        goForward,
        exportFilter,
        importFilter,
        createEmptyFilter,
        addCondition,
        addGroup,
        updateCondition,
        updateGroupOperator,
        removeItem
      }}
    >
      {children}
    </AdvancedFilterContext.Provider>
  );
};

export const useAdvancedFilter = (): AdvancedFilterContextType => {
  const context = useContext(AdvancedFilterContext);
  if (context === undefined) {
    throw new Error('useAdvancedFilter must be used within an AdvancedFilterProvider');
  }
  return context;
};
