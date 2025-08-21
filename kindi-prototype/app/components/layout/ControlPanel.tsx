"use client";

import { useUI } from '@/app/contexts/UIContext';
import { useEffect, useState } from 'react';
import DatasetSelector from '../core/DatasetSelector';

export default function ControlPanel() {
  const { controlPanelVisible } = useUI();
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!controlPanelVisible) return null;

  return (
    <aside className={`bg-gray-100 ${isMobile ? 'w-full absolute z-10' : 'w-64'} h-full overflow-y-auto border-r border-gray-200 shadow-md`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Control Panel</h2>
        
        <DatasetSelector />
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Entity Type</label>
              <select className="w-full p-2 border border-gray-300 rounded text-sm">
                <option>All Types</option>
                <option>Person</option>
                <option>Organization</option>
                <option>Location</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded text-sm" 
                  placeholder="Start Date"
                />
                <input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded text-sm" 
                  placeholder="End Date"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Risk Level</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">View Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Show Labels</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Show Relationships</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Highlight Selected</span>
            </label>
          </div>
        </div>
        
        <div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
            Apply Filters
          </button>
          <button className="w-full mt-2 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}
