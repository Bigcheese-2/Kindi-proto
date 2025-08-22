"use client";

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface AccessibilitySettingsProps {
  className?: string;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ className = '' }) => {
  const { theme, toggleHighContrast, setFontSize } = useTheme();
  
  return (
    <div className={`accessibility-settings ${className}`}>
      <h3 className="text-lg font-medium mb-3">Accessibility</h3>
      
      <div className="setting-group mb-4">
        <label htmlFor="high-contrast" className="flex items-center cursor-pointer">
          <input
            id="high-contrast"
            type="checkbox"
            checked={theme.highContrast}
            onChange={toggleHighContrast}
            className="mr-2"
          />
          <span>High Contrast Mode</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">
          Enhances contrast for better visibility
        </p>
      </div>
      
      <div className="setting-group">
        <label htmlFor="font-size" className="block text-sm font-medium mb-1">Font Size</label>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              theme.fontSize === 'small' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFontSize('small')}
          >
            Small
          </button>
          <button
            className={`px-3 py-1 rounded ${
              theme.fontSize === 'medium' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFontSize('medium')}
          >
            Medium
          </button>
          <button
            className={`px-3 py-1 rounded ${
              theme.fontSize === 'large' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFontSize('large')}
          >
            Large
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
