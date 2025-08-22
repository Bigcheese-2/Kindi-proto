"use client";

import React, { useState } from 'react';
import { ExportService, ExportOptions } from '@/app/lib/export/exportService';
import ExportDialog from './ExportDialog';
import { downloadContent, getMimeType } from '@/app/lib/export/visualExport';
import { 
  getDefaultFormatForType, 
  getDefaultOptionsForType, 
  generateFilename 
} from '@/app/lib/export/exportSettings';

interface ExportButtonProps {
  exportType: 'graph' | 'timeline' | 'map' | 'data' | 'report';
  elementRef?: React.RefObject<any>;
  data?: any;
  className?: string;
  buttonText?: React.ReactNode;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportType,
  elementRef,
  data,
  className = '',
  buttonText = 'Export'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const exportService = new ExportService();
  
  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    setError(null);
    
    try {
      let result: Blob | string;
      
      switch (exportType) {
        case 'graph':
          if (!elementRef?.current) {
            throw new Error('Graph reference is not available');
          }
          result = await exportService.exportGraph(elementRef, options);
          break;
        case 'timeline':
          if (!elementRef?.current) {
            throw new Error('Timeline reference is not available');
          }
          result = await exportService.exportTimeline(elementRef, options);
          break;
        case 'map':
          if (!elementRef?.current) {
            throw new Error('Map reference is not available');
          }
          result = await exportService.exportMap(elementRef, options);
          break;
        case 'data':
          if (!data) {
            throw new Error('No data available for export');
          }
          result = await exportService.exportData(data, options);
          break;
        case 'report':
          if (!data) {
            throw new Error('No report data available for export');
          }
          result = await exportService.exportReport(data, options);
          break;
        default:
          throw new Error(`Unsupported export type: ${exportType}`);
      }
      
      // Download the result
      downloadContent(
        result,
        options.filename || `${exportType}-export.${options.format}`,
        getMimeType(options.format)
      );
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during export');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <>
      <button
        className={`export-button ${className}`}
        onClick={() => setIsDialogOpen(true)}
        disabled={isExporting}
        title={`Export ${exportType}`}
      >
        {isExporting ? 'Exporting...' : buttonText}
      </button>
      
      {error && (
        <div className="export-error text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
      
      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        exportType={exportType}
        onExport={handleExport}
      />
    </>
  );
};

export default ExportButton;
