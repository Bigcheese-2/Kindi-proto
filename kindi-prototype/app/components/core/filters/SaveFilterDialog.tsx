"use client";

import React, { useState } from 'react';
import { useFilters } from '@/app/contexts/FilterContext';

interface SaveFilterDialogProps {
  onClose: () => void;
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({ onClose }) => {
  const { saveAdvancedFilter } = useFilters();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    
    try {
      saveAdvancedFilter(
        name,
        description || undefined,
        category || undefined
      );
      
      onClose();
    } catch (error) {
      console.error('Error saving filter:', error);
      alert('Error saving filter. Please ensure you have an active filter.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Save Filter</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="filter-name">
            Name*
          </label>
          <input
            id="filter-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Filter name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="filter-description">
            Description
          </label>
          <textarea
            id="filter-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Optional description"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="filter-category">
            Category
          </label>
          <input
            id="filter-category"
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Optional category"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveFilterDialog;
