"use client";

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import AccentColorPicker from './AccentColorPicker';
import AccessibilitySettings from './AccessibilitySettings';

interface AppearanceSettingsProps {
  onClose?: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onClose }) => {
  const { resetToDefaults } = useTheme();
  
  return (
    <div className="appearance-settings">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appearance & Accessibility</h2>
        {onClose && (
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="space-y-8">
        <div className="theme-section">
          <h3 className="text-lg font-medium mb-3">Theme</h3>
          <ThemeToggle />
        </div>
        
        <div className="accent-section">
          <AccentColorPicker />
        </div>
        
        <div className="accessibility-section">
          <AccessibilitySettings />
        </div>
        
        <div className="settings-actions flex justify-end">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-red-600 hover:text-red-800"
            aria-label="Reset all appearance settings to defaults"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
