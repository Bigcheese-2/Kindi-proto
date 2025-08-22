"use client";

/**
 * Advanced filter condition types
 */
export interface FilterCondition {
  id: string;
  type: 'entityType' | 'timeRange' | 'geographic' | 'attribute' | 'relationship';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  field: string;
  value: any;
  negated?: boolean;
}

/**
 * Advanced filter group types
 */
export interface FilterGroup {
  id: string;
  type: 'group';
  operator: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

/**
 * Combined advanced filter type
 */
export type AdvancedFilter = FilterCondition | FilterGroup;

/**
 * Saved filter type
 */
export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  category?: string;
  filter: AdvancedFilter;
  createdAt: number;
  updatedAt: number;
}

/**
 * Filter difference type for comparison
 */
export interface FilterDifference {
  type: 'added' | 'removed' | 'changed';
  path: string;
  oldValue?: any;
  newValue?: any;
}

/**
 * Generate a unique ID for filter items
 */
export const generateId = (): string => {
  return `filter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Update a filter condition within a filter structure
 */
export const updateFilterCondition = (
  filter: AdvancedFilter,
  conditionId: string,
  updateFn: (condition: FilterCondition) => FilterCondition
): AdvancedFilter => {
  if (filter.id === conditionId && filter.type !== 'group') {
    return updateFn(filter);
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

/**
 * Update a filter group within a filter structure
 */
export const updateFilterGroup = (
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

/**
 * Remove a filter item (condition or group) from a filter structure
 */
export const removeFilterItem = (
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

/**
 * Compare two filters and find differences
 */
export const compareFilters = (
  filter1: AdvancedFilter,
  filter2: AdvancedFilter
): FilterDifference[] => {
  const differences: FilterDifference[] = [];
  
  // Compare filter properties
  compareFilterObjects(filter1, filter2, '', differences);
  
  return differences;
};

/**
 * Compare two filter objects recursively
 */
const compareFilterObjects = (
  obj1: any,
  obj2: any,
  path: string,
  differences: FilterDifference[]
): void => {
  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(obj1 || {}),
    ...Object.keys(obj2 || {})
  ]);
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Skip id fields
    if (key === 'id') continue;
    
    // Check if key exists in both objects
    if (!(key in obj1)) {
      differences.push({
        type: 'added',
        path: currentPath,
        newValue: obj2[key]
      });
      continue;
    }
    
    if (!(key in obj2)) {
      differences.push({
        type: 'removed',
        path: currentPath,
        oldValue: obj1[key]
      });
      continue;
    }
    
    // Compare values
    const val1 = obj1[key];
    const val2 = obj2[key];
    
    if (typeof val1 !== typeof val2) {
      differences.push({
        type: 'changed',
        path: currentPath,
        oldValue: val1,
        newValue: val2
      });
    } else if (typeof val1 === 'object' && val1 !== null && val2 !== null) {
      // Recursively compare objects
      if (Array.isArray(val1) && Array.isArray(val2)) {
        // Compare arrays
        compareFilterArrays(val1, val2, currentPath, differences);
      } else {
        // Compare objects
        compareFilterObjects(val1, val2, currentPath, differences);
      }
    } else if (val1 !== val2) {
      differences.push({
        type: 'changed',
        path: currentPath,
        oldValue: val1,
        newValue: val2
      });
    }
  }
};

/**
 * Compare two arrays of filter objects
 */
const compareFilterArrays = (
  arr1: any[],
  arr2: any[],
  path: string,
  differences: FilterDifference[]
): void => {
  // For simplicity, just compare array lengths
  if (arr1.length !== arr2.length) {
    differences.push({
      type: 'changed',
      path,
      oldValue: `Array with ${arr1.length} items`,
      newValue: `Array with ${arr2.length} items`
    });
    return;
  }
  
  // Compare array items
  for (let i = 0; i < arr1.length; i++) {
    const itemPath = `${path}[${i}]`;
    
    if (typeof arr1[i] === 'object' && typeof arr2[i] === 'object') {
      compareFilterObjects(arr1[i], arr2[i], itemPath, differences);
    } else if (arr1[i] !== arr2[i]) {
      differences.push({
        type: 'changed',
        path: itemPath,
        oldValue: arr1[i],
        newValue: arr2[i]
      });
    }
  }
};

/**
 * Validate filter structure
 */
export const validateFilterStructure = (filter: any): boolean => {
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
      filter.operator &&
      filter.field !== undefined &&
      filter.value !== undefined
    );
  }
};
