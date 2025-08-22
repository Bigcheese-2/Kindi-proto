"use client";

import { AdvancedFilter, SavedFilter } from '@/app/models/filter-types';

/**
 * Save filter to local storage
 * @param name Filter name
 * @param filter Filter configuration
 * @param description Optional description
 * @param category Optional category
 * @returns ID of the saved filter
 */
export const saveFilterToStorage = (
  name: string,
  filter: AdvancedFilter,
  description?: string,
  category?: string
): string => {
  // Generate ID if new filter
  const id = `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const savedFilter: SavedFilter = {
    id,
    name,
    description,
    category,
    filter,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  // Get existing filters
  const existingFilters = getSavedFilters();
  
  // Add new filter
  const updatedFilters = [...existingFilters, savedFilter];
  
  // Save to local storage
  localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
  
  return id;
};

/**
 * Get saved filters from local storage
 * @returns Array of saved filters
 */
export const getSavedFilters = (): SavedFilter[] => {
  try {
    const filters = localStorage.getItem('savedFilters');
    return filters ? JSON.parse(filters) : [];
  } catch (error) {
    console.error('Error reading saved filters:', error);
    return [];
  }
};

/**
 * Update an existing saved filter
 * @param id Filter ID
 * @param updates Filter updates
 */
export const updateSavedFilter = (
  id: string,
  updates: Partial<SavedFilter>
): void => {
  const existingFilters = getSavedFilters();
  const filterIndex = existingFilters.findIndex(f => f.id === id);
  
  if (filterIndex === -1) {
    throw new Error(`Filter not found: ${id}`);
  }
  
  const updatedFilter = {
    ...existingFilters[filterIndex],
    ...updates,
    updatedAt: Date.now()
  };
  
  const updatedFilters = [
    ...existingFilters.slice(0, filterIndex),
    updatedFilter,
    ...existingFilters.slice(filterIndex + 1)
  ];
  
  localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
};

/**
 * Delete a saved filter
 * @param id Filter ID
 */
export const deleteSavedFilter = (id: string): void => {
  const existingFilters = getSavedFilters();
  const updatedFilters = existingFilters.filter(f => f.id !== id);
  
  localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
};

/**
 * Get a saved filter by ID
 * @param id Filter ID
 * @returns Saved filter or undefined if not found
 */
export const getSavedFilterById = (id: string): SavedFilter | undefined => {
  const existingFilters = getSavedFilters();
  return existingFilters.find(f => f.id === id);
};

/**
 * Export filter to JSON string
 * @param filter Filter to export
 * @returns JSON string representation
 */
export const exportFilterToJson = (filter: AdvancedFilter): string => {
  return JSON.stringify(filter, null, 2);
};

/**
 * Import filter from JSON string
 * @param json JSON string representation
 * @returns Imported filter
 */
export const importFilterFromJson = (json: string): AdvancedFilter => {
  try {
    const filter = JSON.parse(json);
    return filter;
  } catch (error) {
    console.error('Error importing filter:', error);
    throw new Error('Failed to import filter: Invalid JSON format');
  }
};

/**
 * Add filter state to history
 * @param filter Current filter state
 * @param historyPosition Current position in history
 * @param filterHistory Current filter history
 * @returns Updated history and position
 */
export const addFilterToHistory = (
  filter: AdvancedFilter,
  historyPosition: number,
  filterHistory: AdvancedFilter[]
): {
  newHistory: AdvancedFilter[];
  newPosition: number;
} => {
  // Remove any future history if we're not at the end
  const truncatedHistory = filterHistory.slice(0, historyPosition + 1);
  
  // Add new filter state
  const newHistory = [...truncatedHistory, filter];
  
  // Limit history size
  if (newHistory.length > 50) {
    newHistory.shift();
  }
  
  return {
    newHistory,
    newPosition: newHistory.length - 1
  };
};
