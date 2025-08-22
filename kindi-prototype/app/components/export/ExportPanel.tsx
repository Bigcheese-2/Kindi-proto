"use client";

import { useState, useRef } from 'react';
import { useData } from '@/app/contexts/DataContext';
import DataSelectionExport from './DataSelectionExport';
import ReportCreator from './ReportCreator';
import { exportElementAsPNG } from '@/app/lib/export/visualExport';

interface ExportPanelProps {
  onClose: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose }) => {
  const { currentDataset } = useData();
  const [activeTab, setActiveTab] = useState<'data' | 'report'>('data');
  
  // Capture visualizations for report
  const captureVisualizations = async () => {
    // In a real implementation, we would capture the actual visualization components
    // For now, we'll just return empty strings
    return {
      graph: '',
      timeline: '',
      map: ''
    };
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Export</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'data'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('data')}
            >
              Data Export
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'report'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('report')}
            >
              Report Generation
            </button>
          </nav>
        </div>
        
        <div className="space-y-6">
          {activeTab === 'data' ? (
            <DataSelectionExport
              entities={currentDataset?.entities || []}
              relationships={currentDataset?.relationships || []}
              events={currentDataset?.events || []}
              locations={currentDataset?.locations || []}
            />
          ) : (
            <ReportCreator
              onClose={onClose}
              captureVisualizations={captureVisualizations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
