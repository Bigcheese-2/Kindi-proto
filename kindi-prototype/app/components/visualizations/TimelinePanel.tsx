"use client";

import { useState, useRef, useCallback } from 'react';
import ExportButton from '../export/ExportButton';
import { ExportService, ExportOptions, saveExportedContent } from '@/app/lib/export/exportService';

export default function TimelinePanel() {
  const [viewMode, setViewMode] = useState('real-time');
  const timelineRef = useRef<HTMLDivElement>(null);
  const exportService = new ExportService();
  
  // Handle export
  const handleExport = useCallback(async (options: ExportOptions) => {
    try {
      if (!timelineRef.current) {
        throw new Error('Timeline reference is not available');
      }
      
      const result = await exportService.exportTimeline(timelineRef, options);
      
      // Save the exported content
      saveExportedContent(
        result,
        options.filename || `timeline.${options.format}`
      );
    } catch (error) {
      console.error('Error exporting timeline:', error);
      alert('Failed to export timeline. Please try again.');
    }
  }, [exportService]);
  
  return (
    <div className="bg-secondary rounded-md shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-neutral-light font-secondary font-semibold">Timeline Analysis</h2>
        <div className="flex space-x-2">
          <ExportButton exportType="timeline" onExport={handleExport} />
          <button 
            className={`px-3 py-1 rounded text-sm ${viewMode === 'real-time' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setViewMode('real-time')}
          >
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Real-time
            </div>
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${viewMode === 'layers' ? 'bg-accent text-white' : 'bg-gray-700 text-neutral-medium hover:bg-gray-600'}`}
            onClick={() => setViewMode('layers')}
          >
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Layers
            </div>
          </button>
        </div>
      </div>
      
      <div 
        ref={timelineRef}
        className="flex-1 bg-primary p-4 flex flex-col"
      >
        <div className="text-neutral-medium mb-2">Meetings</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-2 bg-gray-800 rounded-full relative">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-error rounded-full transform -translate-y-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}