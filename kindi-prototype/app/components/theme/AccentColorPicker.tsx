"use client";

import { useState } from 'react';
import { useTheme, AccentColor } from '@/app/contexts/ThemeContext';

const AccentColorPicker: React.FC = () => {
  const { theme, setAccentColor, setCustomAccentColor } = useTheme();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const handleColorChange = (color: string) => {
    setCustomAccentColor(color);
  };
  
  return (
    <div className="accent-color-picker">
      <h3 className="text-sm font-medium text-neutral-light mb-2">Accent Color</h3>
      
      <div className="color-options flex flex-wrap gap-2">
        <button
          className={`color-option w-8 h-8 rounded-full bg-blue-600 ${theme.accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-white' : ''}`}
          onClick={() => setAccentColor('blue')}
          aria-label="Blue accent color"
        />
        <button
          className={`color-option w-8 h-8 rounded-full bg-green-600 ${theme.accentColor === 'green' ? 'ring-2 ring-offset-2 ring-white' : ''}`}
          onClick={() => setAccentColor('green')}
          aria-label="Green accent color"
        />
        <button
          className={`color-option w-8 h-8 rounded-full bg-purple-600 ${theme.accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-white' : ''}`}
          onClick={() => setAccentColor('purple')}
          aria-label="Purple accent color"
        />
        <button
          className={`color-option w-8 h-8 rounded-full bg-orange-500 ${theme.accentColor === 'orange' ? 'ring-2 ring-offset-2 ring-white' : ''}`}
          onClick={() => setAccentColor('orange')}
          aria-label="Orange accent color"
        />
        <button
          className={`color-option w-8 h-8 rounded-full bg-red-600 ${theme.accentColor === 'red' ? 'ring-2 ring-offset-2 ring-white' : ''}`}
          onClick={() => setAccentColor('red')}
          aria-label="Red accent color"
        />
        <button
          className={`color-option w-8 h-8 rounded-full flex items-center justify-center border ${theme.accentColor === 'custom' ? 'ring-2 ring-offset-2 ring-white' : 'border-gray-400'}`}
          style={
            theme.accentColor === 'custom' && theme.customAccentColor
              ? { backgroundColor: theme.customAccentColor }
              : { backgroundColor: 'transparent' }
          }
          onClick={() => {
            setAccentColor('custom');
            setShowCustomPicker(true);
          }}
          aria-label="Custom accent color"
        >
          {theme.accentColor !== 'custom' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-light" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {showCustomPicker && (
        <div className="custom-color-picker mt-3">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={theme.customAccentColor || '#2563eb'}
              onChange={(e) => handleColorChange(e.target.value)}
              aria-label="Select custom color"
              className="w-8 h-8 rounded border-0"
            />
            <input 
              type="text" 
              value={theme.customAccentColor || '#2563eb'} 
              onChange={(e) => handleColorChange(e.target.value)}
              className="px-2 py-1 text-sm bg-secondary text-neutral-light border border-gray-700 rounded"
            />
            <button
              onClick={() => setShowCustomPicker(false)}
              className="close-picker px-2 py-1 text-sm bg-secondary text-neutral-light border border-gray-700 rounded hover:bg-gray-700"
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
