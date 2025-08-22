"use client";

import React, { useState } from 'react';
import AnnotationExport from './AnnotationExport';

interface AnnotationExportButtonProps {
  targetId?: string;
  targetType?: 'entity' | 'event' | 'location';
  className?: string;
  buttonText?: React.ReactNode;
}

const AnnotationExportButton: React.FC<AnnotationExportButtonProps> = ({
  targetId,
  targetType,
  className = '',
  buttonText = 'Export Annotations'
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  return (
    <>
      <button
        className={`annotation-export-button ${className}`}
        onClick={() => setIsExportOpen(true)}
      >
        {buttonText}
      </button>
      
      {isExportOpen && (
        <AnnotationExport
          targetId={targetId}
          targetType={targetType}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </>
  );
};

export default AnnotationExportButton;
