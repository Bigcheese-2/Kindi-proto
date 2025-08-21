"use client";

import { useState } from 'react';

export default function InspectorPanel() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="bg-secondary h-full rounded-md shadow-md flex flex-col overflow-hidden">
      
      <div className="p-4">
        <h2 className="text-lg font-secondary font-semibold text-neutral-light mb-4">Entity Inspector</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-accent rounded-md flex items-center justify-center mr-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-neutral-light font-medium">Viktor Petrov</h3>
              <div className="text-xs text-neutral-medium">Person of Interest</div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-light mb-2">RISK LEVEL</h4>
            <div className="w-full h-2 bg-gray-700 rounded-full">
              <div className="h-full bg-warning rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-warning font-medium">High</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-light mb-2">LAST ACTIVITY</h4>
            <div className="text-sm text-neutral-medium">Meeting with Alexei Kuznetsov - May 10, 2023</div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-light mb-2">ATTRIBUTES</h4>
            <div className="bg-primary rounded-md p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-neutral-medium">Age:</div>
                <div className="text-neutral-light">42</div>
                <div className="text-neutral-medium">Nationality:</div>
                <div className="text-neutral-light">Russian</div>
                <div className="text-neutral-medium">Occupation:</div>
                <div className="text-neutral-light">Businessman</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-neutral-light mb-2">CONNECTIONS</h4>
            <div className="space-y-2">
              <div className="bg-primary rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-light">Global Solutions Ltd</span>
                </div>
                <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">Owns</span>
              </div>
              <div className="bg-primary rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center mr-2">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-neutral-light">Alexei Kuznetsov</span>
                </div>
                <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">Knows</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}