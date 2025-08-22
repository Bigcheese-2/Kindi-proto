"use client";

import { FilterCondition } from '@/app/models/filter-types';
import { useState } from 'react';

interface FilterConditionComponentProps {
  condition: FilterCondition;
  onUpdateCondition: (updates: Partial<FilterCondition>) => void;
  onRemove: () => void;
}

export default function FilterConditionComponent({
  condition,
  onUpdateCondition,
  onRemove
}: FilterConditionComponentProps) {
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
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
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
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
            placeholder="Value"
          />
        );
      case 'between':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={condition.value?.[0] || ''}
              onChange={e => onUpdateCondition({
                value: [parseFloat(e.target.value), condition.value?.[1]]
              })}
              className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
              placeholder="Min"
            />
            <span className="text-neutral-medium">and</span>
            <input
              type="number"
              value={condition.value?.[1] || ''}
              onChange={e => onUpdateCondition({
                value: [condition.value?.[0], parseFloat(e.target.value)]
              })}
              className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
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
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
            placeholder="Comma-separated values"
            rows={2}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="filter-condition bg-primary p-3 rounded-md mb-2">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-2">
          <select
            value={condition.type}
            onChange={e => onUpdateCondition({ type: e.target.value as any })}
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
          >
            <option value="entityType">Entity</option>
            <option value="timeRange">Time</option>
            <option value="geographic">Location</option>
            <option value="attribute">Attribute</option>
            <option value="relationship">Relationship</option>
          </select>
        </div>
        
        <div className="col-span-3">
          <select
            value={condition.field}
            onChange={e => onUpdateCondition({ field: e.target.value })}
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
          >
            {getAvailableFields().map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-span-2">
          <select
            value={condition.operator}
            onChange={e => onUpdateCondition({ operator: e.target.value as any })}
            className="w-full p-2 bg-secondary border border-gray-700 rounded text-neutral-light"
          >
            {getAvailableOperators().map(op => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-span-3">
          {renderValueInput()}
        </div>
        
        <div className="col-span-1 flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={condition.negated || false}
              onChange={e => onUpdateCondition({ negated: e.target.checked })}
              className="mr-1"
            />
            <span className="text-sm text-neutral-light">Not</span>
          </label>
        </div>
        
        <div className="col-span-1 text-right">
          <button
            className="p-1 rounded bg-secondary hover:bg-error text-neutral-light"
            onClick={onRemove}
            title="Remove condition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
