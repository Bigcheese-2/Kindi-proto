"use client";

import React from 'react';
import AppearanceSettings from './AppearanceSettings';

interface AppearanceSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppearanceSettingsDialog: React.FC<AppearanceSettingsDialogProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
        <AppearanceSettings onClose={onClose} />
      </div>
    </div>
  );
};

export default AppearanceSettingsDialog;
