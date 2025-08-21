"use client";

import { useState } from 'react';
import FilterPanel from '../core/filters/FilterPanel';
import { useUI } from '@/app/contexts/UIContext';

export default function ControlPanel() {
  const { controlPanelVisible, setControlPanelVisible } = useUI();
  const [activeTab, setActiveTab] = useState<'filters' | 'datasets' | 'settings'>('filters');
  
  if (!controlPanelVisible) {
    return (
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          className="bg-secondary p-2 rounded-r-md shadow-md text-neutral-light"
          onClick={() => setControlPanelVisible(true)}
          title="Show Control Panel"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className="control-panel bg-secondary h-full rounded-md shadow-md flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'filters' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium'
            }`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'datasets' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium'
            }`}
            onClick={() => setActiveTab('datasets')}
          >
            Datasets
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              activeTab === 'settings' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        <button
          className="p-1.5 text-neutral-medium hover:text-neutral-light"
          onClick={() => setControlPanelVisible(false)}
          title="Hide Control Panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'filters' && <FilterPanel />}
        {activeTab === 'datasets' && (
          <div className="p-4">
            <h2 className="text-lg font-secondary font-semibold text-neutral-light mb-4">Datasets</h2>
            <p className="text-neutral-medium">Dataset selection will go here.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-4">
            <h2 className="text-lg font-secondary font-semibold text-neutral-light mb-4">Settings</h2>
            <p className="text-neutral-medium">Settings will go here.</p>
          </div>
        )}
      </div>
    </div>
  );
}