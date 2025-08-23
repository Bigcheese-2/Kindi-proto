"use client";

import { useState } from 'react';

export default function AppHeader() {
  const [datasetName, setDatasetName] = useState("Operation Blackwater");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [entityFilter, setEntityFilter] = useState("All Entities");

  return (
    <header className="bg-primary py-2 px-4 flex items-center justify-between border-b border-secondary">
      <div className="flex items-center">
        {/* Logo and brand */}
        <div className="flex items-center mr-4">
          <div className="text-accent mr-2">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="text-neutral-light font-bold text-xl">
            IntelAnalyzer
          </div>
        </div>
        
        {/* Dataset name with separator */}
        <div className="flex items-center">
          <div className="text-neutral-medium mx-2">|</div>
          <div className="text-neutral-medium">
            {datasetName}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Calendar dropdown */}
        <div className="relative">
          <div className="flex items-center bg-secondary rounded px-3 py-1.5 cursor-pointer border border-transparent hover:border-accent focus:border-accent">
            <svg className="h-5 w-5 text-neutral-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <select 
              className="bg-transparent text-neutral-light appearance-none cursor-pointer focus:outline-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
            <svg className="h-4 w-4 ml-2 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Filter dropdown */}
        <div className="relative">
          <div className="flex items-center bg-secondary rounded px-3 py-1.5 cursor-pointer border border-transparent hover:border-accent focus:border-accent">
            <svg className="h-5 w-5 text-neutral-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select 
              className="bg-transparent text-neutral-light appearance-none cursor-pointer focus:outline-none"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option>All Entities</option>
              <option>Person</option>
              <option>Organization</option>
              <option>Location</option>
              <option>Digital</option>
            </select>
            <svg className="h-4 w-4 ml-2 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Notification bell */}
        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <svg className="h-6 w-6 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        {/* User profile */}
        <button className="bg-accent p-1.5 rounded-full hover:bg-blue-700 transition-colors">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
