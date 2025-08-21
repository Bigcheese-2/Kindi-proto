"use client";

import { useState } from 'react';

export default function MapPanel() {
  const [mapType, setMapType] = useState('satellite');
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Geographic View</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${mapType === 'satellite' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setMapType('satellite')}
          >
            Satellite
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${mapType === 'streets' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setMapType('streets')}
          >
            Streets
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-primary flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-accent mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-neutral-medium">Interactive Map Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}