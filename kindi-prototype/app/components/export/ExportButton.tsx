"use client";

import { useState } from 'react';
import { ExportOptions } from '@/app/lib/export/exportService';
import ExportDialog from './ExportDialog';

interface ExportButtonProps {
  exportType: 'graph' | 'timeline' | 'map' | 'data' | 'report';
  onExport: (options: ExportOptions) => void;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  exportType,
  onExport,
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  return (
    <>
      <button
        className={`flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
        onClick={() => setIsDialogOpen(true)}
        title={`Export ${exportType}`}
      >
        <span className="mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </span>
        <span>Export</span>
      </button>
      
      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        exportType={exportType}
        onExport={onExport}
      />
    </>
  );
};

export default ExportButton;
