"use client";

import { useState } from 'react';

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
        
        <div className="relative">
          <div className="flex items-center bg-secondary rounded px-3 py-2 border border-transparent hover:border-accent focus-within:border-accent">
            <svg className="h-4 w-4 text-neutral-medium mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent border-none text-neutral-light placeholder-neutral-dark focus:outline-none w-24"
            />
          </div>
        </div>
        
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
