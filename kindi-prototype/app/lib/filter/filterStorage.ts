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
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('savedAdvancedFilters', JSON.stringify(updatedFilters));
  }
  
  return id;
};

/**
 * Update a saved filter in local storage
 * @param id Filter ID
 * @param updates Updates to apply
 * @returns Updated filter or undefined if not found
 */
export const updateSavedFilter = (
  id: string,
  updates: Partial<SavedFilter>
): SavedFilter | undefined => {
  // Get existing filters
  const existingFilters = getSavedFilters();
  
  // Find the filter to update
  const filterIndex = existingFilters.findIndex(f => f.id === id);
  
  if (filterIndex === -1) {
    return undefined;
  }
  
  // Update the filter
  const updatedFilter = {
    ...existingFilters[filterIndex],
    ...updates,
    updatedAt: Date.now()
  };
  
  // Replace the filter in the array
  existingFilters[filterIndex] = updatedFilter;
  
  // Save to local storage
  localStorage.setItem('savedAdvancedFilters', JSON.stringify(existingFilters));
  
  return updatedFilter;
};

/**
 * Delete a saved filter from local storage
 * @param id Filter ID
 * @returns True if deleted, false if not found
 */
export const deleteSavedFilter = (id: string): boolean => {
  // Get existing filters
  const existingFilters = getSavedFilters();
  
  // Filter out the one to delete
  const updatedFilters = existingFilters.filter(f => f.id !== id);
  
  // If no filter was removed, return false
  if (updatedFilters.length === existingFilters.length) {
    return false;
  }
  
  // Save to local storage
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('savedAdvancedFilters', JSON.stringify(updatedFilters));
  }
  
  return true;
};

/**
 * Get saved filters from local storage
 * @returns Array of saved filters
 */
export const getSavedFilters = (): SavedFilter[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const filters = localStorage.getItem('savedAdvancedFilters');
      return filters ? JSON.parse(filters) : [];
    }
    return [];
  } catch (error) {
    console.error('Error reading saved filters:', error);
    return [];
  }
};

/**
 * Get a saved filter by ID
 * @param id Filter ID
 * @returns Saved filter or undefined if not found
 */
export const getSavedFilterById = (id: string): SavedFilter | undefined => {
  const filters = getSavedFilters();
  return filters.find(f => f.id === id);
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
    
    // Validate filter structure
    if (!validateFilterStructure(filter)) {
      throw new Error('Invalid filter structure');
    }
    
    return filter;
  } catch (error) {
    console.error('Error importing filter:', error);
    throw new Error('Failed to import filter: Invalid JSON format');
  }
};

/**
 * Validate filter structure
 * @param filter Filter to validate
 * @returns True if valid, false otherwise
 */
const validateFilterStructure = (filter: any): boolean => {
  // Basic validation
  if (!filter || typeof filter !== 'object') {
    return false;
  }
  
  // Check required fields
  if (!filter.id || !filter.type) {
    return false;
  }
  
  // Validate based on type
  if (filter.type === 'group') {
    if (!filter.operator || !Array.isArray(filter.conditions)) {
      return false;
    }
    
    // Recursively validate conditions
    return filter.conditions.every(validateFilterStructure);
  } else {
    // Validate condition
    return (
      filter.operator !== undefined &&
      filter.field !== undefined &&
      filter.value !== undefined
    );
  }
};
