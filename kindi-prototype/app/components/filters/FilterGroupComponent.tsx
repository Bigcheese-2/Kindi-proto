"use client";

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

export default function FilterGroupComponent({
  group,
  onAddCondition,
  onAddGroup,
  onUpdateCondition,
  onUpdateGroupOperator,
  onRemoveItem,
  level = 0
}: FilterGroupComponentProps) {
  return (
    <div className={`filter-group bg-secondary p-3 rounded-md mb-2 ${level > 0 ? 'border border-gray-700' : ''}`}>
      <div className="group-header flex items-center justify-between mb-3">
        <div className="flex items-center">
          <select
            value={group.operator}
            onChange={e => onUpdateGroupOperator(group.id, e.target.value as 'and' | 'or')}
            className="p-2 bg-primary border border-gray-700 rounded text-neutral-light mr-2"
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
          
          <span className="text-neutral-light font-medium">
            {level === 0 ? 'All of the following conditions' : 'Group'}
          </span>
        </div>
        
        {level > 0 && (
          <button
            className="p-1 rounded bg-primary hover:bg-error text-neutral-light"
            onClick={() => onRemoveItem(group.id)}
            title="Remove group"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="group-conditions pl-4 border-l-2 border-gray-700">
        {group.conditions.length === 0 ? (
          <div className="text-neutral-medium italic p-2">
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
      
      <div className="group-actions mt-3 flex space-x-2">
        <button
          className="px-3 py-2 bg-accent hover:bg-accent/80 text-white rounded-md text-sm flex items-center"
          onClick={() => onAddCondition(group.id)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Condition
        </button>
        
        <button
          className="px-3 py-2 bg-secondary hover:bg-secondary/80 text-neutral-light border border-gray-700 rounded-md text-sm flex items-center"
          onClick={() => onAddGroup(group.id)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Add Group
        </button>
      </div>
    </div>
  );
}
