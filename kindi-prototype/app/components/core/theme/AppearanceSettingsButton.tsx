"use client";

import React, { useState } from 'react';
import AppearanceSettingsDialog from './AppearanceSettingsDialog';

interface AppearanceSettingsButtonProps {
  className?: string;
  buttonText?: React.ReactNode;
}

const AppearanceSettingsButton: React.FC<AppearanceSettingsButtonProps> = ({
  className = '',
  buttonText = 'Appearance'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <button
        className={`appearance-settings-button ${className}`}
        onClick={() => setIsDialogOpen(true)}
      >
        {buttonText}
      </button>
      
      <AppearanceSettingsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default AppearanceSettingsButton;
