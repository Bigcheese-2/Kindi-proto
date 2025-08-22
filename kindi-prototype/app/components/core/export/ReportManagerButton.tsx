"use client";

import React, { useState } from 'react';
import ReportManager from './ReportManager';

interface ReportManagerButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const ReportManagerButton: React.FC<ReportManagerButtonProps> = ({
  className = '',
  buttonText = 'Reports'
}) => {
  const [isReportManagerOpen, setIsReportManagerOpen] = useState(false);
  
  return (
    <>
      <button
        className={`report-manager-button ${className}`}
        onClick={() => setIsReportManagerOpen(true)}
      >
        {buttonText}
      </button>
      
      {isReportManagerOpen && (
        <ReportManager onClose={() => setIsReportManagerOpen(false)} />
      )}
    </>
  );
};

export default ReportManagerButton;
