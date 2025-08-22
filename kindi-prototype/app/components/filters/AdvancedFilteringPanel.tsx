"use client";

import { useState } from 'react';
import { AdvancedFilterProvider } from '@/app/contexts/AdvancedFilterContext';
import FilterBuilder from './FilterBuilder';
import FilterComparisonView from './FilterComparisonView';

export default function AdvancedFilteringPanel() {
  const [activeTab, setActiveTab] = useState<'builder' | 'comparison'>('builder');
  
  return (
    <div className="advanced-filtering-panel bg-secondary rounded-md shadow-md h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'builder'
              ? 'text-accent border-b-2 border-accent'
              : 'text-neutral-medium hover:text-neutral-light'
          }`}
          onClick={() => setActiveTab('builder')}
        >
          Filter Builder
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'comparison'
              ? 'text-accent border-b-2 border-accent'
              : 'text-neutral-medium hover:text-neutral-light'
          }`}
          onClick={() => setActiveTab('comparison')}
        >
          Filter Comparison
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <AdvancedFilterProvider>
          {activeTab === 'builder' ? (
            <FilterBuilder />
          ) : (
            <FilterComparisonView />
          )}
        </AdvancedFilterProvider>
      </div>
    </div>
  );
}
