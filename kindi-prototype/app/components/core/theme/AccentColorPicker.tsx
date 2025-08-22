"use client";

import React, { useState } from 'react';
import { useTheme, AccentColor } from '@/app/contexts/ThemeContext';

interface AccentColorPickerProps {
  className?: string;
}

const AccentColorPicker: React.FC<AccentColorPickerProps> = ({ className = '' }) => {
  const { theme, setAccentColor, setCustomAccentColor } = useTheme();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const handleColorChange = (color: string) => {
    setCustomAccentColor(color);
  };
  
  const colorOptions: { color: AccentColor; label: string }[] = [
    { color: 'blue', label: 'Blue' },
    { color: 'green', label: 'Green' },
    { color: 'purple', label: 'Purple' },
    { color: 'orange', label: 'Orange' },
    { color: 'red', label: 'Red' },
    { color: 'custom', label: 'Custom' }
  ];
  
  return (
    <div className={`accent-color-picker ${className}`}>
      <h3 className="text-lg font-medium mb-3">Accent Color</h3>
      
      <div className="color-options flex flex-wrap gap-3">
        {colorOptions.map(option => (
          <button
            key={option.color}
            className={`color-option w-10 h-10 rounded-full border-2 ${
              theme.accentColor === option.color 
                ? 'border-gray-800 dark:border-white' 
                : 'border-transparent'
            }`}
            style={{
              backgroundColor: option.color === 'custom' && theme.customAccentColor
                ? theme.customAccentColor
                : `var(--${option.color})`,
              ...(option.color === 'custom' && !theme.customAccentColor && {
                background: 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6, #10b981, #2563eb)'
              })
            }}
            onClick={() => {
              setAccentColor(option.color);
              if (option.color === 'custom') {
                setShowCustomPicker(true);
              }
            }}
            aria-label={`${option.label} accent color`}
            title={option.label}
          >
            {theme.accentColor === option.color && (
              <span className="flex items-center justify-center h-full text-white">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
      
      {showCustomPicker && (
        <div className="custom-color-picker mt-4">
          <label className="block text-sm font-medium mb-1">
            Choose custom color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={theme.customAccentColor || '#2563eb'}
              onChange={e => handleColorChange(e.target.value)}
              className="w-10 h-10 p-0 border-0"
              aria-label="Select custom color"
            />
            <input
              type="text"
              value={theme.customAccentColor || '#2563eb'}
              onChange={e => handleColorChange(e.target.value)}
              className="border rounded p-2 w-32"
              placeholder="#RRGGBB"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            />
            <button
              onClick={() => setShowCustomPicker(false)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              aria-label="Close color picker"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccentColorPicker;
