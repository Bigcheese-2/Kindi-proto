"use client";

import { useUI } from '@/app/contexts/UIContext';
import { useEffect, useState } from 'react';
import DatasetSelector from '../core/DatasetSelector';
import AdvancedFilteringPanel from '../filters/AdvancedFilteringPanel';

export default function ControlPanel() {
  const { controlPanelVisible } = useUI();
  const [isMobile, setIsMobile] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    <aside className={`bg-secondary ${isMobile ? 'w-full absolute z-10' : 'w-80'} h-full overflow-y-auto border-r border-gray-700 shadow-md`}>
      {showAdvancedFilters ? (
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-secondary font-semibold text-neutral-light">Advanced Filters</h2>
            <button 
              className="p-1 rounded hover:bg-primary text-neutral-light"
              onClick={() => setShowAdvancedFilters(false)}
              title="Back to basic filters"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <AdvancedFilteringPanel />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-secondary font-semibold text-neutral-light mb-4">Control Panel</h2>
          
          <DatasetSelector />
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-neutral-light">Filters</h3>
              <button 
                className="text-xs text-accent hover:underline"
                onClick={() => setShowAdvancedFilters(true)}
              >
                Advanced
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-neutral-medium mb-1">Entity Type</label>
                <select className="w-full p-2 bg-primary border border-gray-700 rounded text-neutral-light text-sm">
                  <option>All Types</option>
                  <option>Person</option>
                  <option>Organization</option>
                  <option>Location</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-medium mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    className="w-full p-2 bg-primary border border-gray-700 rounded text-neutral-light text-sm" 
                    placeholder="Start Date"
                  />
                  <input 
                    type="date" 
                    className="w-full p-2 bg-primary border border-gray-700 rounded text-neutral-light text-sm" 
                    placeholder="End Date"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-medium mb-1">Risk Level</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  className="w-full accent-accent" 
                />
                <div className="flex justify-between text-xs text-neutral-medium">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-light mb-2">View Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-accent" />
                <span className="text-sm text-neutral-light">Show Labels</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-accent" />
                <span className="text-sm text-neutral-light">Show Relationships</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-accent" />
                <span className="text-sm text-neutral-light">Highlight Selected</span>
              </label>
            </div>
          </div>
          
          <div>
            <button className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-accent/80 transition-colors">
              Apply Filters
            </button>
            <button className="w-full mt-2 bg-secondary border border-gray-700 py-2 px-4 rounded hover:bg-primary transition-colors text-neutral-light">
              Reset
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}