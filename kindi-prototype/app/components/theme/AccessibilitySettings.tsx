"use client";

import { useTheme } from '@/app/contexts/ThemeContext';

const AccessibilitySettings: React.FC = () => {
  const { theme, toggleHighContrast, setFontSize } = useTheme();
  
  return (
    <div className="accessibility-settings">
      <h3 className="text-sm font-medium text-neutral-light mb-2">Accessibility</h3>
      
      <div className="setting-group mb-4">
        <label htmlFor="high-contrast" className="flex items-center cursor-pointer">
          <input
            id="high-contrast"
            type="checkbox"
            checked={theme.highContrast}
            onChange={toggleHighContrast}
            className="mr-2"
          />
          <span className="text-neutral-light">High Contrast Mode</span>
        </label>
        <p className="text-xs text-neutral-medium mt-1">
          Enhances visibility with increased contrast for better readability
        </p>
      </div>
      
      <div className="setting-group">
        <label htmlFor="font-size" className="block text-sm text-neutral-light mb-1">Font Size</label>
        <select
          id="font-size"
          value={theme.fontSize}
          onChange={(e) => setFontSize(e.target.value as any)}
          aria-label="Select font size"
          className="w-full bg-secondary text-neutral-light rounded px-2 py-1 text-sm border border-transparent focus:border-accent focus:outline-none"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <p className="text-xs text-neutral-medium mt-1">
          Adjust text size for better readability
        </p>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
