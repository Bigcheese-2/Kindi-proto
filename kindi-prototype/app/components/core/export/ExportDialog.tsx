"use client";

import React, { useState, useEffect } from 'react';
import { ExportFormat } from '@/app/lib/export/exportService';
import { 
  getDefaultFormatForType, 
  getDefaultOptionsForType, 
  generateFilename 
} from '@/app/lib/export/exportSettings';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'graph' | 'timeline' | 'map' | 'data' | 'report';
  onExport: (options: {
    format: ExportFormat;
    quality?: number;
    includeMetadata?: boolean;
    filename?: string;
    selection?: string[];
  }) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  exportType,
  onExport
}) => {
  // Get defaults from settings
  const defaultFormat = getDefaultFormatForType(exportType) as ExportFormat;
  const defaultOptions = getDefaultOptionsForType(exportType);
  const defaultFilename = generateFilename(exportType, defaultFormat).replace(`.${defaultFormat}`, '');
  
  const [format, setFormat] = useState<ExportFormat>(defaultFormat);
  const [quality, setQuality] = useState<number>(
    (defaultOptions.quality || 0.9) * 100
  );
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(
    defaultOptions.includeMetadata || true
  );
  const [filename, setFilename] = useState<string>(defaultFilename);
  
  // Update format when export type changes
  useEffect(() => {
    setFormat(getDefaultFormatForType(exportType) as ExportFormat);
  }, [exportType]);
  
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Export {exportType}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="format" className="block text-sm font-medium mb-1">Format</label>
            <select
              id="format"
              value={format}
              onChange={e => setFormat(e.target.value as ExportFormat)}
              className="w-full border rounded p-2"
            >
              {getAvailableFormats().map(fmt => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          {(format === 'png' || format === 'jpg') && (
            <div className="form-group">
              <label htmlFor="quality" className="block text-sm font-medium mb-1">
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
          
          <div className="form-group">
            <label htmlFor="filename" className="block text-sm font-medium mb-1">Filename</label>
            <div className="flex items-center">
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={e => setFilename(e.target.value)}
                className="flex-grow border rounded p-2"
              />
              <span className="ml-2 text-gray-500">.{format}</span>
            </div>
          </div>
          
          {(exportType === 'data' || exportType === 'report') && (
            <div className="form-group">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={e => setIncludeMetadata(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Include metadata</span>
              </label>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6 space-x-2">
          <button 
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
