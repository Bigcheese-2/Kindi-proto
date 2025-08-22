"use client";

import React, { useState, useEffect } from 'react';
import { 
  getExportPreferences, 
  saveExportPreferences,
  ExportPreferences,
  ExportConfiguration,
  deleteExportConfiguration
} from '@/app/lib/export/exportSettings';

interface ExportSettingsProps {
  onClose: () => void;
}

const ExportSettings: React.FC<ExportSettingsProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<ExportPreferences>(getExportPreferences());
  
  // Update preferences in state
  const updatePreferences = (updates: Partial<ExportPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };
  
  // Save preferences
  const handleSave = () => {
    saveExportPreferences(preferences);
    onClose();
  };
  
  // Delete a custom configuration
  const handleDeleteConfiguration = (id: string) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      deleteExportConfiguration(id);
      setPreferences(prev => ({
        ...prev,
        customExportConfigurations: prev.customExportConfigurations.filter(
          config => config.id !== id
        )
      }));
    }
  };
  
  // Reset to defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all export settings to defaults?')) {
      // Clear from local storage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('exportPreferences');
      }
      // Reload default preferences
      setPreferences(getExportPreferences());
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Export Settings</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-3">Default Formats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="defaultImageFormat" className="block text-sm font-medium mb-1">
                  Image Format
                </label>
                <select
                  id="defaultImageFormat"
                  value={preferences.defaultImageFormat}
                  onChange={e => updatePreferences({ defaultImageFormat: e.target.value as any })}
                  className="w-full border rounded p-2"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultDataFormat" className="block text-sm font-medium mb-1">
                  Data Format
                </label>
                <select
                  id="defaultDataFormat"
                  value={preferences.defaultDataFormat}
                  onChange={e => updatePreferences({ defaultDataFormat: e.target.value as any })}
                  className="w-full border rounded p-2"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-3">Quality Settings</h3>
            
            <div className="form-group">
              <label htmlFor="imageQuality" className="block text-sm font-medium mb-1">
                Image Quality: {preferences.imageQuality}%
              </label>
              <input
                type="range"
                id="imageQuality"
                min="10"
                max="100"
                value={preferences.imageQuality}
                onChange={e => updatePreferences({ imageQuality: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-3">Naming & Metadata</h3>
            
            <div className="form-group mb-3">
              <label htmlFor="defaultNamingPattern" className="block text-sm font-medium mb-1">
                Default Naming Pattern
              </label>
              <input
                type="text"
                id="defaultNamingPattern"
                value={preferences.defaultNamingPattern}
                onChange={e => updatePreferences({ defaultNamingPattern: e.target.value })}
                className="w-full border rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available placeholders: {'{type}'}, {'{date}'}, {'{time}'}
              </p>
            </div>
            
            <div className="form-group">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.includeMetadata}
                  onChange={e => updatePreferences({ includeMetadata: e.target.checked })}
                  className="mr-2"
                />
                <span>Include metadata by default</span>
              </label>
            </div>
          </div>
          
          {preferences.customExportConfigurations.length > 0 && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-3">Saved Configurations</h3>
              
              <div className="space-y-2">
                {preferences.customExportConfigurations.map(config => (
                  <div 
                    key={config.id}
                    className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{config.name}</h4>
                      <p className="text-sm text-gray-500">
                        {config.type} - {config.format.toUpperCase()}
                      </p>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteConfiguration(config.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 text-red-600 hover:text-red-800"
            onClick={handleResetToDefaults}
          >
            Reset to Defaults
          </button>
          
          <div className="space-x-2">
            <button
              className="px-4 py-2 border rounded hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSettings;
