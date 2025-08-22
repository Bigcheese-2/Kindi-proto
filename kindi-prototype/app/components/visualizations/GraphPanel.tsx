"use client";

import { useRef, useCallback } from 'react';
import ExportButton from '../export/ExportButton';
import { ExportService, ExportOptions, saveExportedContent } from '@/app/lib/export/exportService';

export default function GraphPanel() {
  const graphRef = useRef<HTMLDivElement>(null);
  const exportService = new ExportService();
  
  // Handle export
  const handleExport = useCallback(async (options: ExportOptions) => {
    try {
      if (!graphRef.current) {
        throw new Error('Graph reference is not available');
      }
      
      const result = await exportService.exportGraph(graphRef, options);
      
      // Save the exported content
      saveExportedContent(
        result,
        options.filename || `network-graph.${options.format}`
      );
    } catch (error) {
      console.error('Error exporting graph:', error);
      alert('Failed to export graph. Please try again.');
    }
  }, [exportService]);
  
  return (
    <div className="bg-white dark:bg-gray-800 h-full rounded-md shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Network Graph</h2>
        <div className="flex space-x-2">
          <ExportButton exportType="graph" onExport={handleExport} />
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div 
        ref={graphRef}
        className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-md flex items-center justify-center"
      >
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 15l-5 5-5-5m10-7l-5 5-5-5" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Network Graph Visualization</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Load a dataset to view the network graph</p>
        </div>
      </div>
    </div>
  );
}