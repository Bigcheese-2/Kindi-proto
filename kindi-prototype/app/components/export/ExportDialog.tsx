"use client";

import { useState } from 'react';
import { ExportFormat, ExportOptions } from '@/app/lib/export/exportService';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'graph' | 'timeline' | 'map' | 'data' | 'report';
  onExport: (options: ExportOptions) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  exportType,
  onExport
}) => {
  const [format, setFormat] = useState<ExportFormat>(
    exportType === 'data' ? 'csv' : 'png'
  );
  const [quality, setQuality] = useState<number>(90);
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [filename, setFilename] = useState<string>(`kindi-${exportType}-export`);
  
  // Get available formats based on export type
  const getAvailableFormats = (): ExportFormat[] => {
    switch (exportType) {
      case 'graph':
        return ['png', 'svg', 'pdf'];
      case 'timeline':
      case 'map':
        return ['png', 'pdf'];
      case 'data':
        return ['csv', 'json'];
      case 'report':
        return ['pdf'];
      default:
        return ['png'];
    }
  };
  
  // Handle export button click
  const handleExport = () => {
    onExport({
      format,
      quality: quality / 100,
      includeMetadata,
      filename: `${filename}.${format}`
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export {exportType}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="format" className="block text-sm font-medium">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={e => setFormat(e.target.value as ExportFormat)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {getAvailableFormats().map(fmt => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          {(format === 'png' || format === 'jpg') && (
            <div className="space-y-2">
              <label htmlFor="quality" className="block text-sm font-medium">
                Quality: {quality}%
              </label>
              <input
                type="range"
                id="quality"
                min="10"
                max="100"
                value={quality}
                onChange={e => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="filename" className="block text-sm font-medium">
              Filename
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="px-3 py-2 border-t border-r border-b rounded-r-md bg-gray-100 dark:bg-gray-600 dark:border-gray-600">
                .{format}
              </span>
            </div>
          </div>
          
          {(exportType === 'data' || exportType === 'report') && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-metadata"
                checked={includeMetadata}
                onChange={e => setIncludeMetadata(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="include-metadata" className="text-sm">
                Include metadata
              </label>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
