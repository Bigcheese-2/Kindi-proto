"use client";

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
    <div className="appearance-settings bg-primary rounded-md shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-light">Appearance & Accessibility</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-neutral-medium hover:text-neutral-light"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="section">
          <ThemeToggle />
        </div>
        
        <div className="section">
          <AccentColorPicker />
        </div>
        
        <div className="section">
          <AccessibilitySettings />
        </div>
        
        <div className="settings-actions border-t border-gray-700 pt-4">
          <button
            onClick={resetToDefaults}
            className="px-3 py-1 bg-secondary text-neutral-light rounded hover:bg-gray-700 text-sm"
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
