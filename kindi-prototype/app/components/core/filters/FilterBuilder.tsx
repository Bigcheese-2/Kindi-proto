"use client";

import React, { useState, useEffect } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';
import { 
  AdvancedFilter, 
  FilterGroup, 
  FilterCondition,
  createFilterGroup,
  updateFilterGroup,
  updateFilterCondition,
  removeFilterItem
} from '@/app/models/filter-types';
import FilterGroupComponent from './FilterGroupComponent';

interface FilterBuilderProps {
  initialFilter?: AdvancedFilter;
  onChange?: (filter: AdvancedFilter) => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  initialFilter,
  onChange
}) => {
  const { setAdvancedFilter } = useFilters();
  const [filter, setFilter] = useState<AdvancedFilter>(
    initialFilter || createFilterGroup()
  );
  
  // Update parent component when filter changes
  useEffect(() => {
    if (onChange) {
      onChange(filter);
    } else {
      setAdvancedFilter(filter);
    }
  }, [filter, onChange, setAdvancedFilter]);
  
  // Add a new condition to a group
  const addCondition = (groupId: string) => {
    const newCondition: FilterCondition = {
      id: `condition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'entityType',
      operator: 'equals',
      field: 'type',
      value: null
    };
    
    setFilter(prevFilter => 
      updateFilterGroup(prevFilter, groupId, group => ({
        ...group,
        conditions: [...group.conditions, newCondition]
      }))
    );
  };
  
  // Add a new group to a group
  const addGroup = (parentGroupId: string) => {
    const newGroup = createFilterGroup();
    
    setFilter(prevFilter => 
      updateFilterGroup(prevFilter, parentGroupId, group => ({
        ...group,
        conditions: [...group.conditions, newGroup]
      }))
    );
  };
  
  // Update a condition
  const updateCondition = (
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => {
    setFilter(prevFilter => 
      updateFilterCondition(prevFilter, conditionId, condition => ({
        ...condition,
        ...updates
      }))
    );
  };
  
  // Update a group's operator
  const updateGroupOperator = (groupId: string, operator: 'and' | 'or') => {
    setFilter(prevFilter => 
      updateFilterGroup(prevFilter, groupId, group => ({
        ...group,
        operator
      }))
    );
  };
  
  // Remove a condition or group
  const removeItem = (itemId: string) => {
    setFilter(prevFilter => removeFilterItem(prevFilter, itemId));
  };
  
  // Render the filter builder UI
  return (
    <div className="filter-builder">
      <h3 className="text-lg font-medium mb-4">Build Advanced Filter</h3>
      <FilterGroupComponent
        group={filter as FilterGroup}
        onAddCondition={addCondition}
        onAddGroup={addGroup}
        onUpdateCondition={updateCondition}
        onUpdateGroupOperator={updateGroupOperator}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default FilterBuilder;
