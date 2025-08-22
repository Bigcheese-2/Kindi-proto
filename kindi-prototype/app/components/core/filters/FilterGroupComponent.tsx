"use client";

import React from 'react';
import { FilterGroup, FilterCondition } from '@/app/models/filter-types';
import FilterConditionComponent from './FilterConditionComponent';

interface FilterGroupComponentProps {
  group: FilterGroup;
  onAddCondition: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onUpdateCondition: (conditionId: string, updates: Partial<FilterCondition>) => void;
  onUpdateGroupOperator: (groupId: string, operator: 'and' | 'or') => void;
  onRemoveItem: (itemId: string) => void;
  level?: number;
}

const FilterGroupComponent: React.FC<FilterGroupComponentProps> = ({
  group,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  onUpdateGroupOperator,
  onRemoveItem,
  level = 0
}) => {
  return (
    <div className={`filter-group level-${level} border rounded-md p-4 mb-2 ${level > 0 ? 'border-gray-300 bg-gray-50' : 'border-gray-400 bg-white'}`}>
      <div className="group-header flex items-center mb-3">
        <div className="flex items-center mr-4">
          <span className="mr-2 text-sm font-medium">Match</span>
          <select
            value={group.operator}
            onChange={e => onUpdateGroupOperator(group.id, e.target.value as 'and' | 'or')}
            className="group-operator px-2 py-1 border rounded text-sm"
            aria-label="Group operator"
          >
            <option value="and">ALL</option>
            <option value="or">ANY</option>
          </select>
          <span className="ml-2 text-sm font-medium">of the following:</span>
        </div>
        
        {level > 0 && (
          <button
            className="remove-group ml-auto text-sm text-red-600 hover:text-red-800"
            onClick={() => onRemoveItem(group.id)}
            aria-label="Remove group"
          >
            Remove Group
          </button>
        )}
      </div>
      
      <div className="group-conditions space-y-2">
        {group.conditions.length === 0 ? (
          <div className="empty-conditions text-sm text-gray-500 italic p-2">
            No conditions added yet. Add a condition or group below.
          </div>
        ) : (
          group.conditions.map(condition => (
            <div key={condition.id} className="condition-wrapper">
              {condition.type === 'group' ? (
                <FilterGroupComponent
                  group={condition as FilterGroup}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                  onUpdateCondition={onUpdateCondition}
                  onUpdateGroupOperator={onUpdateGroupOperator}
                  onRemoveItem={onRemoveItem}
                  level={level + 1}
                />
              ) : (
                <FilterConditionComponent
                  condition={condition as FilterCondition}
                  onUpdateCondition={updates => onUpdateCondition(condition.id, updates)}
                  onRemove={() => onRemoveItem(condition.id)}
                />
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="group-actions flex mt-3 space-x-2">
        <button
          className="add-condition px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          onClick={() => onAddCondition(group.id)}
        >
          Add Condition
        </button>
        
        <button
          className="add-group px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          onClick={() => onAddGroup(group.id)}
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default FilterGroupComponent;
