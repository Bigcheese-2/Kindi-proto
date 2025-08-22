// Advanced filter types
export interface FilterCondition {
  id: string;
  type: 'entityType' | 'timeRange' | 'geographic' | 'attribute' | 'relationship';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  field: string;
  value: any;
  negated?: boolean;
}

export interface FilterGroup {
  id: string;
  type: 'group';
  operator: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

export type AdvancedFilter = FilterCondition | FilterGroup;

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  category?: string;
  filter: AdvancedFilter;
  createdAt: number;
  updatedAt: number;
}

// Helper functions
export const generateFilterId = (): string => {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new filter group
export const createFilterGroup = (operator: 'and' | 'or' = 'and'): FilterGroup => {
  return {
    id: generateFilterId(),
    type: 'group',
    operator,
    conditions: []
  };
};

// Create a new filter condition
export const createFilterCondition = (
  type: FilterCondition['type'],
  field: string,
  operator: FilterCondition['operator'],
  value: any
): FilterCondition => {
  return {
    id: generateFilterId(),
    type,
    field,
    operator,
    value
  };
};

// Update a filter group in a filter tree
export const updateFilterGroup = (
  filter: AdvancedFilter,
  groupId: string,
  updateFn: (group: FilterGroup) => FilterGroup
): AdvancedFilter => {
  if (filter.type === 'group') {
    if (filter.id === groupId) {
      return updateFn(filter);
    }
    
    return {
      ...filter,
      conditions: filter.conditions.map(condition => 
        updateFilterGroup(condition, groupId, updateFn)
      )
    };
  }
  
  return filter;
};

// Update a filter condition in a filter tree
export const updateFilterCondition = (
  filter: AdvancedFilter,
  conditionId: string,
  updateFn: (condition: FilterCondition) => FilterCondition
): AdvancedFilter => {
  if (filter.type === 'group') {
    return {
      ...filter,
      conditions: filter.conditions.map(condition => {
        if (condition.type !== 'group' && condition.id === conditionId) {
          return updateFn(condition);
        }
        return updateFilterCondition(condition, conditionId, updateFn);
      })
    };
  }
  
  if (filter.id === conditionId) {
    return updateFn(filter);
  }
  
  return filter;
};

// Remove a filter item (condition or group) from a filter tree
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
