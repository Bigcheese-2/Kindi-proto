"use client";

import { useState } from 'react';

export default function NetworkGraphPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Network Graph</h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Expand"
          >
            <svg className="h-5 w-5 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            aria-label="Export"
          >
            <svg className="h-5 w-5 text-neutral-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent mb-4 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
            </div>
            <div className="w-0.5 h-16 bg-accent"></div>
            <div className="w-12 h-12 rounded-full bg-accent mt-4 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
