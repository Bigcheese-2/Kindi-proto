"use client";

import React, { useState } from 'react';
import ExportSettings from './ExportSettings';

interface ExportSettingsButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const ExportSettingsButton: React.FC<ExportSettingsButtonProps> = ({
  className = '',
  buttonText = 'Export Settings'
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <>
      <button
        className={`export-settings-button ${className}`}
        onClick={() => setIsSettingsOpen(true)}
      >
        {buttonText}
      </button>
      
      {isSettingsOpen && (
        <ExportSettings onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
};

export default ExportSettingsButton;
