"use client";

import { useState } from 'react';
import GlobalSearch from '../core/search/GlobalSearch';
import AppearanceSettingsButton from '../core/theme/AppearanceSettingsButton';
import AccessibilityButton from '../core/accessibility/AccessibilityButton';
import KeyboardShortcutsButton from '../core/keyboard/KeyboardShortcutsButton';

export default function AppHeader() {
  const [datasetName, setDatasetName] = useState("Operation Blackwater");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [entityFilter, setEntityFilter] = useState("All Entities");

  return (
    <header className="bg-primary py-4 px-6 flex items-center justify-between border-b border-secondary">
      <div className="flex items-center">
        <div className="text-accent mr-6 text-2xl">
          <span className="font-bold">IntelAnalyzer</span>
        </div>
        <div className="text-neutral-light ml-4">
          {datasetName}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select 
            className="bg-secondary text-neutral-light rounded px-3 py-2 pr-8 appearance-none cursor-pointer border border-transparent hover:border-accent focus:border-accent focus:outline-none"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
            <option>All Time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <select 
            className="bg-secondary text-neutral-light rounded px-3 py-2 pr-8 appearance-none cursor-pointer border border-transparent hover:border-accent focus:border-accent focus:outline-none"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option>All Entities</option>
            <option>Person</option>
            <option>Organization</option>
            <option>Location</option>
            <option>Digital</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-medium">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative w-64">
          <GlobalSearch />
        </div>
        
        <AppearanceSettingsButton
          className="bg-secondary p-2 rounded hover:bg-accent transition-colors"
          buttonText={
            <svg className="h-5 w-5 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          }
        />
        
        <AccessibilityButton
          className="bg-secondary p-2 rounded hover:bg-accent transition-colors"
          buttonText={
            <svg className="h-5 w-5 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        
        <KeyboardShortcutsButton
          className="bg-secondary p-2 rounded hover:bg-accent transition-colors"
          buttonText={
            <svg className="h-5 w-5 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <button className="bg-secondary p-2 rounded hover:bg-accent transition-colors">
          <svg className="h-5 w-5 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <button className="bg-secondary p-2 rounded-full hover:bg-accent transition-colors">
          <svg className="h-5 w-5 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
