import { AdvancedFilter } from '@/app/models/filter-types';
import { FilterDifference } from '@/app/contexts/FilterContext';

/**
 * Compare two filters and find differences
 * @param filter1 First filter
 * @param filter2 Second filter
 * @returns Array of differences
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
 * @param obj1 First object
 * @param obj2 Second object
 * @param path Current path
 * @param differences Array to collect differences
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
 * @param arr1 First array
 * @param arr2 Second array
 * @param path Current path
 * @param differences Array to collect differences
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
