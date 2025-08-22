"use client";

import React from 'react';
import { FilterCondition } from '@/app/models/filter-types';

interface FilterConditionComponentProps {
  condition: FilterCondition;
  onUpdateCondition: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}

const FilterConditionComponent: React.FC<FilterConditionComponentProps> = ({
  condition,
  onUpdateCondition,
  onRemove
}) => {
  // Get available fields based on condition type
  const getAvailableFields = () => {
    switch (condition.type) {
      case 'entityType':
        return [
          { value: 'type', label: 'Entity Type' },
          { value: 'name', label: 'Entity Name' },
          { value: 'risk', label: 'Risk Level' }
        ];
      case 'timeRange':
        return [
          { value: 'time', label: 'Event Time' },
          { value: 'endTime', label: 'Event End Time' }
        ];
      case 'geographic':
        return [
          { value: 'latitude', label: 'Latitude' },
          { value: 'longitude', label: 'Longitude' },
          { value: 'name', label: 'Location Name' }
        ];
      case 'attribute':
        return [
          { value: 'attributes.age', label: 'Age' },
          { value: 'attributes.nationality', label: 'Nationality' },
          { value: 'attributes.occupation', label: 'Occupation' }
          // This would ideally be dynamically generated based on dataset
        ];
      case 'relationship':
        return [
          { value: 'type', label: 'Relationship Type' },
          { value: 'strength', label: 'Relationship Strength' },
          { value: 'directed', label: 'Is Directed' }
        ];
      default:
        return [];
    }
  };
  
  // Get available operators based on field type
  const getAvailableOperators = () => {
    // This would depend on the field type
    return [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'greaterThan', label: 'Greater Than' },
      { value: 'lessThan', label: 'Less Than' },
      { value: 'between', label: 'Between' },
      { value: 'in', label: 'In List' }
    ];
  };
  
  // Render value input based on operator and field
  const renderValueInput = () => {
    switch (condition.operator) {
      case 'equals':
      case 'contains':
        return (
          <input
            type="text"
            value={condition.value || ''}
            onChange={e => onUpdateCondition({ value: e.target.value })}
            className="condition-value px-2 py-1 border rounded"
            placeholder="Value"
          />
        );
      case 'greaterThan':
      case 'lessThan':
        return (
          <input
            type="number"
            value={condition.value || ''}
            onChange={e => onUpdateCondition({ value: parseFloat(e.target.value) })}
            className="condition-value px-2 py-1 border rounded"
            placeholder="Value"
          />
        );
      case 'between':
        return (
          <div className="between-values flex items-center space-x-2">
            <input
              type="number"
              value={condition.value?.[0] || ''}
              onChange={e => onUpdateCondition({
                value: [parseFloat(e.target.value), condition.value?.[1]]
              })}
              className="condition-value px-2 py-1 border rounded w-24"
              placeholder="Min"
            />
            <span className="and-separator">and</span>
            <input
              type="number"
              value={condition.value?.[1] || ''}
              onChange={e => onUpdateCondition({
                value: [condition.value?.[0], parseFloat(e.target.value)]
              })}
              className="condition-value px-2 py-1 border rounded w-24"
              placeholder="Max"
            />
          </div>
        );
      case 'in':
        return (
          <textarea
            value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value || ''}
            onChange={e => onUpdateCondition({
              value: e.target.value.split(',').map(v => v.trim())
            })}
            className="condition-value-list px-2 py-1 border rounded w-full"
            placeholder="Comma-separated values"
            rows={2}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="filter-condition flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded bg-white">
      <select
        value={condition.type}
        onChange={e => onUpdateCondition({ type: e.target.value as any })}
        className="condition-type px-2 py-1 border rounded"
        aria-label="Condition type"
      >
        <option value="entityType">Entity</option>
        <option value="timeRange">Time</option>
        <option value="geographic">Location</option>
        <option value="attribute">Attribute</option>
        <option value="relationship">Relationship</option>
      </select>
      
      <select
        value={condition.field}
        onChange={e => onUpdateCondition({ field: e.target.value })}
        className="condition-field px-2 py-1 border rounded"
        aria-label="Condition field"
      >
        {getAvailableFields().map(field => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      
      <select
        value={condition.operator}
        onChange={e => onUpdateCondition({ operator: e.target.value as any })}
        className="condition-operator px-2 py-1 border rounded"
        aria-label="Condition operator"
      >
        {getAvailableOperators().map(op => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      
      <div className="condition-value-container flex-grow">
        {renderValueInput()}
      </div>
      
      <label className="negated-checkbox flex items-center">
        <input
          type="checkbox"
          checked={condition.negated || false}
          onChange={e => onUpdateCondition({ negated: e.target.checked })}
          className="mr-1"
        />
        <span className="text-sm">Not</span>
      </label>
      
      <button
        className="remove-condition ml-auto text-sm text-red-600 hover:text-red-800"
        onClick={onRemove}
        aria-label="Remove condition"
      >
        Remove
      </button>
    </div>
  );
};

export default FilterConditionComponent;
