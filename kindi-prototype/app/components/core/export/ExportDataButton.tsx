"use client";

import React, { useState } from 'react';
import DataExportPanel from './DataExportPanel';

interface ExportDataButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({
  className = '',
  buttonText = 'Export Data'
}) => {
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
  
  return (
    <>
      <button
        className={`export-data-button ${className}`}
        onClick={() => setIsExportPanelOpen(true)}
      >
        {buttonText}
      </button>
      
      {isExportPanelOpen && (
        <DataExportPanel onClose={() => setIsExportPanelOpen(false)} />
      )}
    </>
  );
};

export default ExportDataButton;
